import { Adapter } from 'next-auth/adapters'
import prisma from '../prisma'
import { Role } from '@prisma/client'
import { env } from '@/env'

export function PrismaAdapter(): Adapter {
  return {
    async createSession({ expires, sessionToken, userId }) {
      const session = await prisma.session.create({
        data: {
          expires,
          sessionToken,
          userId,
        },
      })

      return {
        expires: session.expires,
        sessionToken: session.sessionToken,
        userId: session.userId,
      }
    },

    async createUser({ email, name }) {
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      let role: Role = Role.USER

      if (email === env.ADMIN_EMAIL) {
        role = Role.ADMIN
      }

      if (userExists) {
        const updatedUser = await prisma.user.update({
          data: {
            email,
            name,
            role,
          },
          where: { id: userExists.id },
        })

        return {
          email: updatedUser.email!,
          emailVerified: null,
          id: updatedUser.id,
          name: updatedUser.name,
          role,
        }
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          role,
        },
      })

      return {
        email: newUser.email,
        emailVerified: null,
        id: newUser.id,
        name: newUser.name,
        role,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          sessionToken,
        },
      })
    },

    async getSessionAndUser(session_token) {
      const session = await prisma.session.findUnique({
        include: {
          user: true,
        },
        where: {
          sessionToken: session_token,
        },
      })

      if (!session) {
        return null
      }

      const { expires, sessionToken, user, userId } = session

      return {
        session: {
          expires,
          sessionToken,
          userId,
        },
        user: {
          email: user.email!,
          emailVerified: null,
          id: user.id,
          name: user.name,
          role: user.role,
        },
      }
    },

    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!user) {
        return null
      }

      return {
        email: user.email!,
        emailVerified: null,
        id: user.id,
        name: user.name,
        role: user.role,
      }
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const account = await prisma.account.findUnique({
        include: {
          user: true,
        },
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      })

      if (!account) {
        return null
      }

      const { user } = account

      return {
        email: user.email!,
        emailVerified: null,
        id: user.id,
        name: user.name,
        role: user.role,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        return null
      }

      return {
        email: user.email!,
        emailVerified: null,
        id: user.id,
        name: user.name,
        role: user.role,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          access_token: account.access_token,
          expires_at: account.expires_at,
          id_token: account.id_token,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          scope: account.scope,
          session_state: account.session_state,
          token_type: account.token_type,
          type: account.type,
          userId: account.userId,
        },
      })
    },

    async updateSession({ expires, sessionToken, userId }) {
      const session = await prisma.session.update({
        data: {
          expires,
          userId,
        },
        where: {
          sessionToken,
        },
      })

      return {
        expires: session.expires,
        sessionToken: session.sessionToken,
        userId: session.userId,
      }
    },

    async updateUser(user) {
      let role: Role = Role.USER

      if (user.email === env.ADMIN_EMAIL) {
        role = Role.ADMIN
      }
      const updatedUser = await prisma.user.update({
        data: {
          email: user.email,
          name: user.name,
          role,
        },
        where: { id: user.id },
      })

      return {
        email: updatedUser.email!,
        emailVerified: null,
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
      }
    },
  }
}
