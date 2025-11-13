'use client';
/**
 * SearchBar.tsx
 * - 공지 제목 검색 입력 + 검색 버튼.
 * - onSubmit 호출 시 상위에서 page를 1로 초기화하여 UX 개선.
 * - 접근성(aria-label) 부여.
 */

import styled from 'styled-components';

const Wrap = styled.div`
  display: flex;
  gap: 8px;

  input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  button {
    padding: 8px 16px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
  }
`;

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <Wrap>
      <input
        type="text"
        placeholder="제목으로 검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
        aria-label="공지 제목 검색"
      />
      <button onClick={onSubmit}>검색</button>
    </Wrap>
  );
}
