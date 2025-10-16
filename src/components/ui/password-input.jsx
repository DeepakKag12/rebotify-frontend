import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

const PasswordInput = React.forwardRef(
  ({ className, error, label, showStrengthIndicator, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: '', color: '' });

    const calculateStrength = (password) => {
      if (!password) return { score: 0, label: '', color: '' };

      let score = 0;
      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z0-9]/.test(password)) score++;

      if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
      if (score <= 3) return { score, label: 'Medium', color: 'bg-yellow-500' };
      return { score, label: 'Strong', color: 'bg-brand-green' };
    };

    const handlePasswordChange = (e) => {
      if (showStrengthIndicator) {
        setStrength(calculateStrength(e.target.value));
      }
      if (props.onChange) {
        props.onChange(e);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'flex h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pr-12 text-sm',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent',
              'placeholder:text-gray-400',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            ref={ref}
            onChange={handlePasswordChange}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {showStrengthIndicator && strength.label && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all duration-300',
                    i < strength.score ? strength.color : 'bg-gray-200'
                  )}
                />
              ))}
            </div>
            <p className={cn('text-xs', strength.color.replace('bg-', 'text-'))}>
              Password strength: {strength.label}
            </p>
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {showStrengthIndicator && !error && (
          <p className="mt-1.5 text-xs text-gray-500">
            Use 8+ characters with mix of letters, numbers & symbols
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
