import React, { ForwardRefRenderFunction, forwardRef, useState } from 'react'

import { FieldError } from 'react-hook-form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

import { ErrorMessage } from '../ErrorMessage'

import styles from './styles.module.scss'

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: FieldError
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputTextProps> = (
  { label = '', error = null, type, ...rest },
  ref,
) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <div className={styles['input-container']}>
      {label && (
        <div className={styles.label}>
          <label>{label}</label>
        </div>
      )}
      <div className={styles['input-wrapper']}>
        <input
          type={isPasswordVisible && type === 'password' ? 'text' : type}
          className={`${styles['input-container']} ${
            !!error?.message && styles['input-error']
          }`}
          ref={ref}
          {...rest}
        />

        {type === 'password' && (
          <span
            onClick={() => setIsPasswordVisible((state) => !state)}
            className={styles.icon}
          >
            {isPasswordVisible ? (
              <FontAwesomeIcon icon={faEye} />
            ) : (
              <FontAwesomeIcon icon={faEyeSlash} />
            )}
          </span>
        )}
      </div>
      <ErrorMessage errorMessage={error?.message} />
    </div>
  )
}

export const InputText = forwardRef(InputBase)
