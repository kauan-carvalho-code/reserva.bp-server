import { type AuthenticateUserUseCase } from '../use-cases/authenticate-user-use-case'

import { type Controller } from '../../../core/controller'

import { clientError, ok, fail, type HttpResponse } from '../../../core/http-response'

interface AuthenticateUserControllerRequest {
  email: string
  password: string
}

export class AuthenticateUserController implements Controller {
  constructor (private readonly authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle (request: AuthenticateUserControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.authenticateUserUseCase.execute({
        email: request.email,
        password: request.password
      })

      if (result instanceof Error) {
        return clientError(result)
      }

      return ok({ token: result.token })
    } catch (error) {
      return fail(error)
    }
  }
}
