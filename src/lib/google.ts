import 'server-only'

import dayjs from 'dayjs'
import { google } from 'googleapis'

import prisma from './prisma'

export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: 'google',
      user_id: userId,
    },
  })

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  )

  auth.setCredentials({
    access_token: account.access_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : null,
    refresh_token: account.refresh_token,
  })

  if (!account.expires_at) {
    return auth
  }

  const isTokenExpired = dayjs(account.expires_at * 1000).isBefore(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()

    const {
      access_token,
      expiry_date,
      id_token,
      refresh_token,
      scope,
      token_type,
    } = credentials

    await prisma.account.update({
      data: {
        access_token,
        expires_at: expiry_date ? Math.floor(expiry_date / 1000) : expiry_date,
        id_token,
        refresh_token,
        scope,
        token_type,
      },
      where: {
        id: account.id,
      },
    })

    auth.setCredentials({
      access_token,
      expiry_date,
      refresh_token,
    })
  }

  return auth
}
