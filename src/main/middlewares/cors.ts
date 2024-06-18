import { Request, Response, NextFunction } from 'express'
import env from '@/main/config/env'
export const cors = (req: Request, res: Response, next: NextFunction): void => {
  const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://172.20.10.4:8080', 'http://192.168.0.90:8080']
  const origin = req.headers.origin

  if (env.nodeEnvironment === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '')
  }

  if (env.nodeEnvironment === 'production') {
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Set-Cookie')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH')
  next()
}
