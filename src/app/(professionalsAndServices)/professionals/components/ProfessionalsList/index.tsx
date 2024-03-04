'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { Professional } from '@prisma/client'

import { toast } from 'react-toastify'

import { ClipLoader } from 'react-spinners'

import { InputText } from '@/components/Form/InputText'
import { Card } from '../Card'

import styles from './styles.module.scss'

interface IProfessionalList {
  professionals: Professional[]
}

export default function ProfessionalsList({
  professionals,
}: IProfessionalList) {
  const [originalData, setOriginalData] = useState([...professionals])
  const [filteredData, setFilteredData] = useState([...professionals])
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  function handleFilter(event: ChangeEvent<HTMLInputElement>) {
    const filterText = event.target.value.toLowerCase()
    const newData = originalData.filter(
      (item) =>
        item.name.toLowerCase().includes(filterText) ||
        item.description.toLowerCase().includes(filterText) ||
        item.specialty.toLowerCase().includes(filterText),
    )

    setFilteredData(newData)
  }

  async function fetchData(type: string) {
    if (type === '') return
    setIsLoading(true)
    try {
      const response = await fetch(`/api/professionalsAndServices?type=${type}`)

      if (response.status !== 200) {
        throw new Error(
          'Erro inesperado. A equipe de suporte já foi notificada. Tente novamente mais tarde',
        )
      }
      const { data } = await response.json()
      setOriginalData(data.professionals)
      setFilteredData(data.professionals)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }
      toast.error(
        'Erro inesperado. A equipe de suporte já foi notificada. Tente novamente mais tarde',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(searchParams.get('type') ?? '')
  }, [searchParams])
  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <InputText
          placeholder="Pesquisar por Serviço ou Profissional"
          onChange={(event) => handleFilter(event)}
        />
      </div>

      <div className={styles.cardContainer}>
        {isLoading && (
          <div className={styles.loadingContainer}>
            <ClipLoader size="100px" color="#015F43" />
          </div>
        )}
        {!isLoading &&
          filteredData.length > 0 &&
          filteredData.map((data, index) => (
            <Card
              key={data.id}
              data={data}
              oddOrEven={index % 2 === 0 ? 'even' : 'odd'}
            />
          ))}
        {!isLoading && filteredData.length === 0 && (
          <div className={styles.emptyContainer}>
            <strong>Nenhum profissional ou serviço localizado</strong>
            <span>Tente pesquisar por outro termo</span>
          </div>
        )}
      </div>
    </div>
  )
}
