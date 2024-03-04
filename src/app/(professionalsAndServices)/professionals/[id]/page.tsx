import { redirect } from 'next/navigation'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons'

import { LoginModal } from '@/components/Header/Menu/LoginModal/LoginModal'
import { AsideDoctorInfo } from '../../shared/AsideDoctorInfo'
import { AppointmentForm } from '../../appointments/[id]/components/AppointmentForm'

import { getProfessional } from '@/services/professionalAndServices'

import styles from './page.module.scss'

interface IProfessional {
  params: {
    id: string
  }
}

export default async function Professional({ params: { id } }: IProfessional) {
  const session = await getServerSession(authOptions)

  const resource = await getProfessional(id)

  if (!resource) {
    redirect('/professionals?info=not found')
  }

  return (
    <div className={styles.container}>
      <AsideDoctorInfo
        photo_name={resource.photo_name}
        name={resource.name}
        id={resource.id}
        specialty={resource.specialty}
        qualifications={resource.qualifications}
        email={resource.email}
        phone={resource.phone}
        user_role={session?.user.role}
      />
      <section>
        <h2>Conheça seu médico</h2>
        <div className={styles.phrase}>
          <FontAwesomeIcon icon={faQuoteLeft} size="2x" />
          <strong>{`"${resource.phrase}"`}</strong>
        </div>
        <p>{resource.description}</p>
        {session && (
          <div className={styles.form}>
            <h2>É o que você está procurando? Agende uma consulta:</h2>
            <AppointmentForm id={id} />
          </div>
        )}

        {!session && (
          <>
            <h2>É o que você está procurando?</h2>
            <strong> Faça seu login e agende uma consulta!</strong>
            <div className={styles.loginContainer}>
              <LoginModal callbackUrl={`/professionals/${id}`} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
