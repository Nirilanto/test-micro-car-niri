import { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import { ArrowLeft, Upload, Clock } from 'lucide-react'

interface ActionButtonsProps {
  onCancel: () => void
  isSubmitting: boolean
  isDisabled: boolean
  primaryIcon?: ReactNode
  primaryText?: string
  loadingText?: string
  cancelIcon?: ReactNode
  cancelText?: string
}

export const ActionButtons = ({
  onCancel,
  isSubmitting,
  isDisabled,
  primaryIcon = <Upload className="h-4 w-4" />,
  primaryText = 'Téléverser',
  loadingText = 'Téléversement en cours...',
  cancelIcon = <ArrowLeft className="h-4 w-4" />,
  cancelText = 'Annuler'
}: ActionButtonsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="flex items-center gap-2"
      >
        {cancelIcon}
        {cancelText}
      </Button>
      <Button
        type="submit"
        disabled={isDisabled || isSubmitting}
        className={`flex items-center gap-2 ${
          isDisabled 
            ? '' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        }`}
      >
        {isSubmitting ? (
          <>
            <Clock className="h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {primaryIcon}
            {primaryText}
          </>
        )}
      </Button>
    </div>
  )
}

export default ActionButtons