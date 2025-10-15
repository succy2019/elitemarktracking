import { Context } from 'hono'
import { dbClient } from '../db'
import type { User } from '../types/database'

export const newUser = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { 
            name, 
            email, 
            message, 
            amount, 
            status, 
            phone, 
            address,
            payment_to,
            account_number,
            estimated_processing_time,
            money_due,
            progress_percentage
        } = body

        if (!name || !email || !message || !amount || !status || !phone || !address) {
            return c.json({ message: 'All required fields must be provided' }, 400)
        }   

        const existingUser = await dbClient.getUserByEmail(email)
        if (existingUser) {
            return c.json({ message: 'Email already in use' }, 400)
        }

        const userId = await dbClient.createUser({
            name,
            email,
            message,
            amount,
            status,
            phone,
            address,
            payment_to: payment_to || 'Merchant Commercial Bank',
            account_number: account_number || '0012239988',
            estimated_processing_time: estimated_processing_time || '1-2 minutes',
            money_due: money_due || amount,
            progress_percentage: progress_percentage || 0
        })

        const newUser = await dbClient.getUserById(userId)
        if (!newUser) {
            return c.json({ message: 'User creation failed' }, 500)
        }

        // Generate tracking link
        const trackingLink = `${c.req.header('host') || 'localhost:3000'}/track.html/${newUser.track_id}`

        return c.json({
            message: 'User created successfully',
            user: newUser,
            tracking_link: `http://${trackingLink}`
        }, 201)
    } catch (error) {
        console.error('User creation error:', error)
        return c.json({ message: 'An error occurred during user creation' }, 500)
    }
}

export const userUpdate = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { 
            id, 
            name, 
            email, 
            message, 
            amount, 
            status, 
            phone, 
            address,
            payment_to,
            account_number,
            estimated_processing_time,
            money_due,
            progress_percentage
        } = body

        if (!id || !name || !email || !amount || !status || !phone || !address) {
            return c.json({ message: 'All required fields must be provided' }, 400)
        }

        // Check if user exists
        const existingUser = await dbClient.getUserById(id)
        if (!existingUser) {
            console.log('User not found:', id);
            return c.json({ message: 'User not found' }, 404)
        }

        console.log('Updating user:', id);
        const updatedUser = await dbClient.updateUserProfile(
            id,
            name,
            email,
            amount,
            status,
            message || '', // Provide empty string if message is null/undefined
            address,
            phone,
            payment_to,
            account_number,
            estimated_processing_time,
            money_due,
            progress_percentage
        )

        if (!updatedUser) {
            return c.json({ message: 'User update failed' }, 500)
        }

        return c.json({ 
            message: 'User updated successfully',
            user: updatedUser
        }, 200)
    } catch (error) {
        console.error('User update error:', error)
        return c.json({ message: 'An error occurred during user update' }, 500)
    }
}

export const deleteUser = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { id } = body

        if (!id) {
            return c.json({ message: 'User ID is required' }, 400)
        }

        const existingUser = await dbClient.getUserById(id)
        if (!existingUser) {
            return c.json({ message: 'User not found' }, 404)
        }

        await dbClient.deleteUser(id)
        return c.json({ message: 'User deleted successfully' }, 200)
    } catch (error) {
        console.error('User deletion error:', error)
        return c.json({ message: 'An error occurred during user deletion' }, 500)
    }
}

export const getUser = async (c: Context) => {
    try {
        console.log('=== getUser function called ===');
        console.log('Getting all users...');
        const getAllUser = await dbClient.getAllUsers();
        console.log('Found users:', getAllUser);
        console.log('Number of users:', getAllUser.length);
        return c.json({ users: getAllUser }, 200);
    } catch (error) {
        console.error('Error getting users:', error);
        return c.json({ message: 'An error occurred while fetching users' }, 500);
    }
}

export const getUserById = async (c: Context) => {
    try {
        const id = c.req.param('id')
        
        if (!id || isNaN(Number(id))) {
            return c.json({ message: 'Valid user ID is required' }, 400)
        }

        const user = await dbClient.getUserById(Number(id))
        
        if (!user) {
            return c.json({ message: 'User not found' }, 404)
        }

        return c.json({ user }, 200)
    } catch (error) {
        console.error('Error fetching user by ID:', error)
        return c.json({ message: 'An error occurred while fetching user' }, 500)
    }
}

export const getUserByTrackId = async (c: Context) => {
    try {
        const trackId = c.req.param('trackId')
        
        if (!trackId) {
            return c.json({ message: 'Track ID is required' }, 400)
        }

        const user = await dbClient.getUserByTrackId(trackId)
        
        if (!user) {
            return c.json({ message: 'User not found' }, 404)
        }

        return c.json({ user }, 200)
    } catch (error) {
        console.error('Error fetching user by track ID:', error)
        return c.json({ message: 'An error occurred while fetching user' }, 500)
    }
}

export const updateUserProgress = async (c: Context) => {
    try {
        const body = await c.req.json()
        const { id, progress_percentage } = body

        if (!id || progress_percentage === undefined) {
            return c.json({ message: 'User ID and progress percentage are required' }, 400)
        }

        if (progress_percentage < 0 || progress_percentage > 100) {
            return c.json({ message: 'Progress percentage must be between 0 and 100' }, 400)
        }

        const existingUser = await dbClient.getUserById(id)
        if (!existingUser) {
            return c.json({ message: 'User not found' }, 404)
        }

        const updatedUser = await dbClient.updateUserProgress(id, progress_percentage)

        return c.json({ 
            message: 'Progress updated successfully',
            user: updatedUser
        }, 200)
    } catch (error) {
        console.error('Progress update error:', error)
        return c.json({ message: 'An error occurred during progress update' }, 500)
    }
}
