'use client'

import React, { useContext } from 'react'

import { ButtonIcon } from '../ButtonIcon'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

import { CartContext } from '@/context/CartContext'

import styles from './styles.module.scss'

interface CartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  numberOfItemsOnCart?: number
  variant?: 'PRIMARY' | 'SECONDARY'
}

export function CartButton({
  variant = 'SECONDARY',
  ...rest
}: CartButtonProps) {
  const { cart } = useContext(CartContext)

  const numberOfItemsOnCart = cart.length

  return (
    <div className={styles.container}>
      <ButtonIcon
        variant={variant}
        icon={<FontAwesomeIcon icon={faCartShopping} />}
        {...rest}
      />
      {numberOfItemsOnCart > 0 && <span>{numberOfItemsOnCart}</span>}
    </div>
  )
}
