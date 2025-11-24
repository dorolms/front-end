// src/app/instructor/notices/components/NoticeTable.tsx
'use client';

import styled from 'styled-components';
import type { Notice } from '../types';

const TableContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f8fafc;
    color: #64748b;
    font-weight: 700;
    font-size: 0.85rem;
    text-align: left;
    padding: 16px 24px;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 18px 24px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-size: 0.95rem;
    vertical-align: middle;
  }

  tr:last-child td { border-bottom: none; }

  tbody tr {
    transition: background 0.2s;
    &:hover { background: #f8fafc; }
  }

  .col-title {
    font-weight: 600;
    color: #1e293b;
    cursor: pointer;
    &:hover {
      color: #3b82f6;
      text-decoration: underline;
      text-underline-offset: 4px;
    }
  }

  .col-author { width: 15%; color: #64748b; }
  .col-date { width: 20%; color: #94a3b8; font-size: 0.85rem; text-align: right; }
`;

const EmptyRow = styled.tr`
  td { text-align: center; padding: 60px 0; color: #94a3b8; }
`;

type Props = {
  rows: Notice[];
  onClickTitle: (notice: Notice) => void;
};

export default function NoticeTable({ rows, onClickTitle }: Props) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th>제목</th>
            <th className="col-author">작성자</th>
            <th className="col-date">작성일시</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow>
              <td colSpan={3}>검색 결과가 없습니다.</td>
            </EmptyRow>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="col-title" onClick={() => onClickTitle(row)}>
                  {row.title}
                </td>
                <td className="col-author">{row.author}</td>
                <td className="col-date">{row.createdAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}