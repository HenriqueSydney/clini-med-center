import { NextAuthOptions } from 'next-auth'

import { JWT } from 'next-auth/jwt'

import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'

import { PrismaAdapter } from './auth/prisma-adapter'
import { Role } from '@prisma/client'
import prisma from './prisma'

import jwt from 'jsonwebtoken'

import { env } from '@/env'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(),
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    async encode({ secret, token }) {
      if (!token) {
        return ''
      }

      return jwt.sign(token, secret)
    },
    async decode({ secret, token }) {
      if (!token) {
        return Promise.resolve(null)
      }

      try {
        const verifiedToken = jwt.verify(token, secret)
        return Promise.resolve(verifiedToken as JWT)
      } catch (error) {
        // Se houver um erro na verificação do token, você pode tratar o erro aqui, se necessário.
        console.error('Erro na verificação do token:', error)
        return Promise.resolve(null)
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        user,
      }
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signIn(user) {
      return true
    },

    async jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role
      }
      return {
        ...token,
        user,
      }
    },
  },
  pages: {
    signIn: '/',
  },
  providers: [
    GoogleProvider({
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
        },
      },
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      async profile(profile: GoogleProfile) {
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: profile.email,
            },
          })

          if (!user) {
            throw new Error('User not registered')
          }

          if (user.email === env.ADMIN_EMAIL && user.role !== Role.ADMIN) {
            await prisma.user.update({
              data: {
                role: Role.ADMIN,
              },
              where: { id: user.id },
            })

            return {
              email: profile.email,
              id: profile.sub,
              name: profile.name,
              role: Role.ADMIN,
            }
          }

          return {
            email: profile.email,
            id: profile.sub,
            name: profile.name,
            role: user.role,
          }
        } catch (error) {
          return {
            email: profile.email,
            id: profile.sub,
            name: profile.name,
            role: Role.USER,
          }
        }
      },
    }),
  ],
}
