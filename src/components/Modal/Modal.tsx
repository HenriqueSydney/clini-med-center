import { ReactNode } from 'react'

import * as Dialog from '@radix-ui/react-dialog'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

import styles from './styles.module.scss'

interface IModal {
  triggerChildren: ReactNode
  contentChildren: ReactNode
  handleModalVisibility: () => void
  isModalOpen: boolean
}

export function Modal({
  triggerChildren,
  contentChildren,
  isModalOpen,
  handleModalVisibility,
}: IModal) {
  return (
    <Dialog.Root open={isModalOpen}>
      <Dialog.Trigger asChild>{triggerChildren}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.overlay}
          onClick={handleModalVisibility}
        />
        <Dialog.Content className={styles.content}>
          <Dialog.Title>Bem vindo!</Dialog.Title>
          <Dialog.Close
            className={styles['close-button']}
            onClick={handleModalVisibility}
          >
            <FontAwesomeIcon icon={faX} />
          </Dialog.Close>
          {contentChildren}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
