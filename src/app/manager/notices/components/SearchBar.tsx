'use client';
/**
 * SearchBar.tsx
 * - 공지 제목 검색을 위한 <input>과 '검색' <button> UI.
 * - Enter 키 또는 '검색' 버튼 클릭 시 onSubmit 콜백 호출.
 */

import styled from 'styled-components';

// (styled-components 코드는 instructor와 동일)
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
  /** input에 표시될 현재 검색어 값 (제어 컴포넌트) */
  value: string;
  /** input 값 변경 시 호출될 콜백 함수 */
  onChange: (v: string) => void;
  /** '검색' 버튼 클릭 또는 Enter 시 호출될 콜백 함수 */
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
        aria-label="공지사항 제목 검색"
      />
      <button onClick={onSubmit}>검색</button>
    </Wrap>
  );
}