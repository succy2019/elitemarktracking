import { Hono } from 'hono'
import { authMiddleware } from './middleware/authmiddleware'
import authRoute from './routes/authRoutes'
import userRoute from './routes/userRoutes'
import { login, changePassword } from './controller/authController'
import { getUserByTrackId } from './controller/userController'
import { handle } from 'hono/vercel'
import 'dotenv/config'

const app = new Hono().basePath('/api')

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

export default app
