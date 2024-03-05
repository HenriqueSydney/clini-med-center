import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import prisma from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        {
          message:
            'Usuário deve estar logado para realizar a alteração da consulta',
        },
        { status: 401 },
      )
    }

    const {
      data: { appointment },
    } = await request.json()
    dayjs.locale('pt-Br')
    const day = dayjs(appointment.appointmentDate)
    const hourOfTheDay = day.hour()
    const startOfDay = day.startOf('day').toDate()
    const endOfDay = day.endOf('day').toDate()
    const appointmentDate = day.toISOString()
    const dayOfTheWeek = day.day()

    if (dayOfTheWeek === 0) {
      return NextResponse.json(
        {
          message: 'Desculpe. Este profissional não atende aos domingos',
        },
        { status: 400 },
      )
    }

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

    const professionalAppointmentsOfTheDay =
      await prisma.professionalAppointment.findMany({
        where: {
          ProfessionalId: appointment.id,
          appointmentDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
          id: {
            not: id,
          },
        },
      })
    const oneHourInMillis = 60 * 60 * 1000
    const hasProfessionalAConflict = professionalAppointmentsOfTheDay.some(
      (appointment) => {
        const existingAppointmentDate = appointment.appointmentDate

        const isOverlap =
          (dayjs(existingAppointmentDate).isAfter(appointmentDate) &&
            dayjs(existingAppointmentDate).isBefore(
              day.add(oneHourInMillis),
            )) ||
          (dayjs(existingAppointmentDate).isAfter(
            day.subtract(oneHourInMillis),
          ) &&
            dayjs(existingAppointmentDate).isBefore(appointmentDate))

        return isOverlap
      },
    )
    if (hasProfessionalAConflict) {
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
          id: {
            not: id,
          },
        },
      })

    const hasPacientAConflict = pacientAppointmentsOfTheDay.some(
      (appointment) => {
        const existingAppointmentDate = appointment.appointmentDate

        const isOverlap =
          (dayjs(existingAppointmentDate).isAfter(appointmentDate) &&
            dayjs(existingAppointmentDate).isBefore(
              day.add(oneHourInMillis),
            )) ||
          (dayjs(existingAppointmentDate).isAfter(
            day.subtract(oneHourInMillis),
          ) &&
            dayjs(existingAppointmentDate).isBefore(appointmentDate))

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

    const updatedAppointment = await prisma.professionalAppointment.update({
      data: {
        ProfessionalId: appointment.id,
        appointmentDate,
        name: appointment.name,
        cpf: appointment.cpf,
        observation: appointment.observation,
      },
      where: {
        id,
      },
    })

    revalidatePath('/', 'page')
    return NextResponse.json({ data: updatedAppointment }, { status: 200 })
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

export async function DELETE(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json(
      {
        message:
          'Usuário não identificado. Faça o login antes de tentar cancelar sua consulta',
      },
      { status: 400 },
    )
  }

  if (!id || Array.isArray(id)) {
    return NextResponse.json(
      {
        message:
          'Falha na identificação da consulta. Tente novamente mais tarde',
      },
      { status: 400 },
    )
  }

  const appointment = await prisma.professionalAppointment.findUnique({
    where: { id },
  })

  if (!appointment) {
    return NextResponse.json(
      {
        message:
          'Falha na identificação da consulta. Tente novamente mais tarde',
      },
      { status: 400 },
    )
  }

  if (appointment.userId !== session.user.id) {
    return NextResponse.json(
      {
        message: 'Falha consulta agendada não é do usuário',
      },
      { status: 400 },
    )
  }
  await prisma.professionalAppointment.delete({ where: { id } })

  revalidatePath('/', 'page')
  return NextResponse.json(
    {
      message: 'Agendamento deletado com sucesso',
    },
    { status: 410 },
  )
}
