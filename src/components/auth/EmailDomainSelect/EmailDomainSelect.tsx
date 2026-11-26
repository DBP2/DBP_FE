import { SCHOOL_EMAIL_DOMAINS, type SchoolEmailDomain } from '@/constants/school';

import './EmailDomainSelect.css';

interface EmailDomainSelectProps {
  value: SchoolEmailDomain;
  onChange: (domain: SchoolEmailDomain) => void;
}

export default function EmailDomainSelect({ value, onChange }: EmailDomainSelectProps) {
  return (
    <span className="email-domain-select">
      @
      <select
        className="email-domain-select__select"
        aria-label="학교 이메일 도메인"
        value={value}
        onChange={(event) => onChange(event.target.value as SchoolEmailDomain)}
      >
        {SCHOOL_EMAIL_DOMAINS.map((domain) => (
          <option key={domain} value={domain}>
            {domain}
          </option>
        ))}
      </select>
    </span>
  );
}
