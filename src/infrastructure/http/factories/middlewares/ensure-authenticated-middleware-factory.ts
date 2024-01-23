import { type Middleware } from '../../../../core/middleware'

import { EnsureAuthenticatedMiddleware } from '../../../../modules/accounts/middlewares/ensure-authenticated-middleware'

export function makeEnsureAuthenticatedMiddleware (): Middleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

  return ensureAuthenticatedMiddleware
}
