import { Context } from 'hono'
import { sign } from 'hono/jwt'
import { dbClient } from '../db'

export const login = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { email, password } = body

        if (!email || !password) {
            return c.json({ message: 'Email and password are required' }, 400)
        }

        // Get admin user since this is an admin login
        const admin = await dbClient.getAdminByEmail(email)
        if (!admin) {
            return c.json({ message: 'Invalid email or password' }, 401)
        }

        // Compare hashed password
        const passwordMatch = await Bun.password.verify(password, admin.password)
        if (!passwordMatch) {
            return c.json({ message: 'Invalid email or password' }, 401)
        }

        // Create payload without sensitive data
        const payload = {
            id: admin.id,
            email: admin.email,
            role: 'admin'
        }

        // Sign token with Bun.env.JWT_SECRET
        const token = await sign(payload, Bun.env.JWT_SECRET as string)

        return c.json({
            message: 'Login successful',
            token,
            admin: payload
        })
    } catch (error) {
        console.error('Login error:', error)
        return c.json({ message: 'An error occurred during login' }, 500)
    }
}

// Function to hash password before storing
export const hashPassword = async (password: string): Promise<string> => {
    return await Bun.password.hash(password)
}

export const changePassword = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { currentPassword, newPassword } = body

        if (!currentPassword || !newPassword) {
            return c.json({ message: 'Current password and new password are required' }, 400)
        }

        if (newPassword.length < 6) {
            return c.json({ message: 'New password must be at least 6 characters long' }, 400)
        }

        // Get admin email from JWT payload (set by auth middleware)
        const adminData = c.get('admin')
        if (!adminData || !adminData.email) {
            return c.json({ message: 'Admin not authenticated' }, 401)
        }

        // Get admin from database
        const admin = await dbClient.getAdminByEmail(adminData.email)
        if (!admin) {
            return c.json({ message: 'Admin not found' }, 404)
        }

        // Verify current password
        const currentPasswordMatch = await Bun.password.verify(currentPassword, admin.password)
        if (!currentPasswordMatch) {
            return c.json({ message: 'Current password is incorrect' }, 401)
        }

        // Hash new password
        const hashedNewPassword = await hashPassword(newPassword)

        // Update password in database
        await dbClient.updateAdminPassword(admin.email, hashedNewPassword)

        return c.json({
            message: 'Password changed successfully'
        })
    } catch (error) {
        console.error('Change password error:', error)
        return c.json({ message: 'An error occurred while changing password' }, 500)
    }
}
