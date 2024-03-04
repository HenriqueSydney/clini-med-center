import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

import { TopHeader } from './TopHeader'
import { Menu } from './Menu'

import styles from './styles.module.scss'
export async function Header() {
  const session = await getServerSession(authOptions)

  return (
    <header>
      <TopHeader />
      <div className={`${styles.main}`}>
        <Menu session={session} />
      </div>
    </header>
  )
}
