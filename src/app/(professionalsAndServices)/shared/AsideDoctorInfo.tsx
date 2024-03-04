import Link from 'next/link'
import styles from './styles.module.scss'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebook,
  faInstagram,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons'
import {
  faCalendarDays,
  faContactCard,
  faMailBulk,
  faMedkit,
  faPhone,
} from '@fortawesome/free-solid-svg-icons'

import medico1 from '@/../public/medico3.jpg'
import { AdminActions } from '../professionals/[id]/components/AdminActions/AdminActions'

interface IAsideDoctorInfo {
  photo_name: string | null
  name: string
  id: string
  specialty: string
  qualifications: string
  email: string
  phone: string
  user_role?: 'ADMIN' | 'USER'
}

export function AsideDoctorInfo({
  photo_name,
  name,
  id,
  specialty,
  qualifications,
  email,
  phone,
  user_role,
}: IAsideDoctorInfo) {
  return (
    <aside className={styles.container}>
      <div className={styles.imageContainer}>
        <Image
          src={photo_name ? `/images/${photo_name}` : medico1}
          alt="Imagem do Médico"
          fill={true}
          sizes="(max-width: 876px) 100%"
        />
      </div>
      <div className={styles.nameContainer}>
        <h2>{name}</h2>
        {user_role === 'ADMIN' && <AdminActions professionalId={id} />}
      </div>
      <strong>{specialty}</strong>

      <div className={styles.socialMedia}>
        <Link
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faInstagram} size="2x" />
        </Link>
        <Link
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faPinterest} size="2x" />
        </Link>
        <Link
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faFacebook} size="2x" />
        </Link>
      </div>

      <div className={styles.info}>
        <div className={styles.infoHeader}>
          <FontAwesomeIcon icon={faMedkit} size="2x" />
          <h3>Qualificações</h3>
        </div>
        <div className={styles.hr} />
        <span>{qualifications}</span>
      </div>

      <div className={styles.info}>
        <div className={styles.infoHeader}>
          <FontAwesomeIcon icon={faContactCard} size="2x" />
          <h3>Contato</h3>
        </div>
        <div className={styles.hr} />
        <div className={styles.contactInfo}>
          <FontAwesomeIcon icon={faMailBulk} />
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <div className={styles.contactInfo}>
          <FontAwesomeIcon icon={faPhone} />
          <span>{phone}</span>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.infoHeader}>
          <FontAwesomeIcon icon={faCalendarDays} size="2x" />
          <h3>Dias de Trabalho</h3>
        </div>
        <div className={styles.hr} />
        <div className={styles.workingDays}>
          <span>Segunda - Sexta</span>
          <span>08:00 - 15:00</span>
        </div>
        <div className={styles.workingDays}>
          <span>Sab</span>
          <span>08:00 - 11:00</span>
        </div>
      </div>
    </aside>
  )
}
