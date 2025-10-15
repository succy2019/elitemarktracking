import { Hono } from 'hono'
import { verify } from 'hono/jwt'
import type { Context, Next } from 'hono'
import 'dotenv/config'

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader) {
    return c.json({ message: 'Authorization header missing' }, 401)
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return c.json({ message: 'Token missing from Authorization header' }, 401)
  }

  try {
    const decoded = await verify(token, process.env.JWT_SECRET as string)
    c.set('user', decoded)
    c.set('admin', decoded) // Also set as admin for consistency
    await next()
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Invalid or expired token'
    return c.json({ message }, 401)
  }
}
