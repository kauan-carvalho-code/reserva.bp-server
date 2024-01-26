import { type Request, type Response } from 'express'

import { type SignInService } from '../services/sign-in-service'
import { type CreateUserService } from '../../users/services/create-user-service'

import { HTTP_CODES } from '../../../shared/http-codes'

import { ACCESS_TOKEN_KEY } from '../../../config/auth'

import { SignInError } from '../services/errors/sign-in-error'
import { CreateUserError } from '../../users/services/errors/create-user-error'

export class AuthController {
  constructor (
    private readonly signInService: SignInService,
    private readonly createUserService: CreateUserService
  ) {
    this.signIn = this.signIn.bind(this)
    this.signUp = this.signUp.bind(this)
    this.signOut = this.signOut.bind(this)
  }

  async signIn (request: Request, response: Response): Promise<void> {
    try {
      const token = await this.signInService.execute(request.body)

      response.cookie(ACCESS_TOKEN_KEY, token, { httpOnly: true })

      response.status(HTTP_CODES.OK).json({ message: 'Login successful' })
    } catch (error) {
      if (error instanceof SignInError) {
        response.status(HTTP_CODES.UNAUTHORIZED).json({ error: error.message })
        return
      }

      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }

  async signUp (request: Request, response: Response): Promise<void> {
    try {
      const user = await this.createUserService.execute(request.body)

      response.status(HTTP_CODES.CREATED).json({ user })
    } catch (error) {
      if (error instanceof CreateUserError) {
        response.status(HTTP_CODES.BAD_REQUEST).json({ error: error.message })
        return
      }

      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }

  async signOut (_request: Request, response: Response): Promise<void> {
    try {
      response.clearCookie(ACCESS_TOKEN_KEY)
      response.status(HTTP_CODES.OK).send({ message: 'Logout successful' })
    } catch (error) {
      response.status(HTTP_CODES.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
    }
  }
}
