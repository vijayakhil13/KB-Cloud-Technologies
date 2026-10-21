'use client';

import { forwardRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Input, { type InputProps } from '@/components/ui/Input';

const PasswordField = forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'trailing'>>(function PasswordField(
  props,
  ref
) {
  const [show, setShow] = useState(false);
  const Icon = show ? EyeSlashIcon : EyeIcon;
  return (
    <Input
      ref={ref}
      {...props}
      type={show ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
          className="grid h-10 w-10 place-items-center rounded-lg text-ink-muted hover:text-ink"
        >
          <Icon className="h-5 w-5" width={20} height={20} aria-hidden="true" />
        </button>
      }
    />
  );
});

export default PasswordField;
