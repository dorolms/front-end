// src/app/instructor/dashboard/components/NextLectureWidget.tsx
'use client';

import styled from 'styled-components';
import type { InstructorEventItem } from '../types';

// --- Icons (기존 동일) ---
const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

// --- Styled Components ---

const Panel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background: #ffffff;
  /* 그림자를 조금 더 고급스럽게 퍼지게 수정 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f5;
  box-sizing: border-box;
  padding: 22px; /* 패딩 살짝 여유 */
  display: flex;
  flex-direction: column;
  gap: 16px; /* 간격 조정 */
  overflow: hidden;
  position: relative;

  /* 상단에 얇은 컬러 바 포인트 (선택 사항 - 브랜드 컬러) */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px; /* 상단 컬러 바 때문에 살짝 띄움 */
`;

const TitleArea = styled.div`
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.5px;
  }
`;

const DdayBadge = styled.div<{ $type?: 'today' | 'future' | 'past' }>`
  padding: 5px 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);

  ${props => props.$type === 'today' ? `
    background: #fff1f2;
    color: #e11d48;
  ` : `
    background: #eff6ff;
    color: #2563eb;
  `}
`;

// [꾸밈] 왼쪽 테두리 포인트 추가 + 배경색 미세 조정
const DateHighlight = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;

  /* 왼쪽 포인트 컬러 라인 */
  border-left: 4px solid #3b82f6;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const DateText = styled.div`
  font-size: 1.05rem;
  font-weight: 800;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 8px;

  /* 날짜 아이콘 색상 포인트 */
  svg { color: #3b82f6; }
`;

const TimeText = styled.div`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid #f1f5f9;

  svg { color: #94a3b8; }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 0; height: 0; }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  /* [꾸밈] 아이콘 박스를 브랜드 컬러(블루) 틴트로 변경 */
  .icon-box {
    width: 36px; /* 아이콘 박스 살짝 키움 */
    height: 36px;
    border-radius: 10px; /* 더 둥글게 */

    /* 블루 계열의 아주 연한 배경 */
    background: #eff6ff;

    display: flex;
    align-items: center;
    justify-content: center;

    /* 아이콘 색상을 진한 블루로 */
    color: #3b82f6;

    flex-shrink: 0;
    transition: background 0.2s;
  }

  &:hover .icon-box {
    background: #dbeafe; /* 호버 시 조금 더 진하게 */
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    overflow: hidden;

    span {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }
    strong {
      font-size: 0.95rem;
      font-weight: 700;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 0.9rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px dashed #e5e7eb; /* 빈 상태 점선 테두리 */
`;


type Props = {
  events: InstructorEventItem[];
};

export default function NextLectureWidget({ events }: Props) {
  const now = new Date();

  const confirmed = events
    .filter((e) => e.instructorStatus === 'CONFIRMED')
    .map((e) => ({ event: e, start: new Date(e.start), end: new Date(e.end) }))
    .filter(({ start }) => start.getTime() >= now.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (confirmed.length === 0) {
    return (
      <Panel>
        <Header>
          <TitleArea>
             {/* 서브텍스트 제거됨 */}
            <h3>다음 강의</h3>
          </TitleArea>
        </Header>
        <EmptyState>
          <CalendarIcon /> {/* 빈 상태 아이콘 추가 */}
          <span>예정된 확정 강의가 없습니다.</span>
        </EmptyState>
      </Panel>
    );
  }

  const main = confirmed[0];
  const start = main.start;
  const end = main.end;

  const oneDayMs = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil(
    (start.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) / oneDayMs,
  );

  const isToday = diffDays === 0;
  const ddayText = diffDays > 0 ? `D-${diffDays}` : isToday ? 'D-DAY' : `D+${-diffDays}`;
  const badgeType = isToday ? 'today' : 'future';

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const datePretty = `${start.getMonth() + 1}/${start.getDate()}(${weekdays[start.getDay()]})`;
  const timeText = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}~${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

  const mainInstructor = main.event.instructors[0];

  return (
    <Panel>
      <Header>
        <TitleArea>
          <h3>다음 강의</h3>
        </TitleArea>
        <DdayBadge $type={badgeType}>{ddayText}</DdayBadge>
      </Header>

      <DateHighlight>
        <DateText>
           <CalendarIcon />
           {datePretty}
        </DateText>
        <TimeText>
           <ClockIcon />
           {timeText}
        </TimeText>
      </DateHighlight>

      <InfoList>
        <InfoItem>
          <div className="icon-box"><BookIcon /></div>
          <div className="content">
            <span>강의명</span>
            <strong>{main.event.title}</strong>
          </div>
        </InfoItem>

        <InfoItem>
          <div className="icon-box"><MapPinIcon /></div>
          <div className="content">
            <span>장소</span>
            <strong>{main.event.location || '-'}</strong>
          </div>
        </InfoItem>

        <InfoItem>
          <div className="icon-box"><UserIcon /></div>
          <div className="content">
            <span>담당자</span>
            <strong>
              {mainInstructor ? mainInstructor.name : '-'}
            </strong>
          </div>
        </InfoItem>
      </InfoList>
    </Panel>
  );
}