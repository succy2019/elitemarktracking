import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.get('/', (c) => {
  return c.json({ message: 'Elite Management Tracking API is running!', timestamp: new Date().toISOString() })
})

app.get('/test', (c) => {
  return c.json({ 
    message: 'Test endpoint working!',
    env: process.env.NODE_ENV || 'development'
  })
})

export default handle(app)