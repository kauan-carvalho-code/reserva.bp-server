import { type User } from '@prisma/client'

export interface UserRepository {
  create: (user: Omit<User, 'id'>) => Promise<Omit<User, 'password'>>
  findByEmail: (email: string) => Promise<User | null>
  findById: (id: string) => Promise<Omit<User, 'password'> | null>
  getAll: (role?: string) => Promise<Array<Omit<User, 'password'>>>
  getBrokers: () => Promise<Array<Omit<User, 'password'>>>
}
