import { fetchProfessionalAndServices } from '@/services/professionalAndServices'
import ProfessionalsList from './components/ProfessionalsList'

import styles from './styles.module.scss'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function Professionals({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) {
  const { professionals } = await fetchProfessionalAndServices({
    filter: searchParams,
  })

  return (
    <div className={styles.container}>
      <ProfessionalsList professionals={professionals} />
    </div>
  )
}
