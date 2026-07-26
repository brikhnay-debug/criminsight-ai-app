'use client';

import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
    const el = event.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div>
      <div className="glass-panel flex items-end gap-2 p-2">
        <label htmlFor="chat-input" className="sr-only">
          Ask CrimInsight AI a question
        </label>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Ask about a theory, paste a case study, or request a quiz…"
          aria-describedby="chat-input-hint"
          className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-white transition-all duration-250 hover:-translate-y-0.5 hover:shadow-glass-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p id="chat-input-hint" className="sr-only">
        Press Enter to send, Shift plus Enter for a new line.
      </p>
    </div>
  );
}
