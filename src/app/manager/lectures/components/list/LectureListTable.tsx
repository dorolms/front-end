// src/app/instructor/lectures/components/list/LectureListTable.tsx
import styled from "styled-components";

export type LectureListRow = {
  id: number;
  no: number;
  type: string;
  division: string;
  title: string;
  applicationPeriod: string;
  applicationLabel: string;
  statusLabel: string;
};

type Props = {
  rows: LectureListRow[];
  onRowClick?: (row: LectureListRow) => void;
};

export default function LectureListTable({ rows, onRowClick }: Props) {
  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: "60px" }}>번호</Th>
            <Th style={{ width: "100px" }}>타입</Th>
            <Th style={{ width: "120px" }}>강의 구분</Th>
            <Th>강의명</Th>
            <Th style={{ width: "140px" }}>신청기간</Th>
            <Th style={{ width: "100px" }}>신청현황 (주/보조)</Th>
            <Th style={{ width: "100px" }}>상태</Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <Td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                조회된 강의가 없습니다.
              </Td>
            </tr>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id} onClick={() => onRowClick?.(row)}>
                <Td>{row.no}</Td>
                <Td>{row.type}</Td>
                <Td>{row.division}</Td>
                <Td style={{ textAlign: "left", fontWeight: 500 }}>
                  {row.title}
                </Td>
                <Td>{row.applicationPeriod}</Td>
                <Td>{row.applicationLabel}</Td>
                <Td>
                  <StatusBadge status={row.statusLabel}>
                    {row.statusLabel}
                  </StatusBadge>
                </Td>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>
    </TableWrapper>
  );
}

const TableWrapper = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  margin-bottom: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #f9fafb;
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background-color: #f9fafb;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const Td = styled.td`
  padding: 14px 16px;
  text-align: center;
  font-size: 14px;
  color: #111827;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.status === "모집 중") return "#DBEAFE";
    if (props.status === "배정 중") return "#FEF3C7";
    if (props.status === "배정 완료") return "#D1FAE5";
    return "#E5E7EB";
  }};
  color: ${(props) => {
    if (props.status === "모집 중") return "#1E40AF";
    if (props.status === "배정 중") return "#92400E";
    if (props.status === "배정 완료") return "#065F46";
    return "#374151";
  }};
`;
