import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

// Simple test route
app.get('/test', (c) => {
  return c.json({ message: 'API is working!' })
})

// Basic error handling
app.onError((err, c) => {
  console.error('API Error:', err)
  return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// For Vercel
export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)