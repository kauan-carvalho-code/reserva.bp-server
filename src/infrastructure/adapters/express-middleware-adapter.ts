import { type Request, type Response, type NextFunction } from 'express'

import { type Middleware } from '../../core/middleware'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const requestData = {
      accessToken: request.headers?.['x-access-token'],
      ...(request.headers || {})
    }

    const httpResponse = await middleware.handle(requestData, request.body)

    if (httpResponse === false) {
      return response.status(200).send()
    }

    if (httpResponse.statusCode === 200) {
      Object.assign(request, httpResponse.body)

      next()
    } else {
      return response.status(httpResponse.statusCode).json({
        error: httpResponse.body.error
      })
    }
  }
}
