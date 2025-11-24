// src/app/instructor/notices/components/SearchBar.tsx
'use client';

import styled from 'styled-components';

// --- Icons ---
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 4px 6px 4px 12px;
  transition: all 0.2s;
  width: 300px;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  svg { color: #94a3b8; }
`;

const Input = styled.input`
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 100%;
  color: #334155;
  padding: 6px 0;
  background: transparent;

  &::placeholder { color: #cbd5e1; }
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover { background: #2563eb; }
`;

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <Container>
      <SearchIcon />
      <Input
        type="text"
        placeholder="제목으로 검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
      />
      <Button onClick={onSubmit}>검색</Button>
    </Container>
  );
}