import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  onBack?: () => void
  backIcon?: ReactNode
  rightAction?: ReactNode
}

export const PageHeader = ({
  title,
  onBack,
  backIcon = <ArrowLeft className="h-5 w-5" />,
  rightAction
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2 mb-8">
      <div className="flex items-center gap-2">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
          >
            {backIcon}
          </button>
        )}
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {rightAction && (
        <div>
          {rightAction}
        </div>
      )}
    </div>
  )
}

export default PageHeader