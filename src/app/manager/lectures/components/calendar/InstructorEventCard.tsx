// src/app/instructor/lectures/components/InstructorEventCard.tsx
import React from "react";
import styled from "styled-components";
import { LectureDetail, Schedule } from "../../types";
import { INSTRUCTOR_THEME, INSTRUCTOR_BORDER, STATUS_COLOR } from "./constants";

interface InstructorEventCardProps {
  lecture: LectureDetail;
  schedule: Schedule;
  onClick: () => void;
}

// 타입별 테마 색상 (대시보드 카드와 동일하게)
const getTypeTheme = (type: string) => {
  const key = type.toUpperCase();
  const bg =
    INSTRUCTOR_THEME[key as keyof typeof INSTRUCTOR_THEME] ||
    INSTRUCTOR_THEME.ETC;
  const borderColor =
    INSTRUCTOR_BORDER[key as keyof typeof INSTRUCTOR_BORDER] ||
    INSTRUCTOR_BORDER.ETC;
  return { bg, borderColor };
};

const InstructorEventCard: React.FC<InstructorEventCardProps> = ({
  lecture,
  schedule,
  onClick,
}) => {
  const { bg, borderColor } = getTypeTheme(lecture.type);

  const isRecruiting = lecture.status === "RECRUITING";
  const timeStr = schedule.start_time.slice(0, 5);

  let variant: "solid" | "applied" | "pending" = "applied";
  let statusLabel = isRecruiting ? "모집 중" : "모집 완료";

  // ✅ 모집 중 → 포인트 컬러, 모집 완료 → 회색
  const statusColor: string = isRecruiting ? STATUS_COLOR.APPLIED : "#6B7280"; // gray-600

  return (
    <EventCard
      $variant={variant}
      $bg={bg}
      $borderColor={borderColor}
      $isRecruiting={isRecruiting}
      onClick={onClick}>
      <TimeRow>
        <span>{timeStr}</span>
        <StatusBadge $color={statusColor}>{statusLabel}</StatusBadge>
      </TimeRow>
      <TitleRow $isRecruiting={isRecruiting}>{lecture.title}</TitleRow>
      {/* {lecture.location && <LocationRow $isRecruiting={isRecruiting}>{lecture.location}</LocationRow>} */}
    </EventCard>
  );
};

// ───────────────── 스타일 ─────────────────

const EventCard = styled.div<{
  $variant: "solid" | "applied" | "pending";
  $bg: string;
  $borderColor: string;
  $isRecruiting: boolean;
}>`
  width: 90%;
  margin: 0 auto;
  padding: 8px 10px;
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  ${(p) =>
    p.$variant === "solid"
      ? `
    background-color: ${p.$bg};
    border-left: 4px solid ${p.$borderColor};
    box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  `
      : p.$variant === "applied"
      ? // ✅ 모집 중 / 모집 완료 구분
        p.$isRecruiting
        ? `
      background-color: #ffffff;
      border: 1px solid ${p.$borderColor};
      border-left: 4px solid ${p.$borderColor};
    `
        : `
      background-color: #F9FAFB;        /* 살짝 회색 배경 */
      border: 1px solid #D1D5DB;        /* 회색 테두리 */
      border-left: 4px solid #D1D5DB;   /* 왼쪽 라인도 회색 */
      opacity: 0.9;
    `
      : `
    background-color: #fafafa;
    border: 1px dashed ${p.$borderColor};
    border-left: 4px solid ${p.$borderColor};
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  }
`;

const TimeRow = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleRow = styled.div<{ $isRecruiting: boolean }>`
  font-size: 0.85rem;
  font-weight: 700;
  color: ${(p) =>
    p.$isRecruiting
      ? "#1e293b"
      : "#94A3B8"}; /* 모집 완료일 땐 글자도 조금 흐리게 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const LocationRow = styled.div<{ $isRecruiting: boolean }>`
  font-size: 0.75rem;
  color: ${(p) => (p.$isRecruiting ? "#64748b" : "#9CA3AF")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span<{ $color: string }>`
  font-size: 0.65rem;
  font-weight: 800;
  color: ${(p) => p.$color};
  background: #fff;
  padding: 1px 5px;
  border-radius: 4px;
  border: 1px solid ${(p) => p.$color};
  line-height: 1.2;
`;

export default InstructorEventCard;
