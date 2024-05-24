import { Controller, HttpRequest } from '@/presentation/protocols'
import { Request, Response } from 'express'

export const expressRouteAdapter = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      accountId: req.accountId,
      reconnectToken: req.cookies?.token
    }
    const httpResponse = await controller.handle(httpRequest)

    if (httpResponse.headers) {
      for (const [key, value] of Object.entries(httpResponse.headers)) {
        if (value.type === 'cookie') {
          res.cookie(key, value.value, value.options)
        }
        if (value.type === 'clearCookie') {
          res.clearCookie(key, value.options)
        }
      }
    }

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
