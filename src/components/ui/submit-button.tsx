'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './button';

export function SubmitButton({ children, ...props }: ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" isLoading={pending} disabled={pending} {...props}>
      {children}
    </Button>
  );
}
