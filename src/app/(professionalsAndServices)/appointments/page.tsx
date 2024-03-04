import AppointmentsList from './components/AppointmentsList'

import styles from './styles.module.scss'
import { fetchUserAppointments } from '@/services/appointments'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Professionals() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const appointments = await fetchUserAppointments(session.user.id)

  return (
    <div className={styles.container}>
      <AppointmentsList appointments={appointments} />
    </div>
  )
}
