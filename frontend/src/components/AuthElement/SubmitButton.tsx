import { ReactNode } from 'react'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

interface SubmitButtonProps {
  isSubmitting: boolean
  loadingText: string
  text: string
  icon?: ReactNode
}

export default function SubmitButton({ 
  isSubmitting, 
  loadingText, 
  text, 
  icon = <ArrowRight className="h-5 w-5" />
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      fullWidth
      size="lg"
      className="flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
    >
      {isSubmitting ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          <span>{loadingText}</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          {icon}
        </>
      )}
    </Button>
  )
}