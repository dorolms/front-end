// src/app/instructor/dashboard/components/NextLectureWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { InstructorEventItem } from '../types';
import { fetchLectureDetail } from '../api';

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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f3f5;
  box-sizing: border-box;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  position: relative;

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
  margin-top: 4px;
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

const DateHighlight = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
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

  .icon-box {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #eff6ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #3b82f6;
    flex-shrink: 0;
    transition: background 0.2s;
  }

  &:hover .icon-box {
    background: #dbeafe;
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
  border: 1px dashed #e5e7eb;
`;

type Props = {
  events: InstructorEventItem[];
};

export default function NextLectureWidget({ events }: Props) {
  // [수정 3] 담당자 이름을 저장할 state 추가
  const [managerName, setManagerName] = useState<string>('-');
  const now = new Date();

  // 기존 로직: 가장 빠른 확정 강의 찾기
  const confirmed = events
    .filter((e) => e.instructorStatus === 'CONFIRMED')
    .map((e) => ({ event: e, start: new Date(e.start), end: new Date(e.end) }))
    .filter(({ start }) => start.getTime() >= now.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  // 강의가 없을 때 early return 처리 (Hook 호출 규칙을 지키기 위해 조건부 렌더링 위치 조정 필요하나,
  // 여기서는 간단히 null 체크로 해결하거나, useEffect 내부에서 처리해야 함)
  const main = confirmed.length > 0 ? confirmed[0] : null;

  // main 강의가 바뀔 때마다 상세 정보를 조회하여 담당자 업데이트
  useEffect(() => {
    if (!main) {
      setManagerName('-');
      return;
    }

    const loadManagerInfo = async () => {
      try {
        // 이미 데이터가 있다면(혹시 나중에 캐싱된다면) 사용하고, 없다면 API 호출
        // 현재 구조상 무조건 API 호출 필요
        const detail = await fetchLectureDetail(main.event.id);
        if (detail && detail.instructors) {
          // 역할이 MANAGER인 사람 찾기
          const manager = detail.instructors.find((i: any) => i.role === 'MANAGER');
          setManagerName(manager ? manager.name : '-');
        } else {
          setManagerName('-');
        }
      } catch (e) {
        setManagerName('-');
      }
    };

    loadManagerInfo();
  }, [main?.event.id]); // event ID가 바뀔 때만 실행

  // 강의가 없을 경우 렌더링
  if (!main) {
    return (
      <Panel>
        <Header>
          <TitleArea>
            <h3>다음 강의</h3>
          </TitleArea>
        </Header>
        <EmptyState>
          <CalendarIcon />
          <span>예정된 확정 강의가 없습니다.</span>
        </EmptyState>
      </Panel>
    );
  }

  const start = main.start;
  const end = main.end;

  const oneDayMs = 1000 * 60 * 60 * 24;
  const ddayTarget = new Date(start);
  ddayTarget.setHours(0, 0, 0, 0);
  const ddayNow = new Date(now);
  ddayNow.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((ddayTarget.getTime() - ddayNow.getTime()) / oneDayMs);
  const isToday = diffDays === 0;
  const ddayText = diffDays > 0 ? `D-${diffDays}` : isToday ? 'D-DAY' : `D+${-diffDays}`;
  const badgeType = isToday ? 'today' : 'future';

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const datePretty = `${start.getMonth() + 1}/${start.getDate()}(${weekdays[start.getDay()]})`;
  const timeText = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}~${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

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
            <strong>{managerName}</strong>
          </div>
        </InfoItem>
      </InfoList>
    </Panel>
  );
}