'use client';
/**
 * NoticeTable.tsx
 * - 공지 목록을 표(table) 형태로 렌더링.
 * - 제목 셀 클릭 시 onClickTitle 콜백으로 선택된 공지 객체를 상위로 전달.
 */

import styled from 'styled-components';
import type { Notice } from '../types';

// (styled-components 코드는 instructor와 동일)
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 2px solid #333;

  th,
  td {
    padding: 12px 16px;
    border-bottom: 1px solid #eee;
    text-align: left;
    font-size: 0.95rem;
  }
  th {
    background-color: #f9f9f9;
    font-weight: 600;
  }
  td.title {
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
  td.author { width: 15%; text-align: center; }
  td.date { width: 20%; text-align: center; color: #777; }
`;

type Props = {
  /** 현재 페이지에 표시할 공지 목록 */
  rows: Notice[];
  /** 제목 클릭 시 호출될 콜백 함수 (상세 모달 열기용) */
  onClickTitle: (notice: Notice) => void;
};

export default function NoticeTable({ rows, onClickTitle }: Props) {
  return (
    <Table>
      <thead>
        <tr>
          <th>제목</th>
          <th>작성자</th>
          <th>작성일시</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={3} style={{ textAlign: 'center', color: '#888' }}>
              검색 결과가 없습니다.
            </td>
          </tr>
        )}
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="title" onClick={() => onClickTitle(row)}>
              {row.title}
            </td>
            <td className="author">{row.author}</td>
            <td className="date">{row.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}