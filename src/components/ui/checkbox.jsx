import React from 'react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          className={cn(
            'mt-1 h-4 w-4 rounded border-gray-300 text-brand-green',
            'focus:ring-2 focus:ring-brand-green focus:ring-offset-0',
            'transition-colors cursor-pointer',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label htmlFor={props.id} className="text-sm text-gray-700 cursor-pointer select-none">
            {label}
          </label>
        )}
      </div>
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
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
