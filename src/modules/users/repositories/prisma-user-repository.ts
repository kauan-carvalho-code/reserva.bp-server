import { type UserRepository } from './user-repository'

import { prisma } from '../../../database/prisma'

import { type User } from '@prisma/client'

const defaultSelect = {
  id: true,
  name: true,
  email: true,
  role: true
}

export class PrismaUserRepository implements UserRepository {
  async create (user: User) {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role
      },
      select: defaultSelect
    })

    return newUser
  }

  async findByEmail (email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    return user
  }

  async findById (id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id
      },
      select: defaultSelect
    })

    return user
  }

  async getBrokers () {
    const users = await prisma.user.findMany({
      where: {
        role: 'broker'
      },
      select: defaultSelect
    })

    return users
  }
}
