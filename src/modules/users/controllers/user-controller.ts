import { type Request, type Response } from 'express'

import { type CreateUserService } from '../services/create-user-service'
import { type GetUserService } from '../services/get-user-service'
import { type GetBrokersService } from '../services/get-brokers-service'

import { HTTP_CODES } from '../../../shared/http-codes'

import { CreateUserError } from '../services/errors/create-user-error'
import { GetUserError } from '../services/errors/get-user-error'

export class UserController {
  constructor (
    private readonly createUserService: CreateUserService,
    private readonly getUserService: GetUserService,
    private readonly getBrokersService: GetBrokersService
  ) {
    this.createUser = this.createUser.bind(this)
    this.getUser = this.getUser.bind(this)
    this.getBrokers = this.getBrokers.bind(this)
  }

  async createUser (request: Request, response: Response) {
    try {
      const user = await this.createUserService.execute(request.body)

      response.status(HTTP_CODES.CREATED).json({ data: user })
    } catch (error) {
      if (error instanceof CreateUserError) {
        return response.status(HTTP_CODES.BAD_REQUEST).json({ error: error.message })
      }

      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }

  async getUser (request: Request, response: Response) {
    try {
      const { id } = request.user

      const user = await this.getUserService.execute({ id })

      response.status(HTTP_CODES.OK).json({ data: user })
    } catch (error) {
      if (error instanceof GetUserError) {
        return response.status(HTTP_CODES.NOT_FOUND).json({ error: error.message })
      }

      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }

  async getBrokers (_request: Request, response: Response) {
    try {
      const users = await this.getBrokersService.execute()

      response.status(HTTP_CODES.OK).json({ data: users })
    } catch (error) {
      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }
}
