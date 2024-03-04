'use server'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { Fieldset } from '@/components/Form/Fieldset'
import { IncludeForm } from './IncludeForm'

import styles from './page.module.scss'

export default async function IncludeProfessional() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className={styles.container}>
      <Fieldset title="Cadastrar Profissional/Serviço">
        <IncludeForm />
      </Fieldset>
    </div>
  )
}
