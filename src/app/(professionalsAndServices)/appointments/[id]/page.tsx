import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import { AppointmentForm } from './components/AppointmentForm'
import { AsideDoctorInfo } from '../../shared/AsideDoctorInfo'

import { getAppointment } from '@/services/appointments'

import styles from './page.module.scss'
import { revalidatePath } from 'next/cache'

interface IProfessional {
  params: {
    id: string
  }
}

export default async function Professional({ params: { id } }: IProfessional) {
  const session = await getServerSession(authOptions)

  const appointment = await getAppointment(id)
  revalidatePath('/')
  if (!appointment) {
    redirect('/professionals?info=not found')
  }

  const {
    appointmentDate,
    observation,
    cpf,
    name,
    professional: {
      email,
      id: resourceId,
      name: userName,
      phone,
      photo_name,
      photo_extension,
      qualifications,
      specialty,
    },
  } = appointment

  return (
    <div className={styles.container}>
      <AsideDoctorInfo
        photo_name={photo_name}
        photo_extension={photo_extension}
        name={name ?? ''}
        id={resourceId}
        specialty={specialty}
        qualifications={qualifications}
        email={email}
        phone={phone}
        user_role={session?.user.role}
      />
      <section>
        <h2>Olá, {userName}! Deseje alterar sua consulta? </h2>
        <strong>Atualize os dados pré preenchidos:</strong>
        <AppointmentForm
          id={resourceId}
          form={{
            appointmentId: id,
            appointmentDate,
            cpf: cpf ?? '',
            name: name ?? '',
            observation: observation ?? '',
          }}
        />
      </section>
    </div>
  )
}
