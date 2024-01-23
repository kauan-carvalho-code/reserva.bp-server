import { randomUUID } from 'crypto'

export interface UserAttributes {
  name: string
  email: string
  password: string
  role: string
}

export class User {
  protected readonly _id: string
  protected readonly attributes: UserAttributes

  get id (): string {
    return this._id
  }

  get name (): string {
    return this.attributes.name
  }

  get email (): string {
    return this.attributes.email
  }

  get password (): string {
    return this.attributes.password
  }

  get role (): string {
    return this.attributes.role
  }

  private constructor (attributes: UserAttributes, id?: string) {
    this._id = id ?? randomUUID()
    this.attributes = attributes
  }

  static create (attributes: UserAttributes, id?: string): User {
    const user = new User(attributes, id)
    return user
  }
}
