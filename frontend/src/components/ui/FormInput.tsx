import { ReactNode, InputHTMLAttributes, forwardRef } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  icon: ReactNode
  error?: string
  rightIcon?: ReactNode
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, icon, error, rightIcon, className = '', ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block font-medium mb-2 text-foreground">
          {label}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
          <input
            id={id}
            ref={ref}
            className={`w-full pl-10 ${rightIcon ? 'pr-10' : 'pr-3'} py-2.5 bg-background border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500 focus:ring-red-200'
                : 'border-border focus:ring-blue-400/40 focus:border-blue-400'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1.5">{error}</p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput