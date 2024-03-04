import { ReactNode } from 'react'
import Image, { StaticImageData } from 'next/image'

import styles from './styles.module.scss'

interface IHomeCard {
  image: {
    src: StaticImageData
    alt: string
  }
  children: ReactNode
  even?: boolean
}

export function HomeCard({ image, children, even = false }: IHomeCard) {
  return (
    <div className={`${styles.groupContainer} ${even ? styles.even : ''}`}>
      {!even && (
        <Image src={image.src} alt={image.alt} width={300} height={300} />
      )}
      <div className={styles.infoGroup}>{children}</div>
      {even && (
        <Image src={image.src} alt={image.alt} width={300} height={300} />
      )}
    </div>
  )
}
