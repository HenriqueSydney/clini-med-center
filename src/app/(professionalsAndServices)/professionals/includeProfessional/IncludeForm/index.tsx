/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { InputText } from '@/components/Form/InputText'
import { Select } from '@/components/Form/Select'
import { Textarea } from '@/components/Form/Textarea'
import { ButtonIcon } from '@/components/Buttons/ButtonIcon'

import styles from './styles.module.scss'
import { FileUpload } from '@/components/Form/FileInput'
import { Professional } from '@prisma/client'
import Image from 'next/image'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'

const SPECIALTY_OPTIONS = [
  {
    label: 'Selecione a especialidade/categoria',
    value: 'Selecione a especialidade/categoria',
  },
  {
    label: 'Profissional: Nutricionista',
    value: 'Nutricionista',
  },
  {
    label: 'Profissional: Cardiologista',
    value: 'Cardiologista',
  },
  {
    label: 'Profissional: Psicólogo',
    value: 'Psicólogo',
  },
  {
    label: 'Profissional: Psiquiatra',
    value: 'Psiquiatra',
  },
  {
    label: 'Serviço: Exame de Sangue',
    value: 'Exame de Sangue',
  },
  {
    label: 'Serviço: Exame Auditivo',
    value: 'Exame Auditivo',
  },
  {
    label: 'Profissional: Ortopedista',
    value: 'Ortopedista',
  },
  {
    label: 'Profissional: Endocrinologista',
    value: 'Endocrinologista',
  },
  {
    label: 'Profissional: Neurologista',
    value: 'Neurologista',
  },
] as const

const TYPE_OPTIONS = [
  {
    label: 'Serviço',
    value: 'Serviço',
  },
  {
    label: 'Profissional',
    value: 'Profissional',
  },
]

type Specialty = (typeof SPECIALTY_OPTIONS)[number]['value']

const SPECIALTY_VALUES: [Specialty, ...Specialty[]] = [
  SPECIALTY_OPTIONS[0].value,
  ...SPECIALTY_OPTIONS.slice(1).map((p) => p.value),
]

const includeFormSchema = zod.object({
  type: zod.enum(['Serviço', 'Profissional']),
  professional: zod
    .string({ required_error: 'Nome é obrigatório' })
    .min(5, 'Nome do profissional ou serviço deve ter no mínimo 5 caracteres')
    .max(
      100,
      'Nome do profissional ou serviço deve ter no máximo 100 caracteres',
    ),
  specialty: zod.enum(SPECIALTY_VALUES),
  email: zod
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  phone: zod
    .string({ required_error: 'Telefone é obrigatório' })
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  professionalPhrase: zod
    .string()
    .min(15, 'Frase de efeito deve ter no mínimo 15 caracteres')
    .max(150, 'Frase de efeito deve ter no máximo 150 caracteres'),
  additionalInformation: zod
    .string()
    .min(
      30,
      'Informações sobre o professional/serviço deve ter no mínimo 30 caracteres',
    )
    .max(
      1500,
      'Informações sobre o professional/serviço deve ter no máximo 1500 caracteres',
    ),
  qualifications: zod
    .string()
    .min(
      30,
      'Qualificação sobre o professional/serviço deve ter no mínimo 30 caracteres',
    )
    .max(
      500,
      'Qualificação sobre o professional/serviço deve ter no máximo 500 caracteres',
    ),
  profileImage: zod
    .any()
    .refine((files: File[]) => {
      if (files.length === 0) return true
      return files.length > 0 && files?.[0]?.size <= 5 * 1024 * 1024
    }, `Tamanho máximo do arquivo 5MB.`)
    .refine((files: File[]) => {
      if (files.length === 0) return true
      return ['image/jpeg', 'image/png'].includes(files?.[0]?.type)
    }, 'Apenas .jpg, .jpeg, .png são aceitos'),
})

type IncludeFormData = zod.infer<typeof includeFormSchema>

interface IIncludeForm {
  professional?: Professional
}

