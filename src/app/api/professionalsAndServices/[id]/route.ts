import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import * as zod from 'zod'

import prisma from '@/lib/prisma'
import { Type } from '@prisma/client'
import { validateProfessionalForm } from '../validateProfessionalForm/validateProfessionalForm'
import { FormError } from '@/app/Errors/FormError'

export async function PUT(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          message: 'Usuário não autorizado para realizar esta operação',
        },
        { status: 401 },
      )
    }

    const professional = await prisma.professional.findUnique({ where: { id } })

    if (!professional) {
      return NextResponse.json({ status: 400 })
    }

    const formData = await request.formData()
    const file: File | null = formData.get('file') as unknown as File

    type TypeValues = 'Serviço' | 'Profissional'
    validateProfessionalForm({
      type: formData.get('type') as TypeValues,
      professional: formData.get('professional') as string,
      specialty: formData.get('specialty') as string,
      additionalInformation: formData.get('additionalInformation') as string,
      professionalPhrase: formData.get('professionalPhrase') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      qualifications: formData.get('qualifications') as string,
    })

    let photo_name = ''
    let extension = null
    if (!file) {
      photo_name = professional.photo_name ?? ''
      extension = professional.photo_extension ?? ''
    } else {
      extension = file.name.split('.').pop()
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      photo_name = fileBuffer.toString('base64')
    }

    const professionalOrService = await prisma.professional.update({
      data: {
        type:
          formData.get('type') === 'Serviço' ? Type.SERVICE : Type.PROFESSIONAL,
        name: formData.get('professional') as string,
        specialty: formData.get('specialty') as string,
        description: formData.get('additionalInformation') as string,
        phrase: formData.get('professionalPhrase') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        qualifications: formData.get('qualifications') as string,
        photo_name,
        photo_extension: extension,
      },
      where: { id },
    })
    revalidatePath('/(professionalsAndServices)/professionals/[id]', 'page')
    return NextResponse.json({ data: professionalOrService }, { status: 200 })
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

export async function PATCH(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          message: 'Usuário não autorizado para realizar esta operação',
        },
        { status: 401 },
      )
    }

    const professional = await prisma.professional.findUnique({ where: { id } })

    if (!professional) {
      return NextResponse.json({ status: 400 })
    }

    const professionalOrService = await prisma.professional.update({
      data: {
        photo_name: null,
      },
      where: { id },
    })
    revalidatePath('/(professionalsAndServices)/professionals/[id]', 'page')
    return NextResponse.json({ data: professionalOrService }, { status: 200 })
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

  if (session?.user.role !== 'ADMIN') {
    return NextResponse.json(
      {
        message: 'Usuário não autorizado para realizar esta operação',
      },
      { status: 401 },
    )
  }

  try {
    const professional = await prisma.professional.findUnique({ where: { id } })

    if (!professional) {
      return NextResponse.json({ status: 400 })
    }

    await prisma.professional.delete({ where: { id } })
    revalidatePath('/(professionalsAndServices)/professionals/[id]', 'page')
    return NextResponse.json({ status: 204 })
  } catch (error) {
    return NextResponse.json({ status: 500 })
  }
}
