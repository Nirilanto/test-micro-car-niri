import { useState, forwardRef, InputHTMLAttributes, ReactNode } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import FormInput from './FormInput'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  icon?: ReactNode
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label, error, icon = <Lock className="h-5 w-5 text-muted-foreground" />, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    const togglePassword = () => {
      setShowPassword(!showPassword)
    }

    const passwordToggleButton = (
      <button
        type="button"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={togglePassword}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    )

    return (
      <FormInput
        id={id}
        label={label}
        type={showPassword ? 'text' : 'password'}
        icon={icon}
        error={error}
        rightIcon={passwordToggleButton}
        ref={ref}
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput