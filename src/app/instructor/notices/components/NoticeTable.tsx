'use client';
/**
 * NoticeTable.tsx
 * - 공지 목록을 표로 렌더링.
 * - 제목 셀 클릭 시 onClickTitle 콜백으로 선택된 공지를 상위로 전달 → 모달 오픈.
 * - 접근성: role="table", th, scope 등 확장 가능.
 */

import styled from 'styled-components';
import type { Notice } from '../types';

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
    color: #555;
    font-weight: 600;
  }

  td.title {
    cursor: pointer;
  }
  td.title:hover {
    text-decoration: underline;
  }

  td.author {
    width: 15%;
    text-align: center;
  }
  td.date {
    width: 20%;
    text-align: center;
    color: #777;
  }
`;

type Props = {
  rows: Notice[];
  onClickTitle: (notice: Notice) => void;
};

export default function NoticeTable({ rows, onClickTitle }: Props) {
  return (
    <Table role="table">
      <thead>
        <tr>
          <th>제목</th>
          <th style={{ width: '15%', textAlign: 'center' }}>작성자</th>
          <th style={{ width: '20%', textAlign: 'center' }}>작성일</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((n) => (
          <tr key={n.id}>
            <td className="title" onClick={() => onClickTitle(n)}>
              {n.title}
            </td>
            <td className="author">{n.author}</td>
            <td className="date">{n.createdAt}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
