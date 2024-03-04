'use client'

import { signIn } from 'next-auth/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons'

import { ButtonIcon } from '../ButtonIcon'

interface ILoginButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  callbackUrl?: string
  provider?: 'google' | 'facebook'
}

export function LoginButton({
  callbackUrl = '/',
  provider = 'google',
  ...rest
}: ILoginButton) {
  return (
    <ButtonIcon
      type="button"
      icon={
        <FontAwesomeIcon icon={provider === 'google' ? faGoogle : faFacebook} />
      }
      title={`Acessar com conta ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
      variant="SECONDARY"
      onClick={() => signIn(provider, { callbackUrl })}
      {...rest}
    />
  )
}
