import { differenceInDays, format } from 'date-fns'

export function dateDifferenceInDays(
  initialDate: Date,
  finalDate: Date,
): number {
  return differenceInDays(finalDate, initialDate)
}

export function datePtBrFormatter(
  date: Date,
  dateFormat: string = 'dd/MM/yyyy',
): string {
  if (!date) return ''
  return format(date, dateFormat)
}
