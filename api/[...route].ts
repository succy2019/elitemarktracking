import { Hono } from 'hono'
import { authMiddleware } from '../src/middleware/authmiddleware'
import authRoute from '../src/routes/authRoutes'
import userRoute from '../src/routes/userRoutes'
import { login, changePassword } from '../src/controller/authController'
import { getUserByTrackId } from '../src/controller/userController'
import { handle } from 'hono/vercel'
import 'dotenv/config'

const app = new Hono()

// Initialize database on first request in production
let dbInitialized = false

app.use('*', async (c, next) => {
  if (!dbInitialized && process.env.NODE_ENV === 'production') {
    try {
      // Import and run database initialization
      const { initializeDatabase } = await import('../scripts/init-production.js')
      await initializeDatabase()
      dbInitialized = true
      console.log('Database initialized for production')
    } catch (error) {
      console.error('Failed to initialize database:', error)
    }
  }
  await next()
})

// Public API routes (no auth required)
app.get('/users/track/:trackId', getUserByTrackId)

// Auth routes
app.post('/auth/login', login) // Public login
app.put('/auth/change-password', authMiddleware, changePassword) // Protected change password

// Protected API routes (auth required)
app.use('/users/*', authMiddleware)
app.route('/users', userRoute)

// For Vercel
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)