'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

import { faTeamspeak } from '@fortawesome/free-brands-svg-icons'
import {
  faHeartPulse,
  faUserDoctor,
  faVial,
} from '@fortawesome/free-solid-svg-icons'

import { Select } from '@/components/Form/Select'
import { MainButtonIcon } from '@/components/Buttons/MainButtonIcon'

import styles from './styles.module.scss'
import { useRouter } from 'next/navigation'

const OPTIONS = [
  { label: 'Selecione uma opção', value: '' },
  { label: 'Exames Auditivos', value: '/professionals?query=auditivo' },
  { label: 'Exames de Sangue', value: '/professionals?query=sangue' },
  { label: 'Cardiologista', value: '/professionals?query=Cardiologista' },
  { label: 'Procurar Profissional', value: '/professionals' },
]

export function MostWanted() {
  const [tamanhoDaTela, setTamanhoDaTela] = useState(1351)
  const router = useRouter()

  function atualizarTamanhoDaTela() {
    setTamanhoDaTela(window.innerWidth)
  }

  function onSelection(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.target.value
    const selectedOption = OPTIONS.find(
      (option) => option.value === selectedValue,
    )

    if (selectedOption && selectedOption.value !== '') {
      router.push(selectedOption.value)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', atualizarTamanhoDaTela)
    setTamanhoDaTela(window.innerWidth)

    return () => {
      window.removeEventListener('resize', atualizarTamanhoDaTela)
    }
  }, []) // O segundo parâmetro v
  return (
    <>
      {tamanhoDaTela <= 1350 ? (
        <div className={styles.selectContainer}>
          <div className={styles.select}>
            <Select
              label="Atendimentos mais procurados"
              options={OPTIONS}
              onChange={onSelection}
            />
          </div>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <h2>Atendimentos mais procurados</h2>
          <div className={styles.buttons}>
            <Link href={`/professionals?search=auditivos`}>
              <MainButtonIcon
                icon={faTeamspeak}
                title="Exames Auditivos"
                variant="SECONDARY"
              />
            </Link>
            <Link href="/professionals?search=sangue">
              <MainButtonIcon
                icon={faVial}
                title="Exames de Sangue"
                variant="SECONDARY"
              />
            </Link>
            <Link href="/professionals?search=cardiologista">
              <MainButtonIcon
                icon={faHeartPulse}
                title="Cardiologista"
                variant="SECONDARY"
              />
            </Link>

            <Link href="/professionals">
              <MainButtonIcon
                icon={faUserDoctor}
                title="Procurar Profissional"
                variant="SECONDARY"
              />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
