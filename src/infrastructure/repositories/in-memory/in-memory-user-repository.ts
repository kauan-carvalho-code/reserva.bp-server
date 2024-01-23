import { type User } from '../../../modules/accounts/domain/user'

import { type UserRepositoryImpl } from '../../../modules/accounts/repositories/user-repository-impl'

export class InMemoryUserRepository implements UserRepositoryImpl {
  users: User[] = []

  async save (user: User): Promise<void> {
    await Promise.resolve(this.users.push(user))
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await Promise.resolve(this.users.find(user => user.email === email))
    return user ?? null
  }
}
