import { decode } from 'jsonwebtoken'

import { type Middleware } from '../../../core/middleware'

import { forbidden, ok, fail, type HttpResponse } from '../../../core/http-response'

import { AccessDeniedError } from './errors/access-denied-error'

interface EnsureAuthenticatedMiddlewareRequest {
  accessToken: string
}

interface DecodedJwt {
  sub: string
}

export class EnsureAuthenticatedMiddleware implements Middleware {
  async handle (
    request: EnsureAuthenticatedMiddlewareRequest
  ): Promise<HttpResponse> {
    try {
      const { accessToken } = request

      if (accessToken) {
        try {
          const decoded = decode(accessToken) as DecodedJwt

          console.log('decoded: ', decoded)

          return ok({ userId: decoded.sub })
        } catch (err) {
          return forbidden(new AccessDeniedError())
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return fail(error)
    }
  }
}
