'use client';

import { useFormState } from 'react-dom';
import { requestPasswordReset } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FieldError } from '@/components/ui/field-error';
import { Alert } from '@/components/ui/alert';
import { SubmitButton } from '@/components/ui/submit-button';

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(requestPasswordReset, null);

  if (state?.success) {
    return <Alert variant="success">{state.message}</Alert>;
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.error && <Alert variant="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@university.edu"
          error={!!state?.fieldErrors?.email}
        />
        <FieldError messages={state?.fieldErrors?.email} />
      </div>

      <SubmitButton className="w-full" size="lg">
        Send reset link
      </SubmitButton>
    </form>
  );
}
