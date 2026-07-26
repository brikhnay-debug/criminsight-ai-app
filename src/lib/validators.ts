import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[0-9]/, 'Include at least one number');

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Enter your full name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    studyLevel: z.enum(['undergrad', 'masters', 'phd'], {
      errorMap: () => ({ message: 'Select your study level' }),
    }),
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.literal('on', {
      errorMap: () => ({ message: 'You must accept the Terms and Privacy Policy' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const resetPasswordRequestSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export type ResetPasswordRequestInput = z.infer<typeof resetPasswordRequestSchema>;

export const updatePasswordSchema = z
  .object({
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message is too long (max 4000 characters)'),
  conversationId: z.string().uuid().optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
