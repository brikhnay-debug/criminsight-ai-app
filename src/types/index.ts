export type FieldErrors = Record<string, string[] | undefined>;

/**
 * The return type of every auth server action. Forms read this via
 * useFormState to render field-level and top-level errors, or a
 * success message, without a full page reload.
 */
export type ActionState = {
  error?: string;
  fieldErrors?: FieldErrors;
  success?: boolean;
  message?: string;
} | null;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
}