export function IncludeForm({ professional }: IIncludeForm) {
  const navigation = useRouter()
  const [type, setType] = useState(
    !professional
      ? 'Profissional'
      : professional?.type === 'PROFESSIONAL'
        ? 'Profissional'
        : 'Serviço',
  )

  const accommodationFormCheckout = useForm<IncludeFormData>({
    resolver: zodResolver(includeFormSchema),
    defaultValues: {
      type: !professional
        ? 'Profissional'
        : professional?.type === 'PROFESSIONAL'
          ? 'Profissional'
          : 'Serviço',
      specialty:
        (professional?.specialty as Specialty) ??
        'Selecione a especialidade/categoria',
      professional: professional?.name ?? '',
      email: professional?.email ?? '',
      phone: professional?.phone ?? '',
      professionalPhrase: professional?.phrase ?? '',
      additionalInformation: professional?.description ?? '',
      qualifications: professional?.qualifications ?? '',
    },
  })

  async function handleRemoveProfileImage(id: string) {
    try {
      const response = await fetch(`/api/professionalsAndServices/${id}`, {
        method: 'PATCH',
      })

      const data = await response.json()

      if (data.status !== 204) {
        throw new Error(data.status.toString())
      }

      navigation.refresh()
    } catch (error) {}
  }

  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { isSubmitting, errors },
  } = accommodationFormCheckout
  const registerWithMask = useHookFormMask(register)

  async function handleIncludeFormSubmit(data: IncludeFormData) {
    const formData = new FormData()
    if (
      !professional &&
      (!data.profileImage || data.profileImage.length === 0)
    ) {
      setError('profileImage', {
        message: 'Favor, selecionar uma foto para o perfil',
        type: 'required',
      })
      toast.error('Selecione uma foto para o perfil')
      return
    }

    if (data.profileImage[0]) {
      formData.set('file', data.profileImage[0])
    }

    Object.keys(data).forEach((key) => {
      formData.append(key, (data as Record<string, any>)[key])
    })
    try {
      let response: any
      if (professional) {
        response = await fetch(
          `/api/professionalsAndServices/${professional.id}`,
          {
            method: 'PUT',
            body: formData,
          },
        )
      } else {
        response = await fetch('/api/professionalsAndServices', {
          method: 'POST',
          body: formData,
        })
      }

      if (
        (response.status !== 201 && !professional) ||
        (response.status !== 200 && professional)
      ) {
        const data = await response.json()
        throw new Error(
          data.message
            ? data.message
            : 'Um erro inesperado ocorreu. Tente novamente mais tarde',
        )
      }

      navigation.push(
        `/professionals?operation=ok&result=${professional ? `${typeRegister} atualizado com sucesso` : `${typeRegister} cadastrado com sucesso`}`,
      )
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Um erro inesperado ocorreu. Tente novamente mais tarde')
      }
    }
  }
  const typeRegister = watch('type')

  useEffect(() => {
    setType(typeRegister)
  }, [typeRegister])

  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit(handleIncludeFormSubmit)}
    >
      <div className={styles.row}>
        <div style={{ flex: 0.4 }}>
          <Select
            label="Tipo de registro"
            options={TYPE_OPTIONS}
            error={errors.type}
            {...register('type')}
          />
        </div>
        <div style={{ flex: 0.6 }}>
          <InputText
            label="Nome do Profissional/Serviço"
            error={errors.professional}
            {...register('professional')}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <Select
            label="Especialidade/Categoria"
            options={SPECIALTY_OPTIONS.filter(
              (option) =>
                option.label.includes(type) ||
                option.value.includes('Selecione a especialidade/categoria'),
            )}
            error={errors.specialty}
            {...register('specialty')}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <InputText
            label="E-mail de contato"
            type="email"
            error={errors.email}
            {...register('email')}
          />
        </div>
        <div style={{ flex: 1 }}>
          <InputText
            label="Telefone de contato"
            type="tel"
            error={errors.phone}
            {...registerWithMask('phone', ['(99) 99999-9999'])}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <InputText
            label="Frase de Efeito"
            error={errors.professionalPhrase}
            {...register('professionalPhrase')}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <Textarea
            label="Informações sobre o profissional"
            style={{ height: '200px' }}
            error={errors.additionalInformation}
            {...register('additionalInformation')}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <Textarea
            label="Qualificações"
            style={{ height: '200px' }}
            error={errors.qualifications}
            {...register('qualifications')}
          />
        </div>
      </div>
      <div className={styles.row}>
        <div style={{ flex: 1 }}>
          <FileUpload
            label="Foto do Perfil"
            error={errors.profileImage}
            {...register('profileImage')}
          />
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <ButtonIcon
          type="submit"
          title={professional ? 'Atualizar o cadastro' : 'Confirmar o cadastro'}
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
        />
      </div>
      {professional?.photo_name && (
        <div className={styles.imageContainer}>
          <div className={styles.image}>
            <Image
              src={`/images/${professional.photo_name}`}
              alt="Foto do Médico"
              sizes="(max-width: 876px) 100%"
              fill={true}
            />
          </div>
          <ButtonIcon
            icon={<FontAwesomeIcon icon={faTrashAlt} />}
            title="Remover imagem atual"
            onClick={() => handleRemoveProfileImage(professional.id)}
            variant="TERTIARY"
          />
        </div>
      )}
    </form>
  )
}
