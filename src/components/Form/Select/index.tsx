import React, { ForwardRefRenderFunction, forwardRef } from 'react'

import { FieldError } from 'react-hook-form'

import { ErrorMessage } from '../ErrorMessage'

import styles from './styles.module.scss'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type Options = {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Options[]
  icon?: IconDefinition
  label?: string
  error?: FieldError
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
  { options, icon = null, label = '', error = null, ...rest },
  ref,
) => {
  return (
    <div>
      <div
        className={`${styles['select-container']} ${
          !!error?.message && styles['input-error']
        }`}
      >
        {label && (
          <div className={styles['label-container']}>
            {icon && <FontAwesomeIcon icon={icon} />}
            <label>{label}</label>
          </div>
        )}
        <select className={styles['select-container']} ref={ref} {...rest}>
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <ErrorMessage errorMessage={error?.message} />
    </div>
  )
}

export const Select = forwardRef(SelectBase)
