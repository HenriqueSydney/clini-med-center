'use client'

import { useState } from 'react'
import { Session } from 'next-auth'

import { useRouter } from 'next/navigation'

import { signOut } from 'next-auth/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import { LoginModal } from './LoginModal/LoginModal'
import { Modal } from '@/components/Modal/Modal'
import { HeaderButton } from '@/components/Buttons/HeaderButton'

import styles from './styles.module.scss'
import Link from 'next/link'

interface IMenuProps {
  session: Session | null
}

export function Menu({ session }: IMenuProps) {
  const [isShown, setIsShown] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()

  function handleGoToUserAppointments() {
    router.push('/appointments')
  }

  function handleOpenLoginModalVisibility() {
    setIsShown((state) => !state)
    setIsLoginModalOpen((state) => !state)
  }

  function handleGoToIncludeProfessional() {
    router.push('/professionals/includeProfessional')
  }

  return (
    <div className={styles.menu}>
      <button
        onClick={() => setIsShown(!isShown)}
        className={styles['menu-toggle']}
      >
        <FontAwesomeIcon icon={faBars} />
      </button>
      <ul
        className={`${styles['icons-container']} ${styles['menu-items']} ${
          isShown && styles.show
        }`}
      >
        <li>
          <HeaderButton title="Início" onClick={() => router.push('/')} />
        </li>
        {session ? (
          <>
            {session.user.role === 'ADMIN' && (
              <li>
                <HeaderButton
                  title="Cadastrar Serviços/Profissionais"
                  onClick={handleGoToIncludeProfessional}
                />
              </li>
            )}
            <li>
              <HeaderButton
                title="Minhas Consultas/Exames"
                onClick={handleGoToUserAppointments}
              />
            </li>
            <li>
              <Link
                href={{
                  pathname: '/professionals',
                  query: { type: 'Serviços' },
                }}
                replace={true}
                passHref
                prefetch={false}
              >
                <HeaderButton title="Pesquisar Exames" />
              </Link>
            </li>
            <li>
              <Link
                href={{
                  pathname: '/professionals',
                  query: { type: 'Professional' },
                }}
                passHref
                replace={true}
                prefetch={false}
              >
                <HeaderButton title="Pesquisar Profissional" />
              </Link>
            </li>
            <li>
              <HeaderButton
                title="Sair"
                onClick={() => signOut({ callbackUrl: '/' })}
              />
            </li>
          </>
        ) : (
          <li>
            <Modal
              triggerChildren={
                <HeaderButton
                  title="Entrar"
                  onClick={handleOpenLoginModalVisibility}
                />
              }
              contentChildren={<LoginModal />}
              isModalOpen={isLoginModalOpen}
              handleModalVisibility={handleOpenLoginModalVisibility}
            />
          </li>
        )}
      </ul>
    </div>
  )
}
