import prisma from '@/lib/prisma'
import { Professional } from '@prisma/client'

interface IFetchProfessionalAndServicesParams {
  filter: { [key: string]: string | string[] | undefined } | undefined
}

interface IFetchProfessionalAndServices {
  professionals: Professional[]
}

export async function fetchProfessionalAndServices({
  filter,
}: IFetchProfessionalAndServicesParams): Promise<IFetchProfessionalAndServices> {
  let where = {}

  if (filter?.search && filter?.search !== undefined) {
    where = {
      where: {
        OR: [
          {
            name: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            specialty: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ],
      },
    }
  }

  if (
    Object.keys(where).length === 0 &&
    filter?.type &&
    filter?.type !== undefined
  ) {
    where = {
      where: {
        type: {
          equals: filter.type === 'Serviços' ? 'SERVICE' : 'PROFESSIONAL',
        },
      },
    }
  } else if (
    Object.keys(where).length === 0 &&
    filter?.type &&
    filter?.type !== undefined
  ) {
    where = {
      where: {
        OR: [
          {
            name: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            specialty: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ],
        AND: {
          type: {
            equals: filter.type === 'Serviços' ? 'SERVICE' : 'PROFESSIONAL',
          },
        },
      },
    }
  }

  const professionals = await prisma.professional.findMany(where)

  return { professionals }
}

export async function getProfessional(
  id: string,
): Promise<Professional | null> {
  const resource = await prisma.professional.findUnique({ where: { id } })

  return resource
}
