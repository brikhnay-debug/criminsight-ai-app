'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import {
  loginSchema,
  signupSchema,
  resetPasswordRequestSchema,
  updatePasswordSchema,
} from '@/lib/validators';
import type { ActionState, FieldErrors } from '@/types';

function fieldErrorsFromZod(error: ZodError): FieldErrors {
  return error.flatten().fieldErrors as FieldErrors;
}

/** Only allow redirecting to internal paths, never external URLs. */
function safeRedirectPath(value: FormDataEntryValue | null): string {
  if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }
  return '/dashboard';
}

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      error:
        error.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect(safeRedirectPath(formData.get('redirectTo')));
}

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    studyLevel: formData.get('studyLevel'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
    terms: formData.get('terms'),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        study_level: parsed.data.studyLevel,
      },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      return { error: 'An account with this email already exists. Try logging in instead.' };
    }
    return { error: error.message };
  }

  // If email confirmation is required, Supabase returns a user with no
  // active session yet — show a "check your inbox" message instead of
  // redirecting into the (still signed-out) dashboard.
  if (data.user && !data.session) {
    return {
      success: true,
      message:
        "We've sent a confirmation link to your email. Confirm your address, then log in to get started.",
    };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordRequestSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/update-password`,
  });

  if (error) {
    return { error: error.message };
  }

  // Deliberately generic wording — never confirm/deny whether an email
  // address exists in the system.
  return {
    success: true,
    message: "If an account exists for that email, we've sent a password reset link.",
  };
}

export async function updatePassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = updatePasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const supabase = await createClient();

  // This only succeeds if the user arrived via a valid recovery link,
  // which Supabase turns into a temporary authenticated session.
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { error: error.message };
  }

  redirect('/login?reset=success');
}
