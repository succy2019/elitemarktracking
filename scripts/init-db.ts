import { dbClient } from '../src/db'

console.log('Initializing database...')

// The database and tables will be automatically created when we instantiate the client
console.log('Database initialized successfully!')

// Optional: Add some test data
function addTestData() {
  try {
    // Create a test user with the new interface
    const userId = dbClient.createUser({
      email: 'test@example.com',
      name: 'Test User',
      amount: '₦50,000.00',
      status: 'pending',
      phone: '+234-803-123-4567',
      address: '123 Test Street, Lagos, Nigeria',
      message: 'Test payment for Elite Management services',
      payment_to: 'Elite Management Bank',
      account_number: '0012345678',
      estimated_processing_time: '2-3 minutes',
      money_due: '₦50,000.00',
      progress_percentage: 15
    })

    console.log(`Test user created with ID: ${userId}`)
    
    // Get the created user to show the track ID
    const createdUser = dbClient.getUserById(userId)
    if (createdUser) {
      console.log(`Track ID: ${createdUser.track_id}`)
      console.log(`Tracking URL: http://localhost:3000/track.html/${createdUser.track_id}`)
    }

    console.log('Test data added successfully!')
  } catch (error) {
    console.error('Error adding test data:', error)
  }
}

// Uncomment the next line to add test data
addTestData()