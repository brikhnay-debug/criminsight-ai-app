'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { login } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FieldError } from '@/components/ui/field-error';
import { Alert } from '@/components/ui/alert';
import { SubmitButton } from '@/components/ui/submit-button';

const CALLBACK_ERROR_MESSAGES: Record<string, string> = {
  'auth-callback-failed':
    'That link has expired or already been used. Please try again.',
};

export function LoginForm({
  redirectTo,
  callbackError,
}: {
  redirectTo?: string;
  callbackError?: string;
}) {
  const [state, formAction] = useFormState(login, null);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

      {callbackError && CALLBACK_ERROR_MESSAGES[callbackError] && (
        <Alert variant="error">{CALLBACK_ERROR_MESSAGES[callbackError]}</Alert>
      )}

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
          aria-describedby={state?.fieldErrors?.email ? 'email-error' : undefined}
        />
        {state?.fieldErrors?.email && (
          <div id="email-error">
            <FieldError messages={state.fieldErrors.email} />
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/reset-password"
            className="mb-1.5 text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={!!state?.fieldErrors?.password}
          aria-describedby={state?.fieldErrors?.password ? 'password-error' : undefined}
        />
        {state?.fieldErrors?.password && (
          <div id="password-error">
            <FieldError messages={state.fieldErrors.password} />
          </div>
        )}
      </div>

      <SubmitButton className="w-full" size="lg">
        Log in
      </SubmitButton>
    </form>
  );
}
