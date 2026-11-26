import { useRef, useState, type ChangeEvent } from 'react';

import {
  DEFAULT_SCHOOL_EMAIL_DOMAIN,
  isPresetEmailDomain,
  SCHOOL_EMAIL_DOMAINS,
} from '@/constants/school';
import { cn } from '@/utils/cn';

import './EmailDomainField.css';

const CUSTOM_OPTION = 'custom';

interface EmailDomainFieldProps {
  value: string;
  onChange: (domain: string) => void;
  onBlur?: () => void;
}

export default function EmailDomainField({ value, onChange, onBlur }: EmailDomainFieldProps) {
  const [isCustom, setIsCustom] = useState(() => value !== '' && !isPresetEmailDomain(value));
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    if (selected === CUSTOM_OPTION) {
      setIsCustom(true);
      onChange('');
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    setIsCustom(false);
    onChange(selected);
  };

  return (
    <span className="email-domain-field">
      @
      {isCustom && (
        <input
          ref={inputRef}
          className="email-domain-field__input"
          aria-label="학교 이메일 도메인 직접 입력"
          placeholder="school.ac.kr"
          value={value}
          onChange={(event) => onChange(event.target.value.trim().toLowerCase())}
          onBlur={onBlur}
          autoCapitalize="off"
          autoComplete="off"
          inputMode="url"
        />
      )}
      <select
        className={cn(
          'email-domain-field__select',
          isCustom && 'email-domain-field__select--compact',
        )}
        aria-label="학교 이메일 도메인"
        value={isCustom ? CUSTOM_OPTION : value || DEFAULT_SCHOOL_EMAIL_DOMAIN}
        onChange={handleSelect}
        onBlur={onBlur}
      >
        {SCHOOL_EMAIL_DOMAINS.map((domain) => (
          <option key={domain} value={domain}>
            {domain}
          </option>
        ))}
        <option value={CUSTOM_OPTION}>직접 입력</option>
      </select>
    </span>
  );
}
