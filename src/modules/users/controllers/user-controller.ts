import { type Request, type Response } from 'express'

import { type CreateUserService } from '../services/create-user-service'

import { HTTP_CODES } from '../../../shared/http-codes'

export class UserController {
  constructor (private readonly createUserService: CreateUserService) {
    this.createUser = this.createUser.bind(this)
  }

  async createUser (request: Request, response: Response): Promise<void> {
    try {
      const userOrError = await this.createUserService.execute(request.body)

      if (userOrError instanceof Error) {
        response.status(HTTP_CODES.BAD_REQUEST).json({ error: userOrError.message })
        return
      }

      response.status(HTTP_CODES.CREATED).json({ user: userOrError })
    } catch (error) {
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
