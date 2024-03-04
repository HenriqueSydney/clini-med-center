import prisma from '@/lib/prisma'
import { Professional, ProfessionalAppointment } from '@prisma/client'

interface IFetchProfessionalAppointments {
  professionalId: string
}

export async function fetchProfessionalAppointments({
  professionalId,
}: IFetchProfessionalAppointments): Promise<ProfessionalAppointment[]> {
  const appointments = await prisma.professionalAppointment.findMany({
    where: {
      ProfessionalId: professionalId,
    },
  })
  return appointments
}

export type AppointmentInfo<T> = T & {
  resource: Professional
}

export type IFetchUserAppointmentsResponse = ProfessionalAppointment

export async function fetchUserAppointments<
  T extends IFetchUserAppointmentsResponse,
>(userId: string): Promise<AppointmentInfo<T>[]> {
  const professionalAppointments =
    await prisma.professionalAppointment.findMany({
      include: {
        professional: true,
      },
      where: {
        userId,
      },
    })

  const professionalAppointmentsInfo = professionalAppointments.map(
    (appointment) => {
      return {
        resource: appointment.professional,
        ...appointment,
      } as unknown as AppointmentInfo<T>
    },
  )

  const sortedAppointments = professionalAppointmentsInfo.sort(
    (a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime(),
  )

  return sortedAppointments
}

interface IGetAppointment {
  id: string
  appointmentDate: Date
  observation: string | null
  name: string | null
  cpf: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
  ProfessionalId: string
  professional: Professional
}

export async function getAppointment(
  appointmentId: string,
): Promise<IGetAppointment | null> {
  const appointment = await prisma.professionalAppointment.findUnique({
    include: {
      professional: true,
    },
    where: { id: appointmentId },
  })

  return appointment
}
