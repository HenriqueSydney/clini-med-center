import Image from 'next/image'

import styles from './styles.module.scss'

import medico from '@/../public/medico3.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { datePtBrFormatter } from '@/utils/date'
import { ButtonIcon } from '@/components/Buttons/ButtonIcon'
import { useRouter } from 'next/navigation'
import {
  AppointmentInfo,
  IFetchUserAppointmentsResponse,
} from '@/services/appointments'

interface IAppointmentsCardProps<T extends IFetchUserAppointmentsResponse> {
  data: AppointmentInfo<T>
  handleCancelAppointment: () => void
}
export function Card<T extends IFetchUserAppointmentsResponse>({
  data,
  handleCancelAppointment,
}: IAppointmentsCardProps<T>) {
  const { resource, appointmentDate, observation, id, name, cpf } = data
  const router = useRouter()

  function handleEditAppointment() {
    router.push(`/appointments/${id}`)
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.imageContainer}>
          <Image
            src={
              resource.photo_name ? `/images/${resource.photo_name}` : medico
            }
            alt="Foto do Médico"
            fill={true}
          />
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.description}>
            <div>
              <h2>{resource.name}</h2>
              <h3>{resource.specialty}</h3>
            </div>
            <div className={styles.starContainer}>
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} /> 5
            </div>
          </div>{' '}
          <div className={styles.dateAndObservationContainer}>
            <strong>
              Data da Consulta:{' '}
              <time
                dateTime={appointmentDate.toISOString()}
              >{`${datePtBrFormatter(appointmentDate, 'dd/MM/yyyy HH:mm')}`}</time>
            </strong>
            <div>
              <strong>Paciente: </strong>
              <span>{name}</span>
            </div>
            <div>
              <strong>CPF: </strong>
              <span>{cpf}</span>
            </div>

            {observation && (
              <span>{`${observation.substring(0, 200)}${observation.length > 200 ? '...' : ''}`}</span>
            )}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <ButtonIcon
            title="Alterar consulta"
            onClick={handleEditAppointment}
          />
          <ButtonIcon
            title="Cancelar consulta"
            variant="SECONDARY"
            onClick={handleCancelAppointment}
          />
        </div>
      </div>
    </div>
  )
}
