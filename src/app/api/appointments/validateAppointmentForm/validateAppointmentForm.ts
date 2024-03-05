import { FormError } from '@/app/Errors/FormError'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import prisma from '@/lib/prisma'

import * as zod from 'zod'
const appointmentFormSchema = zod.object({
  id: zod.string({
    required_error: 'Identificador do Profissional é obrigatório',
  }),
  appointmentDate: zod.string({
    required_error: 'Data da consulta é obrigatório',
  }),
  name: zod
    .string({ required_error: 'Nome é obrigatório' })
    .min(5, 'Nome deve ter no mínimo 5 caracteres'),
  cpf: zod
    .string({ required_error: 'CPF é obrigatório' })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF Inválido'),
  observation: zod
    .string({ required_error: 'CPF é obrigatório' })
    .max(500, 'Observação deve ter no máximo 500 caracteres'),
})

interface IValidateAppointmentFormParam {
  id: string
  appointmentDate: string
  name: string
  cpf: string
  observation: string
}

interface IValidateAppointmentFormResponse {
  appointment: IValidateAppointmentFormParam
  appointmentDate: string
}

type WhereProfessionalType = {
  ProfessionalId: string
  appointmentDate: {
    gte: Date
    lte: Date
  }
  id?: {
    not: string
  }
}

type WherePacientType = {
  cpf: string
  appointmentDate: {
    gte: Date
    lte: Date
  }
  id?: {
    not: string
  }
}

export async function validateAppointmentForm(
  appointmentForm: IValidateAppointmentFormParam,
  id = '',
): Promise<IValidateAppointmentFormResponse> {
  const appointment = appointmentFormSchema.parse(appointmentForm)

  dayjs.locale('pt-Br')
  const day = dayjs(appointment.appointmentDate)
  const currentDate = dayjs()
  if (day.isBefore(currentDate.add(1, 'day'), 'day')) {
    throw new FormError(
      'Desculpe. Os agendamentos devem ter antecedência mínima de 1 dia.',
    )
  }

  if (day.isAfter(currentDate.add(2, 'month'), 'day')) {
    throw new FormError(
      'Desculpe. A agenda do profissional somente está aberta para os próximos dois meses.',
    )
  }
  const hourOfTheDay = day.hour()
  const startOfDay = day.startOf('day').toDate()
  const endOfDay = day.endOf('day').toDate()
  const appointmentDate = day.toISOString()
  const dayOfTheWeek = day.day()

  if (dayOfTheWeek === 0) {
    throw new FormError('Desculpe. Este profissional não atende aos domingos')
  }

  if (dayOfTheWeek === 6 && (hourOfTheDay < 8 || hourOfTheDay > 11)) {
    throw new FormError(
      'Desculpe. Este profissional somente atende aos sábados entre os horários de 8:00 às 12:00',
    )
  }

  if (hourOfTheDay < 8 || hourOfTheDay > 17) {
    throw new FormError(
      'Desculpe. Este profissional, durante a semana, somente atende  entre os horários de 8:00 às 18:00',
    )
  }
  let whereProfessional: WhereProfessionalType = {
    ProfessionalId: appointment.id,
    appointmentDate: {
      gte: startOfDay,
      lte: endOfDay,
    },
  }

  let wherePacient: WherePacientType = {
    cpf: appointment.cpf,
    appointmentDate: {
      gte: startOfDay,
      lte: endOfDay,
    },
  }
  if (id !== '') {
    whereProfessional = {
      ProfessionalId: appointment.id,
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      id: {
        not: id,
      },
    }
    wherePacient = {
      cpf: appointment.cpf,
      appointmentDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
      id: {
        not: id,
      },
    }
  }

  const professionalAppointmentsOfTheDay =
    await prisma.professionalAppointment.findMany({
      where: whereProfessional,
    })

  const oneHourInMillis = 60 * 60 * 1000
  const hasConflict = professionalAppointmentsOfTheDay.some((appointment) => {
    const existingAppointmentDate = dayjs(appointment.appointmentDate)

    const isOverlap =
      (existingAppointmentDate.isAfter(day) &&
        existingAppointmentDate.isBefore(day.add(oneHourInMillis))) ||
      (existingAppointmentDate.isAfter(day.subtract(oneHourInMillis)) &&
        existingAppointmentDate.isBefore(day)) ||
      existingAppointmentDate.isSame(day)

    return isOverlap
  })

  if (hasConflict) {
    throw new FormError(
      'Este profissional já possui um atendimento neste horário',
    )
  }

  const pacientAppointmentsOfTheDay =
    await prisma.professionalAppointment.findMany({
      where: wherePacient,
    })

  const hasPacientAConflict = pacientAppointmentsOfTheDay.some(
    (appointment) => {
      const existingAppointmentDate = dayjs(appointment.appointmentDate)

      const isOverlap =
        (existingAppointmentDate.isAfter(day) &&
          existingAppointmentDate.isBefore(day.add(oneHourInMillis))) ||
        (existingAppointmentDate.isAfter(day.subtract(oneHourInMillis)) &&
          existingAppointmentDate.isBefore(day)) ||
        existingAppointmentDate.isSame(day)

      return isOverlap
    },
  )
  if (hasPacientAConflict) {
    throw new FormError(
      'Você já possui um atendimento neste horário com outro profissional',
    )
  }

  return { appointment, appointmentDate }
}
