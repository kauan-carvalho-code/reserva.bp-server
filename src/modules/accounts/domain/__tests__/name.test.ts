import { describe, expect, it } from 'vitest'

import { Name } from '../name'

import { InvalidNameError } from '../errors/invalid-name-error'

describe('NameEntity', () => {
  it('should create a Name instance for valid name', () => {
    const name = Name.create('John Doe')
    expect(name).toBeInstanceOf(Name)
  })

  it('should throw InvalidNameError for invalid name', () => {
    const name = Name.create('c'.repeat(256))
    expect(name).toBeInstanceOf(InvalidNameError)
  })
})
