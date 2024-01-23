import { type Request, type Response } from 'express'

import { type Controller } from '../../core/controller'

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query
    }

    const httpResponse = await controller.handle(requestData)

    return response.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
