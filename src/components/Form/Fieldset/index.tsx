import { ReactNode } from 'react'

import styles from './styles.module.scss'

interface IFieldsetProps {
  title: string
  children: ReactNode
}

export function Fieldset({ title, children }: IFieldsetProps) {
  return (
    <fieldset className={styles.fieldset}>
      <h1>{title}</h1>
      {children}
    </fieldset>
  )
}
