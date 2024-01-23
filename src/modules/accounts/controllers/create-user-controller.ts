import { type CreateUserUseCase } from '../use-cases/create-user-use-case'

import { type Controller } from '../../../core/controller'

import { clientError, conflict, created, fail, type HttpResponse } from '../../../core/http-response'

interface CreateUserControllerRequest {
  name: string
  email: string
  password: string
  role: string
}

export class CreateUserController implements Controller {
  constructor (private readonly createUserUseCase: CreateUserUseCase) {}

  async handle (request: CreateUserControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.createUserUseCase.execute({
        name: request.name,
        email: request.email,
        password: request.password,
        role: request.role
      })

      if (result instanceof Error) {
        switch (result.name) {
          case 'UserAlreadyExistsError': {
            return conflict(result)
          }

          default: {
            return clientError(result)
          }
        }
      }

      return created()
    } catch (error) {
      return fail(error)
    }
  }
}
