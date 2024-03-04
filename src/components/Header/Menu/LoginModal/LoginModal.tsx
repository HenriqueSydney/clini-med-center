import { LoginButton } from '@/components/Buttons/LoginButton'

import styles from './styles.module.scss'

interface ILoginModal {
  callbackUrl?: string
}

export function LoginModal({ callbackUrl = '/' }: ILoginModal) {
  return (
    <div className={styles.container}>
      <LoginButton callbackUrl={callbackUrl} />
      <LoginButton
        provider="facebook"
        callbackUrl={callbackUrl}
        disabled={true}
      />
    </div>
  )
}
