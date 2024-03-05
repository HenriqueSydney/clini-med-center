import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import * as zod from 'zod'

import prisma from '@/lib/prisma'
import { Type } from '@prisma/client'
import { fetchProfessionalAndServices } from '@/services/professionalAndServices'
import { FormError } from '@/app/Errors/FormError'
import { validateProfessionalForm } from './validateProfessionalForm/validateProfessionalForm'

export async function POST(request: NextRequest) {
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

    const formData = await request.formData()
    const file: File | null = formData.get('file') as unknown as File

    if (!file) {
      throw new FormError('A foto do perfil é obrigatória')
    }
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

    const extension = file.name.split('.').pop()
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileData = fileBuffer.toString('base64')

    const professionalOrService = await prisma.professional.create({
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
        photo_name: fileData,
        photo_extension: extension,
      },
    })
    revalidatePath('/(professionalsAndServices)/professionals/[id]', 'page')
    return NextResponse.json({ data: professionalOrService }, { status: 201 })
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const professionals = await fetchProfessionalAndServices({
      filter: { type: searchParams.get('type') ?? undefined },
    })

    return NextResponse.json({ data: professionals }, { status: 200 })
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
