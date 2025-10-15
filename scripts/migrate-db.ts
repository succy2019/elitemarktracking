import Database from 'better-sqlite3'

const db = new Database('elite.db')

console.log('Starting database migration...')

try {
  // Check if new columns exist by trying to select them
  try {
    db.prepare('SELECT track_id FROM users LIMIT 1').get()
    console.log('New columns already exist.')
  } catch (error) {
    console.log('Adding new columns to users table...')
    
    // Add new columns to existing users table
    const migrations = [
      'ALTER TABLE users ADD COLUMN track_id TEXT UNIQUE',
      'ALTER TABLE users ADD COLUMN payment_to TEXT NOT NULL DEFAULT "Merchant Commercial Bank"',
      'ALTER TABLE users ADD COLUMN account_number TEXT NOT NULL DEFAULT "0012239988"',
      'ALTER TABLE users ADD COLUMN estimated_processing_time TEXT NOT NULL DEFAULT "1-2 minutes"',
      'ALTER TABLE users ADD COLUMN money_due TEXT NOT NULL DEFAULT ""',
      'ALTER TABLE users ADD COLUMN progress_percentage INTEGER NOT NULL DEFAULT 0'
    ]

    for (const migration of migrations) {
      try {
        db.exec(migration)
        console.log(`✓ ${migration}`)
      } catch (err) {
        console.log(`⚠ Skipping: ${migration} (might already exist)`)
      }
    }

    // Generate track_id for existing users
    console.log('Generating track IDs for existing users...')
    const users = db.prepare('SELECT id FROM users WHERE track_id IS NULL').all()
    
    for (const user of users as any[]) {
      const timestamp = Date.now().toString(36)
      const randomStr = Math.random().toString(36).substring(2, 8)
      const trackId = `TRK-${timestamp}-${randomStr}`.toUpperCase()
      
      db.prepare('UPDATE users SET track_id = ? WHERE id = ?').run(trackId, user.id)
      console.log(`Generated track ID ${trackId} for user ${user.id}`)
    }

    // Update money_due to match amount for existing users
    db.prepare('UPDATE users SET money_due = amount WHERE money_due = ""').run()
    console.log('Updated money_due field for existing users')
  }

  console.log('Database migration completed successfully!')
} catch (error) {
  console.error('Migration failed:', error)
} finally {
  db.close()
}