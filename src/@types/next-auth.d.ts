/* eslint-disable no-unused-vars */

import { Role } from '@prisma/client'
declare module 'next-auth' {
  interface User {
    email?: string
    id: string
    name: string
    role: Role
  }

  interface Session {
    user: User
  }
}
