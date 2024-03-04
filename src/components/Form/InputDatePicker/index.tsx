/* eslint-disable @typescript-eslint/no-explicit-any */
import { SyntheticEvent, useEffect, useRef, useState } from 'react'

import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from 'react-datepicker'

import { FieldError, Merge } from 'react-hook-form'

import { ptBR } from 'date-fns/locale/pt-BR'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'

import { InputDatePickerContainer } from './CalendarContainer'
import { ErrorMessage } from '../ErrorMessage'

import 'react-datepicker/dist/react-datepicker.css'
import styles from './styles.module.scss'

registerLocale('pt-BR', ptBR)

interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  label?: string
  inputError?: Merge<FieldError, (FieldError | undefined | null)[]>
  onChange: (
    date: Date | null,
    event: SyntheticEvent<any, Event> | undefined,
  ) => void
}

export function InputDatePicker({
  onChange,
  label = '',
  inputError = undefined,
  placeholderText = 'Selecione o período',
  ...rest
}: DatePickerProps) {
  const elementRef = useRef(null)
  const [isDatePickerOpen, setDatePickerOpen] = useState(false)

  function handleToggleCalendarVisibility(event: MouseEvent) {
    const current = elementRef.current as any
    if (current && !current.contains(event.target as Node)) {
      setDatePickerOpen(false)
    } else {
      setDatePickerOpen(true)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleToggleCalendarVisibility)

    return () => {
      document.removeEventListener('click', handleToggleCalendarVisibility)
    }
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={elementRef}
        className={`${styles.container} ${inputError && styles['input-error']}`}
      >
        {label && (
          <div className={styles['label-container']}>
            <FontAwesomeIcon icon={faCalendar} />
            <label>{label}</label>
          </div>
        )}
        <ReactDatePicker
          onChange={onChange}
          placeholderText={placeholderText}
          locale="pt-BR"
          dateFormat="dd/MM/yyyy"
          timeFormat="HH:mm"
          showTimeSelect
          customInput={<InputDatePickerContainer />}
          showDisabledMonthNavigation
          open={isDatePickerOpen}
          {...rest}
        />
      </div>
      {inputError !== undefined &&
        Array.isArray(inputError) &&
        inputError.map((error) => {
          if (!error) return false
          return (
            <ErrorMessage key={error.message} errorMessage={error.message} />
          )
        })}

      {inputError !== undefined && !Array.isArray(inputError) && (
        <ErrorMessage errorMessage={inputError.message} />
      )}
    </div>
  )
}
