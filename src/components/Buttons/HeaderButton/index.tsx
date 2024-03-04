import React, { ForwardRefRenderFunction, forwardRef } from 'react'

import styles from './styles.module.scss'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  numberOfItems?: number
}

const ButtonBase: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { title, ...rest },
  ref,
) => {
  return (
    <button className={styles.container} ref={ref} {...rest}>
      {title}
    </button>
  )
}

export const HeaderButton = forwardRef(ButtonBase)
