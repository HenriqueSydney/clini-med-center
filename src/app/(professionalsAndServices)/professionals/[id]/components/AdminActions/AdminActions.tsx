'use client'

import { useRouter } from 'next/navigation'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faPencil, faTimes } from '@fortawesome/free-solid-svg-icons'

import { ButtonIcon } from '@/components/Buttons/ButtonIcon'

import styles from './styles.module.scss'

interface IAdminActions {
  professionalId: string
}

export function AdminActions({ professionalId }: IAdminActions) {
  const router = useRouter()

  function handleEditProfessional() {
    router.push(`/professionals/includeProfessional/${professionalId}`)
  }

  async function handleRemoveProfession() {
    try {
      const response = await fetch(
        `/api/professionalsAndServices/${professionalId}`,
        {
          method: 'DELETE',
        },
      )
      const data = await response.json()
      if (data.status !== 204) {
        throw new Error()
      }
      router.push('/professionals')
    } catch (error) {
      router.push('/professionals')
    }
  }

  return (
    <div className={styles.container}>
      <ButtonIcon
        icon={<FontAwesomeIcon icon={faPencil} />}
        variant="SECONDARY"
        aria-label="Editar profissional"
        onClick={handleEditProfessional}
      />
      <ButtonIcon
        icon={<FontAwesomeIcon icon={faTimes} />}
        variant="TERTIARY"
        aria-label="Desativar profissional"
        onClick={handleRemoveProfession}
      />
    </div>
  )
}
