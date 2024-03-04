'use server'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

import { Fieldset } from '@/components/Form/Fieldset'
import { IncludeForm } from '../IncludeForm'

import { getProfessional } from '@/services/professionalAndServices'

import styles from './page.module.scss'
import { revalidatePath } from 'next/cache'

interface IParams {
  params: { id: string }
}

export default async function IncludeProfessional({ params: { id } }: IParams) {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'ADMIN') {
    redirect('/')
  }

  const resource = await getProfessional(id)
  revalidatePath('/')
  if (!resource) {
    redirect('/professionals?info=not found')
  }

  return (
    <div className={styles.container}>
      <Fieldset title="Editar Profissional/Serviço">
        <IncludeForm professional={resource} />
      </Fieldset>
    </div>
  )
}
