import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

import prisma from '@/lib/prisma'
import { Type } from '@prisma/client'
import { fetchProfessionalAndServices } from '@/services/professionalAndServices'

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
      return NextResponse.json({ success: false })
    }

    /* const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const professionalName = formData.get('professional') as string
    const extension = file.name.split('.').pop()
    const photo_name = `${professionalName}-${randomUUID()}.${extension}`
    const path = `./public/images/${photo_name}`

    await writeFile(path, buffer) */
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
    console.error(error)
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
