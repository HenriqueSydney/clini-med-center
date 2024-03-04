import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClockFour, faMailBulk } from '@fortawesome/free-solid-svg-icons'

import styles from './styles.module.scss'

export async function TopHeader() {
  return (
    <div className={`${styles.container}`}>
      <div className={styles.contact}>
        <div>
          <FontAwesomeIcon icon={faMailBulk} />
          <a href={`mailto:exemple@clinimed-center.com`}>
            exemple@clinimed-center.com
          </a>
        </div>
        <div>
          <FontAwesomeIcon icon={faClockFour} />
          <span>Seg a Sex: 08:00 às 18:00 | Sáb: 08:00 às 12:00</span>
        </div>
      </div>
    </div>
  )
}
