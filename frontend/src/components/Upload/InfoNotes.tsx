import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface InfoItem {
  text: string
}

interface InfoNotesProps {
  title: string
  icon?: ReactNode
  items: InfoItem[]
  variant?: 'default' | 'info' | 'warning'
}

export const InfoNotes = ({ 
  title, 
  icon = <AlertCircle className="h-5 w-5 text-blue-500" />,
  items,
  variant = 'info'
}: InfoNotesProps) => {
  
  const variantStyles = {
    default: {
      container: 'bg-card dark:bg-card',
      border: 'border-border dark:border-border',
      title: 'text-foreground dark:text-foreground',
      text: 'text-muted-foreground dark:text-muted-foreground',
      bullet: 'bg-muted dark:bg-muted'
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/10',
      border: 'border-blue-100 dark:border-blue-900/30',
      title: 'text-blue-700 dark:text-blue-300',
      text: 'text-blue-700 dark:text-blue-300',
      bullet: 'bg-blue-200 dark:bg-blue-700'
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-900/10',
      border: 'border-amber-100 dark:border-amber-900/30',
      title: 'text-amber-700 dark:text-amber-300',
      text: 'text-amber-700 dark:text-amber-300',
      bullet: 'bg-amber-200 dark:bg-amber-700'
    }
  }

  const styles = variantStyles[variant]

  return (
    <div className={`p-6 ${styles.container} rounded-xl text-sm border ${styles.border}`}>
      <h2 className={`font-semibold mb-3 flex items-center gap-2 ${styles.title}`}>
        {icon}
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <div className={`min-w-4 h-4 w-4 rounded-full ${styles.bullet} mt-1`}></div>
            <span className={styles.text}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default InfoNotes