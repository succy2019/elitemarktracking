import { Database } from 'bun:sqlite'
import { User, Track, UserSettings, Admin } from '../types/database'

// Initialize database connection
const db = new Database('elite.db')

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Create tables if they don't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    amount TEXT NOT NULL,
    status TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    message TEXT NOT NULL,
    track_id TEXT UNIQUE NOT NULL,
    payment_to TEXT NOT NULL DEFAULT 'Merchant Commercial Bank',
    account_number TEXT NOT NULL DEFAULT '0012239988',
    estimated_processing_time TEXT NOT NULL DEFAULT '1-2 minutes',
    money_due TEXT NOT NULL,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)


db.run(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

// ✅ Database client class
export class DbClient {
  private db: Database

  constructor() {
    
    this.db = new Database('elite.db')
    this.db.run('PRAGMA foreign_keys = ON')
  }

  // Generate unique track ID
  private generateTrackId(): string {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `TRK-${timestamp}-${randomStr}`.toUpperCase()
  }

  createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'track_id'>): number {
    const trackId = this.generateTrackId()
    const query = this.db.prepare(
      `INSERT INTO users (email, name, amount, status, phone, address, message, track_id, payment_to, account_number, estimated_processing_time, money_due, progress_percentage) 
       VALUES ($email, $name, $amount, $status, $phone, $address, $message, $track_id, $payment_to, $account_number, $estimated_processing_time, $money_due, $progress_percentage)`
    )
    const result = query.run({
      $email: user.email,
      $name: user.name,
      $amount: user.amount,
      $status: user.status,
      $phone: user.phone,
      $address: user.address,
      $message: user.message,
      $track_id: trackId,
      $payment_to: user.payment_to || 'Merchant Commercial Bank',
      $account_number: user.account_number || '0012239988',
      $estimated_processing_time: user.estimated_processing_time || '1-2 minutes',
      $money_due: user.money_due || user.amount,
      $progress_percentage: user.progress_percentage || 0
    })
    return Number(result.lastInsertRowid)
  }

  getUserById(id: number): User | null {
    const query = this.db.prepare('SELECT * FROM users WHERE id = $id')
    return query.get({ $id: id }) as User | null
  }

  getUserByEmail(email: string): User | null {
    const query = this.db.prepare('SELECT * FROM users WHERE email = $email')
    return query.get({ $email: email }) as User | null
  }

  getUserByTrackId(trackId: string): User | null {
    const query = this.db.prepare('SELECT * FROM users WHERE track_id = $track_id')
    return query.get({ $track_id: trackId }) as User | null
  }


  deleteUser(id: number): void {
    const query = this.db.prepare('DELETE FROM users WHERE id = $id')
    query.run({ $id: id })
  }

  updateUserProfile(
    userId: number, 
    name: string, 
    email: string, 
    amount: string, 
    status: string, 
    message: string, 
    address: string, 
    phone: string,
    payment_to?: string,
    account_number?: string,
    estimated_processing_time?: string,
    money_due?: string,
    progress_percentage?: number
  ): User | null {
    const query = this.db.prepare(`
      UPDATE users 
      SET name = $name,
          email = $email,
          amount = $amount,
          status = $status,
          message = $message,
          address = $address,
          phone = $phone,
          payment_to = $payment_to,
          account_number = $account_number,
          estimated_processing_time = $estimated_processing_time,
          money_due = $money_due,
          progress_percentage = $progress_percentage,
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $id
    `)

    query.run({
      $id: userId,
      $name: name,
      $email: email,
      $amount: amount,
      $status: status,
      $message: message,
      $address: address,
      $phone: phone,
      $payment_to: payment_to || 'Merchant Commercial Bank',
      $account_number: account_number || '0012239988',
      $estimated_processing_time: estimated_processing_time || '1-2 minutes',
      $money_due: money_due || amount,
      $progress_percentage: progress_percentage || 0
    })

    return this.getUserById(userId)
  }

  updateUserProgress(userId: number, progressPercentage: number): User | null {
    const query = this.db.prepare(`
      UPDATE users 
      SET progress_percentage = $progress_percentage,
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = $id
    `)
    query.run({
      $id: userId,
      $progress_percentage: progressPercentage
    })
    return this.getUserById(userId)
  }

  updateAdminPassword(email: string, password: string): void {
    const query = this.db.prepare(`
      UPDATE admins 
      SET password = $password, updated_at = CURRENT_TIMESTAMP 
      WHERE email = $email
    `)
    query.run({ $email: email, $password: password })
  }

  getAdminByEmail(email: string): Admin | null {
    const query = this.db.prepare('SELECT * FROM admins WHERE email = $email')
    return query.get({ $email: email }) as Admin | null
  }

  getAllUsers(): User[] {
    const query = this.db.prepare('SELECT * FROM users ORDER BY created_at DESC')
    return query.all() as User[]
  }

  createAdmin(admin: { email: string; password: string }): number {
    const query = this.db.prepare(
      'INSERT INTO admins (email, password) VALUES ($email, $password)'
    )
    const result = query.run({
      $email: admin.email,
      $password: admin.password
    })
    return Number(result.lastInsertRowid)
  }

}

// ✅ Export single shared instance
export const dbClient = new DbClient()
export default dbClient
