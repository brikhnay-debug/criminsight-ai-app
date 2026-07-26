'use client';

import { useFormState } from 'react-dom';
import { updatePassword } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { FieldError } from '@/components/ui/field-error';
import { Alert } from '@/components/ui/alert';
import { SubmitButton } from '@/components/ui/submit-button';

export function UpdatePasswordForm() {
  const [state, formAction] = useFormState(updatePassword, null);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.error && <Alert variant="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="password">New password</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={!!state?.fieldErrors?.password}
        />
        <FieldError messages={state?.fieldErrors?.password} />
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your new password"
          error={!!state?.fieldErrors?.confirmPassword}
        />
        <FieldError messages={state?.fieldErrors?.confirmPassword} />
      </div>

      <SubmitButton className="w-full" size="lg">
        Update password
      </SubmitButton>
    </form>
  );
}
