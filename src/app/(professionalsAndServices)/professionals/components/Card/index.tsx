import Link from 'next/link'
import Image from 'next/image'

import { Professional } from '@prisma/client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

import styles from './styles.module.scss'
import medico from '@/../public/medico3.jpg'

interface AccommodationCardProps {
  data: Professional
  oddOrEven: 'odd' | 'even' | 'even2'
}

export function Card({ data }: AccommodationCardProps) {
  const {
    name,
    id,
    description,
    phrase,
    specialty,
    photo_name,
    photo_extension,
  } = data

  return (
    <Link href={`/professionals/${id}`} passHref className={styles.container}>
      <div className={styles.imagemContainer}>
        <Image
          src={
            photo_name
              ? `data:image/${photo_extension};base64,${photo_name}`
              : medico
          }
          alt="Imagem do médico"
          fill={true}
          sizes="(max-width: 876px) 100%"
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.description}>
          <div>
            <h2>{name}</h2>
            <h3>{specialty}</h3>
          </div>
          <div className={styles.starContainer}>
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} /> 5
          </div>
        </div>{' '}
        <div className={styles.phraseContainer}>
          <span>{`"${phrase}"`}</span>
        </div>
        <span
          className={styles.longDescription}
        >{`${description.substring(0, 500)}...`}</span>
        <span
          className={styles.shortDescription}
        >{`${description.substring(0, 150)}...`}</span>
      </div>
    </Link>
  )
}
