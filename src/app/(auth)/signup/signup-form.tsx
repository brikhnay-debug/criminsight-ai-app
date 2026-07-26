'use client';

import { useFormState } from 'react-dom';
import { signup } from '@/app/auth/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FieldError } from '@/components/ui/field-error';
import { Alert } from '@/components/ui/alert';
import { SubmitButton } from '@/components/ui/submit-button';

export function SignupForm() {
  const [state, formAction] = useFormState(signup, null);

  if (state?.success) {
    return (
      <Alert variant="success">{state.message ?? 'Check your inbox to confirm your email.'}</Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state?.error && <Alert variant="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          placeholder="Jane Doe"
          error={!!state?.fieldErrors?.fullName}
        />
        <FieldError messages={state?.fieldErrors?.fullName} />
      </div>

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

      <div>
        <Label htmlFor="studyLevel">Study level</Label>
        <select
          id="studyLevel"
          name="studyLevel"
          defaultValue="undergrad"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm text-ink-primary backdrop-blur-sm transition-colors duration-250 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="undergrad">Undergraduate</option>
          <option value="masters">Master&apos;s</option>
          <option value="phd">PhD</option>
        </select>
        <FieldError messages={state?.fieldErrors?.studyLevel} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
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
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          error={!!state?.fieldErrors?.confirmPassword}
        />
        <FieldError messages={state?.fieldErrors?.confirmPassword} />
      </div>

      <div>
        <div className="flex items-start gap-2">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="terms" className="mb-0 font-normal text-ink-secondary">
            I agree to the Terms and Privacy Policy.
          </Label>
        </div>
        <FieldError messages={state?.fieldErrors?.terms} />
      </div>

      <SubmitButton className="w-full" size="lg">
        Create account
      </SubmitButton>
    </form>
  );
}
