const { Hono } = require('hono')

const app = new Hono()

app.get('/api', (c) => {
  return c.json({ 
    message: 'Elite Management Tracking API is running!', 
    timestamp: new Date().toISOString(),
    status: 'OK'
  })
})

app.get('/api/test', (c) => {
  return c.json({ 
    message: 'Test endpoint working!',
    env: process.env.NODE_ENV || 'development'
  })
})

app.get('/api/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

// Export for Vercel
module.exports = app
module.exports.default = app