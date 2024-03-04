import styles from './styles.module.scss'

interface DividerProps {
  title?: string
  titleType?: 'text' | 'header'
  width?: number
}

export function Divider({
  title,
  titleType = 'text',
  width = 75,
}: DividerProps) {
  return (
    <div className={styles.container}>
      {title && titleType === 'text' && <span>{title}</span>}
      {title && titleType === 'header' && <h1>{title}</h1>}
      <div className={styles.divider} style={{ width: `${width}%` }} />
    </div>
  )
}
