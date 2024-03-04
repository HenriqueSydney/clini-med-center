'use client'

import React, {
  ChangeEvent,
  ForwardRefRenderFunction,
  forwardRef,
  useState,
} from 'react'

import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'

import { ErrorMessage } from '../ErrorMessage'

import styles from './styles.module.scss'
import Image from 'next/image'

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
}

const FileInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  InputTextProps
> = ({ label = '', error = null, name, ...rest }, ref) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function handleInputMaskClick() {
    const input = document.querySelector(
      `[name=${name}]`,
    ) as HTMLInputElement | null

    if (input) {
      input.click()
      const event = new Event('change', { bubbles: true, cancelable: true })
      input.dispatchEvent(event)
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }

      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  return (
    <div className={styles['input-container']}>
      {label && (
        <div className={styles.label}>
          <label>{label}</label>
        </div>
      )}
      <div className={styles['input-wrapper']}>
        <div
          className={styles.inputMask}
          onClick={() => {
            handleInputMaskClick()
          }}
        >
          <span>Selecione o arquivo...</span>
        </div>
        <input
          type="file"
          className={`${styles['input-container']} ${
            !!error?.message && styles['input-error']
          }`}
          ref={ref}
          name={name}
          onChangeCapture={handleFileChange}
          {...rest}
        />
      </div>
      {imagePreview && (
        <div className={styles.previewContainer}>
          <label>Pré-visualização de Arquivo</label>
          <div className={styles.imageContainer}>
            <Image
              src={imagePreview}
              alt="Preview"
              className={styles.previewImage}
              fill={true}
            />
          </div>
        </div>
      )}
      {error !== undefined &&
        Array.isArray(error) &&
        error.map((error) => {
          if (!error) return false
          return (
            <ErrorMessage key={error.message} errorMessage={error.message} />
          )
        })}

      {error && !Array.isArray(error) && (
        <ErrorMessage errorMessage={error.message as string} />
      )}
    </div>
  )
}

export const FileUpload = forwardRef(FileInputBase)
