import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { authMiddleware } from './middleware/authmiddleware'
import authRoute from './routes/authRoutes'
import userRoute from './routes/userRoutes'
import { login, changePassword } from './controller/authController'
import { getUserByTrackId } from './controller/userController'

const app = new Hono()

// Handle track.html with track ID
app.get('/track.html/:trackId', serveStatic({ path: './public/track.html' }))

app.use('/*', serveStatic({ root: './public' }));

// Public API routes (no auth required)
app.get('/api/users/track/:trackId', getUserByTrackId)

// Auth routes
app.post('/auth/login', login) // Public login
app.put('/auth/change-password', authMiddleware, changePassword) // Protected change password

// Protected API routes (auth required)
app.use('/api/*', authMiddleware)
app.route('/api/users', userRoute)

export default app
