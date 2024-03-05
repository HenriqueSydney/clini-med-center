import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import prisma from '@/lib/prisma'
import * as zod from 'zod'
import { revalidatePath } from 'next/cache'
import { validateAppointmentForm } from './validateAppointmentForm/validateAppointmentForm'
import { FormError } from '@/app/Errors/FormError'

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
      data: { appointment: appointmentForm },
    } = await request.json()

    const { appointment, appointmentDate } =
      await validateAppointmentForm(appointmentForm)

    const newAppointment = await prisma.professionalAppointment.create({
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
