import * as zod from 'zod'

const includeFormSchema = zod.object({
  type: zod.enum(['Serviço', 'Profissional']),
  professional: zod
    .string({ required_error: 'Nome é obrigatório' })
    .min(5, 'Nome do profissional ou serviço deve ter no mínimo 5 caracteres')
    .max(
      100,
      'Nome do profissional ou serviço deve ter no máximo 100 caracteres',
    ),
  specialty: zod.string(),
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
})

type IncludeFormData = zod.infer<typeof includeFormSchema>

export function validateProfessionalForm(
  professionalForm: IncludeFormData,
): void {
  includeFormSchema.parse(professionalForm)
}
