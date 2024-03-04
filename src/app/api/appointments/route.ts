import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {
          message:
            'Favor entrar em sua conta para realizar a marcação da consulta',
        },
        { status: 401 },
      )
    }
    const {
      data: { appointment },
    } = await request.json()

    const appointmentDate = new Date(appointment.appointmentDate)

    const dayOfTheWeek = appointmentDate.getDay()

    if (dayOfTheWeek === 0) {
      return NextResponse.json(
        {
          message: 'Desculpe. Este profissional não atende aos domingos',
        },
        { status: 400 },
      )
    }

    const hourOfTheDay = appointmentDate.getHours()

    if (dayOfTheWeek === 6 && (hourOfTheDay < 8 || hourOfTheDay > 11)) {
      return NextResponse.json(
        {
          message:
            'Desculpe. Este profissional somente atende aos sábados entre os horários de 8:00 às 12:00',
        },
        { status: 400 },
      )
    }

    if (hourOfTheDay < 8 || hourOfTheDay > 17) {
      return NextResponse.json(
        {
          message:
            'Desculpe. Este profissional, durante a semana, somente atende  entre os horários de 8:00 às 18:00',
        },
        { status: 400 },
      )
    }

    let newAppointment = null
    const startOfDay = new Date(appointmentDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(appointmentDate)
    endOfDay.setHours(23, 59, 59, 999)
    const professionalAppointmentsOfTheDay =
      await prisma.professionalAppointment.findMany({
        where: {
          ProfessionalId: appointment.id,
          appointmentDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      })

    const hasConflict = professionalAppointmentsOfTheDay.some((appointment) => {
      const existingAppointmentDate = appointment.appointmentDate

      const isOverlap =
        (existingAppointmentDate.getTime() >= appointmentDate.getTime() &&
          existingAppointmentDate.getTime() <
            appointmentDate.getTime() + 60 * 60 * 1000) ||
        (existingAppointmentDate.getTime() >
          appointmentDate.getTime() - 60 * 60 * 1000 &&
          existingAppointmentDate.getTime() <= appointmentDate.getTime())

      return isOverlap
    })
    if (hasConflict) {
      return NextResponse.json(
        {
          message: 'Este profissional já possui um atendimento neste horário',
        },
        { status: 400 },
      )
    }

    const pacientAppointmentsOfTheDay =
      await prisma.professionalAppointment.findMany({
        where: {
          cpf: appointment.cpf,
          appointmentDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      })

    const hasPacientAConflict = pacientAppointmentsOfTheDay.some(
      (appointment) => {
        const existingAppointmentDate = appointment.appointmentDate

        const isOverlap =
          (existingAppointmentDate.getTime() >= appointmentDate.getTime() &&
            existingAppointmentDate.getTime() <
              appointmentDate.getTime() + 60 * 60 * 1000) ||
          (existingAppointmentDate.getTime() >
            appointmentDate.getTime() - 60 * 60 * 1000 &&
            existingAppointmentDate.getTime() <= appointmentDate.getTime())

        return isOverlap
      },
    )
    if (hasPacientAConflict) {
      return NextResponse.json(
        {
          message: 'Você já possui um atendimento neste horário',
        },
        { status: 400 },
      )
    }

    newAppointment = await prisma.professionalAppointment.create({
      data: {
        ProfessionalId: appointment.id,
        appointmentDate,
        userId: session.user.id,
        name: appointment.name,
        cpf: appointment.cpf,
        observation: appointment.observation,
      },
    })

    revalidatePath('/(professionalsAndServices)/appointments/[...id]', 'page')
    return NextResponse.json({ data: newAppointment }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        message:
          'Erro inesperado. A equipe de suporte já foi notificada. Tente novamente mais tarde',
      },
      { status: 500 },
    )
  }
}
