import React, { ForwardRefRenderFunction, forwardRef } from 'react'

import { FieldError } from 'react-hook-form'

import { ErrorMessage } from '../ErrorMessage'

import styles from './styles.module.scss'

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: FieldError
}

const TextareaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ label = '', error = null, ...rest }, ref) => {
  return (
    <div className={styles['input-container']}>
      {label && (
        <div className={styles.label}>
          <label>{label}</label>
        </div>
      )}
      <div className={styles['input-wrapper']}>
        <textarea
          className={`${styles['input-container']} ${
            !!error?.message && styles['input-error']
          }`}
          ref={ref}
          {...rest}
        ></textarea>
      </div>
      <ErrorMessage errorMessage={error?.message} />
    </div>
  )
}

export const Textarea = forwardRef(TextareaBase)
