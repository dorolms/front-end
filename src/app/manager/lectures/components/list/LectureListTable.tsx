"use client";

import styled from "styled-components";

// 👉 강의 목록 한 줄 타입 (필요하면 나중에 types.ts로 분리해도 됨)
export type LectureListRow = {
  id: number | string;
  no: number;
  type: string; // 일반 / 부스 / 도로랜드 / 대회 ...
  division: string; // 구분 (TMD, 광명시, 단원청소년수련관 등)
  title: string; // 강의명
  applicationPeriod: string; // 신청기간 문자열 (예: ~2025/11/09)
  applicationLabel: string; // 신청하기 / 신청 취소 / 신청 완료 / 마감 등
  statusLabel: string; // 모집 중 / 배정 중 / 배정 완료 등
};

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
  table-layout: fixed;

  th {
    background: #f8fafc;
    color: #64748b;
    font-weight: 700;
    font-size: 0.85rem;
    text-align: center;
    padding: 14px 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    color: #334155;
    font-size: 0.9rem;
    vertical-align: middle;
    text-align: center;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr {
    transition: background 0.15s;
    &:hover {
      background: #f8fafc;
    }
  }

  .col-no {
    width: 60px;
  }
  .col-type {
    width: 90px;
  }
  .col-division {
    width: 140px;
  }
  .col-title {
    text-align: left;
  }
  .col-period {
    width: 160px;
  }
  .col-apply {
    width: 110px;
  }
  .col-status {
    width: 110px;
  }
`;

const EmptyRow = styled.tr`
  td {
    text-align: center;
    padding: 60px 0;
    color: #94a3b8;
  }
`;

// 유형 뱃지
const TypeBadge = styled.span<{ variant: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;

  ${({ variant }) => {
    switch (variant) {
      case "일반":
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case "부스":
        return `
          background: #fee2e2;
          color: #b91c1c;
        `;
      case "도로랜드":
        return `
          background: #dbeafe;
          color: #1d4ed8;
        `;
      case "대회":
        return `
          background: #e0f2fe;
          color: #0369a1;
        `;
      default:
        return `
          background: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

// 상태 텍스트 (모집 중 / 배정 중 / 배정 완료 ...)
const StatusText = styled.span<{ status: string }>`
  font-weight: 700;

  ${({ status }) => {
    if (status.includes("모집")) {
      // 모집 중
      return `
        color: #16a34a;
      `;
    }
    if (status.includes("배정 중")) {
      return `
        color: #ea580c;
      `;
    }
    if (status.includes("배정 완료") || status.includes("완료")) {
      return `
        color: #0f172a;
      `;
    }
    if (status.includes("마감")) {
      return `
        color: #9ca3af;
      `;
    }
    return `
      color: #0f172a;
    `;
  }}
`;

// 신청 버튼 느낌의 텍스트
const ApplyText = styled.button`
  border: none;
  background: transparent;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

type Props = {
  rows: LectureListRow[];
  onClickTitle?: (row: LectureListRow) => void; // 강의명 클릭 → 상세 모달/페이지
  onClickApply?: (row: LectureListRow) => void; // 신청 컬럼 클릭 액션
};

export default function LectureListTable({
  rows,
  onClickTitle,
  onClickApply,
}: Props) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <th className="col-no">No</th>
            <th className="col-type">유형</th>
            <th className="col-division">구분</th>
            <th className="col-title">강의명</th>
            <th className="col-period">신청기간</th>
            <th className="col-apply">신청</th>
            <th className="col-status">상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <EmptyRow>
              <td colSpan={7}>검색 결과가 없습니다.</td>
            </EmptyRow>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td className="col-no">{row.no}</td>
                <td className="col-type">
                  <TypeBadge variant={row.type}>{row.type}</TypeBadge>
                </td>
                <td className="col-division">{row.division}</td>
                <td
                  className="col-title"
                  onClick={() => onClickTitle?.(row)}
                  style={{ cursor: onClickTitle ? "pointer" : "default" }}
                >
                  {row.title}
                </td>
                <td className="col-period">{row.applicationPeriod}</td>
                <td className="col-apply">
                  {row.applicationLabel ? (
                    <ApplyText onClick={() => onClickApply?.(row)}>
                      {row.applicationLabel}
                    </ApplyText>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="col-status">
                  <StatusText status={row.statusLabel}>
                    {row.statusLabel}
                  </StatusText>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </TableContainer>
  );
}
