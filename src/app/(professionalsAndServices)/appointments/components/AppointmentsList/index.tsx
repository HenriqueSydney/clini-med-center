'use client'
import { ChangeEvent, useState } from 'react'

import { Card } from '../Card'
import { InputText } from '@/components/Form/InputText'

import {
  AppointmentInfo,
  IFetchUserAppointmentsResponse,
} from '@/services/appointments'

import styles from './styles.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFaceSmileWink } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

interface IAppointmentsList {
  appointments: AppointmentInfo<IFetchUserAppointmentsResponse>[]
}

export default function AppointmentsList({ appointments }: IAppointmentsList) {
  const [originalData, setOriginalData] = useState(appointments)
  const [filteredData, setFilteredData] = useState(appointments)

  function handleFilter(event: ChangeEvent<HTMLInputElement>) {
    const filterText = event.target.value
    const newData = originalData.filter(
      (item) =>
        item.resource.name.includes(filterText) ||
        item.resource.specialty.includes(filterText),
    )

    setFilteredData(newData)
  }

  async function handleCancelAppointment(id: string) {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      })

      if (response.status !== 410) {
        const data = await response.json()
        throw new Error(data.message)
      }

      const newList = originalData.filter(
        (appointment) => appointment.id !== id,
      )
      setOriginalData(newList)
      const newFilteredList = filteredData.filter(
        (appointment) => appointment.id !== id,
      )
      setFilteredData(newFilteredList)
      toast.success('Agendamento cancelado com sucesso')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Um erro inesperado ocorreu. Tente novamente mais tarde')
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <InputText
          placeholder="Pesquisar por consulta agendada"
          onChange={(event) => handleFilter(event)}
        />
      </div>
      <div className={styles.cardContainer}>
        {filteredData.length > 0 &&
          filteredData.map((data) => (
            <Card
              key={data.id}
              data={data}
              handleCancelAppointment={() => handleCancelAppointment(data.id)}
            />
          ))}
        {filteredData.length === 0 && (
          <div className={styles.emptyContainer}>
            <strong>Nenhum agendamento localizado</strong>
            <span>Que tal procurar um profissional ou um exame?</span>
            <span>
              Vamos juntos cuidar de sua saúde{'  '}
              <FontAwesomeIcon icon={faFaceSmileWink} />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
