'use client'
import { useRouter } from 'next/navigation'

import { Controller, useForm } from 'react-hook-form'
import { useHookFormMask } from 'use-mask-input'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import { toast } from 'react-toastify'

import { InputText } from '@/components/Form/InputText'
import { Textarea } from '@/components/Form/Textarea'
import { ButtonIcon } from '@/components/Buttons/ButtonIcon'
import { InputDatePicker } from '@/components/Form/InputDatePicker'

import { datePtBrFormatter } from '@/utils/date'

import styles from './styles.module.scss'

const appointmentFormSchema = zod.object({
  appointmentDate: zod
    .date({ required_error: 'A data da consulta é obrigatória' })
    .superRefine((val, ctx) => {
      if (val === null) {
        ctx.addIssue({
          code: zod.ZodIssueCode.invalid_date,
          message: 'Data da consulta selecionada inválida',
        })
      }
    }),
  name: zod
    .string({ required_error: 'Nome é obrigatório' })
    .min(5, 'Nome deve ter no mínimo 5 caracteres'),
  cpf: zod
    .string({ required_error: 'CPF é obrigatório' })
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF Inválido'),
  observation: zod
    .string({ required_error: 'CPF é obrigatório' })
    .max(500, 'Observação deve ter no máximo 500 caracteres'),
})

type AppointmentFormData = zod.infer<typeof appointmentFormSchema>

interface IAppointmentForm {
  id: string
  form?: {
    appointmentId: string
    appointmentDate: Date
    observation: string
    cpf: string
    name: string
  }
}

export function AppointmentForm({ id, form }: IAppointmentForm) {
  const router = useRouter()
  const appointmentFormCheckout = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      appointmentDate: form?.appointmentDate,
      cpf: form?.cpf ?? '',
      name: form?.name ?? '',
      observation: form?.observation ?? '',
    },
  })

  const {
    handleSubmit,
    control,
    register,
    setValue,
    resetField,
    formState: { isSubmitting, errors },
  } = appointmentFormCheckout

  const registerWithMask = useHookFormMask(register)

  function onDatePickerChange(date: Date | null) {
    if (!date) {
      resetField('appointmentDate')
      return
    }
    setValue('appointmentDate', date)
  }

  async function handleAppointment(data: AppointmentFormData) {
    const appointmentData = {
      id,
      ...data,
      appointmentDate: data.appointmentDate.toLocaleString('en-US', {
        timeZone: 'America/Sao_Paulo',
      }),
    }

    try {
      let response = null
      let message = 'realizado'

      if (form) {
        response = await fetch(`/api/appointments/${form.appointmentId}`, {
          method: 'PUT',
          body: JSON.stringify({
            data: { appointment: appointmentData },
          }),
        })
        message = 'atualizado'
      } else {
        response = await fetch('/api/appointments', {
          method: 'POST',
          body: JSON.stringify({
            data: { appointment: appointmentData },
          }),
        })
      }

      if (response.status !== 201 && response.status !== 200) {
        const data = await response.json()
        throw new Error(
          data.message
            ? data.message
            : 'Um erro inesperado ocorreu. Tente novamente mais tarde',
        )
      }

      router.push(
        `/appointments?operation=ok&result=Agendamento ${message} com sucesso`,
      )
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Um erro inesperado ocorreu. Tente novamente mais tarde')
      }
    }
  }
  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit(handleAppointment)}
    >
      <InputText
        placeholder="Informe seu nome"
        error={errors.name}
        {...register('name')}
      />
      <InputText
        placeholder="Informe seu CPF"
        error={errors.cpf}
        {...registerWithMask('cpf', ['999.999.999-99'])}
      />
      <Controller
        control={control}
        name="appointmentDate"
        render={({ field }) => (
          <InputDatePicker
            label="Data da Consulta"
            startDate={field.value}
            endDate={field.value}
            selected={field.value ? new Date(field.value) : new Date()}
            value={datePtBrFormatter(field.value, 'dd/MM/yyyy HH:mm')}
            onChange={(date) => onDatePickerChange(date)}
            inputError={errors.appointmentDate}
          />
        )}
      />
      <Textarea
        placeholder="Caso queira, escreva alguma observação para o seu médico conhecer um pouco de suas necessidades"
        error={errors.observation}
        {...register('observation')}
      />
      <div className={styles.buttons}>
        <ButtonIcon
          title={`${form ? 'Atualizar' : 'Enviar'} agendamento`}
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  )
}
