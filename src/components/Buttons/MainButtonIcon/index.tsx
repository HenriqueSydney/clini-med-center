import React, { ForwardRefRenderFunction, forwardRef } from 'react'

import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import styles from './styles.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconDefinition
  title?: string
  children?: React.ReactNode
  variant?: 'PRIMARY' | 'SECONDARY'
  numberOfItems?: number
  isSubmitting?: boolean
}

const ButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { icon, title = '', variant = 'PRIMARY', disabled = false, ...rest },
  ref,
) => {
  const variantColor = variant === 'PRIMARY' ? styles.primary : styles.secondary
  return (
    <button
      className={`${styles.container} ${variantColor}`}
      ref={ref}
      disabled={disabled}
      {...rest}
    >
      <FontAwesomeIcon icon={icon} size="6x" />
      {title && title}
    </button>
  )
}

export const MainButtonIcon = forwardRef(ButtonBase)
