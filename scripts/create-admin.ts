import { dbClient } from '../src/db'
import { hashPassword } from '../src/controller/authController'

async function initializeAdmin() {
  try {
    const email = 'admin@example.com'
    const password = 'admin123'

    // Hash the password
    const hashedPassword = await hashPassword(password)

    // Create admin account
    await dbClient.createAdmin({
      email,
      password: hashedPassword
    })

    console.log('Admin user created successfully!')
    console.log('Email:', email)
    console.log('Password:', password)
    console.log('(Make sure to change these credentials in production)')
  } catch (error) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      console.log('Admin user already exists')
    } else {
      console.error('Error creating admin:', error)
    }
  }
}

initializeAdmin()