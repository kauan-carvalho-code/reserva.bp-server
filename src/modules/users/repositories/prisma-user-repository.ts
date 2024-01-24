import { type User } from '../models/user'

import { type UserRepository } from './user-repository'

import { prisma } from '../../../database/prisma'

export class PrismaUserRepository implements UserRepository {
  async save (user: User): Promise<void> {
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      }
    })
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    return user
  }
}
