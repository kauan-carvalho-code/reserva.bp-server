import { type NextFunction, type Request, type Response } from 'express'

import jwt from 'jsonwebtoken'

import { HTTP_CODES } from '../../../shared/http-codes'

import { ACCESS_TOKEN_KEY } from '../../../config/auth'

interface DecodedJwt {
  id: string
  role: string
}

export class EnsureAuthenticatedMiddleware {
  async handle (request: Request, response: Response, next: NextFunction) {
    const token = request.cookies[ACCESS_TOKEN_KEY]

    if (token) {
      const decodedToken = jwt.decode(token) as DecodedJwt

      request.user = decodedToken

      next()
    } else {
      response.status(HTTP_CODES.UNAUTHORIZED).json({ error: 'Unauthorized' })
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      user: DecodedJwt
    }
  }
}
