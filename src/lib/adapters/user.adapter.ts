import type { User } from 'better-auth'
import type { UserDetails } from '../types'

const adaptUser = (user: User): UserDetails => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export default adaptUser
