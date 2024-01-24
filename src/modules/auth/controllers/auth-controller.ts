import { type Request, type Response } from 'express'

import { type SignInService } from '../services/sign-in-service'
import { type CreateUserService } from '../../users/services/create-user-service'

import { HTTP_CODES } from '../../../shared/http-codes'

import { ACCESS_TOKEN_KEY } from '../../../config/auth'

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
      const tokenOrError = await this.signInService.execute(request.body)

      if (tokenOrError instanceof Error) {
        response.status(HTTP_CODES.UNAUTHORIZED).json({ error: tokenOrError.message })
        return
      }

      response.cookie(ACCESS_TOKEN_KEY, tokenOrError, { httpOnly: true })

      response.status(HTTP_CODES.OK).json({ message: 'Login successful' })
    } catch (error) {
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async signUp (request: Request, response: Response): Promise<void> {
    try {
      const userOrError = await this.createUserService.execute(request.body)

      if (userOrError instanceof Error) {
        response.status(HTTP_CODES.BAD_REQUEST).json({ error: userOrError.message })
        return
      }

      response.status(HTTP_CODES.CREATED).json({ user: userOrError })
    } catch (error) {
      console.log(error)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async signOut (_request: Request, response: Response): Promise<void> {
    try {
      response.clearCookie(ACCESS_TOKEN_KEY)
      response.status(HTTP_CODES.OK).send({ message: 'Logout successful' })
    } catch (error) {
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
