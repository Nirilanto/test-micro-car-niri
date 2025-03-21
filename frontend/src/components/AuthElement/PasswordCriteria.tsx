import { Check, X } from 'lucide-react'

interface PasswordCriteriaProps {
  criteria: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
  }
}

export default function PasswordCriteria({ criteria }: PasswordCriteriaProps) {
  const criteriaItems = [
    { key: 'minLength', label: 'Au moins 6 caractères' },
    { key: 'hasUppercase', label: 'Au moins une lettre majuscule' },
    { key: 'hasLowercase', label: 'Au moins une lettre minuscule' },
    { key: 'hasNumber', label: 'Au moins un chiffre' },
  ]

  return (
    <div className="mt-2 text-xs space-y-2 pl-1">
      {criteriaItems.map((item) => {
        const isValid = criteria[item.key as keyof typeof criteria]
        
        return (
          <p key={item.key} className="flex items-center gap-2">
            {isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
            <span className={isValid ? "text-green-600" : "text-muted-foreground"}>
              {item.label}
            </span>
          </p>
        )
      })}
    </div>
  )
}