import 'dotenv/config'
import { dbClient } from '../src/db/index.js'
import { hashPassword } from '../src/controller/authController.js'

// Initialize database and create default admin
async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Check if admin already exists
    const existingAdmin = dbClient.getAdminByEmail('admin@elitemgtracking.com')
    
    if (!existingAdmin) {
      // Create default admin
      const defaultPassword = 'ChangeMe123!'
      const hashedPassword = hashPassword(defaultPassword)
      
      const adminId = dbClient.createAdmin({
        email: 'admin@elitemgtracking.com',
        password: hashedPassword
      })
      
      console.log('✅ Default admin created successfully!')
      console.log('📧 Email: admin@elitemgtracking.com')
      console.log('🔑 Password:', defaultPassword)
      console.log('⚠️  IMPORTANT: Change this password immediately after first login!')
      
      return adminId
    } else {
      console.log('ℹ️  Admin user already exists')
      return existingAdmin.id
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error)
      process.exit(1)
    })
}

export { initializeDatabase }