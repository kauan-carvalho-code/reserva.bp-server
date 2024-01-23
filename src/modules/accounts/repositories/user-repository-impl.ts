import { type User } from '../domain/user'

export interface UserRepositoryImpl {
  save: (user: User) => Promise<void>
  findByEmail: (email: string) => Promise<User | null>
}
