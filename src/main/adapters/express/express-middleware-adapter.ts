import { HttpRequest } from '@/presentation/protocols'
import { Middleware } from '@/presentation/protocols/middleware'
import { NextFunction, Request, Response } from 'express'

export const expressMiddlewareAdapter = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      cookies: req.cookies
    }
    const httpResponse = await middleware.handle(httpRequest)

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
