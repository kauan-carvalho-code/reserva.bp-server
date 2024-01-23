import { User } from '../../../modules/accounts/domain/user'

import { type UserRepositoryImpl } from '../../../modules/accounts/repositories/user-repository-impl'

import { prisma } from '../../database/prisma'

export class PrismaUserRepository implements UserRepositoryImpl {
  async save (user: User): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.id,
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

    if (user) {
      return User.create({
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      }, user.id)
    }

    return null
  }
}
