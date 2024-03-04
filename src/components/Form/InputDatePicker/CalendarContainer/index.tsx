import { ForwardRefRenderFunction, forwardRef } from 'react'

import styles from './styles.module.scss'

interface ICalendarInputContainer {
  value?: any
  onClick?: any
}

const InputDatePickerContainerBase: ForwardRefRenderFunction<
  HTMLInputElement,
  ICalendarInputContainer
> = ({ value, onClick }, ref) => {
  return (
    <div onClick={onClick} ref={ref} className={styles.container}>
      {value}
    </div>
  )
}

export const InputDatePickerContainer = forwardRef(InputDatePickerContainerBase)
