import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import * as zod from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import prisma from '@/lib/prisma'
import { validateAppointmentForm } from '../validateAppointmentForm/validateAppointmentForm'
import { FormError } from '@/app/Errors/FormError'

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
      data: { appointment: appointmentForm },
    } = await request.json()

    const { appointment, appointmentDate } = await validateAppointmentForm(
      appointmentForm,
      id,
    )

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
    if (error instanceof zod.ZodError) {
      let message = 'Identificado o(s) seguinte(s) erros de formulário:'
      JSON.parse(error.message).forEach((err: { message: string }) => {
        message = `${message} ${err.message};`
      })

      return NextResponse.json(
        {
          message,
        },
        { status: 400 },
      )
    }
    if (error instanceof FormError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 },
      )
    }

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
