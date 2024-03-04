import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './styles.module.scss'

interface IErrorMessage {
  errorMessage?: string | null
}

export function ErrorMessage({ errorMessage = null }: IErrorMessage) {
  if (!errorMessage) return

  return (
    <div className={styles['error-message']}>
      <FontAwesomeIcon icon={faTriangleExclamation} />
      <span>{errorMessage}</span>
    </div>
  )
}
