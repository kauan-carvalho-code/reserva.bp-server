import { type User } from '../models/user'

export interface UserRepository {
  save: (user: User) => Promise<void>
  findByEmail: (email: string) => Promise<User | null>
}
