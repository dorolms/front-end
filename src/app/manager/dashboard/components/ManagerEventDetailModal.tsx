'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { keyframes } from 'styled-components';
import type { ManagerEventItem } from '../types';
import { MANAGER_THEME, MANAGER_BORDER } from '../constants'; // [중요] 색상 상수 불러오기

// --- Icons ---
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);
const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);
const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; } to { opacity: 1; }
`;
const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---
const Backdrop = styled.div`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalBox = styled.div`
  background: #fff; border-radius: 20px; width: 500px; max-width: 90vw;
  max-height: 90vh; overflow-y: auto; padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  display: flex; flex-direction: column; gap: 24px;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 3px; }
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
`;

const TitleArea = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  h2 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #111; line-height: 1.3; }
`;

const Badges = styled.div` display: flex; gap: 6px; flex-wrap: wrap; `;

// Badge 컴포넌트: 색상($bg, $color)을 직접 받도록 변경
const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block; padding: 4px 10px; border-radius: 6px;
  font-size: 0.75rem; font-weight: 700;
  background-color: ${props => props.$bg};
  color: ${props => props.$color};
`;

const CloseBtn = styled.button`
  background: #f3f4f6; border: none; border-radius: 50%; width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center; cursor: pointer; color: #666;
  transition: all 0.2s; &:hover { background: #e5e7eb; color: #111; }
`;

const TimeBadge = styled.div`
  display: flex; align-items: center; gap: 6px; background: #f9fafb; padding: 10px 14px;
  border-radius: 10px; border: 1px solid #e5e7eb; color: #374151; font-weight: 600; font-size: 0.95rem;
  svg { color: #9ca3af; }
`;

const ScheduleList = styled.div`
  display: flex; flex-direction: column; gap: 8px;
`;
const ScheduleItem = styled(TimeBadge)`
  padding: 8px 12px; font-size: 0.9rem;
`;

const Section = styled.div` display: flex; flex-direction: column; gap: 8px; `;

const SectionLabel = styled.div`
  display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 700;
  color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;
  svg { color: #cbd5e1; }
`;

const ContentBox = styled.div`
  background: #fff; border: 1px solid #f1f5f9; padding: 14px; border-radius: 12px;
  font-size: 0.95rem; color: #334155; line-height: 1.5; white-space: pre-wrap;
`;

const LinkText = styled.a`
  color: #2563EB; text-decoration: underline; word-break: break-all;
  &:hover { color: #1d4ed8; }
`;

const InstructorList = styled.div` display: flex; flex-direction: column; gap: 8px; `;

// 강사 카드
const InstructorCard = styled.div<{ $role: 'MAIN' | 'ASSISTANT' }>`
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-radius: 10px;

  background: ${(props) => (props.$role === 'MAIN' ? '#eff6ff' : '#f8fafc')};
  border: 1px solid ${(props) => (props.$role === 'MAIN' ? '#dbeafe' : '#f1f5f9')};

  .left { display: flex; align-items: center; gap: 12px; }
  .avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: ${(props) => (props.$role === 'MAIN' ? '#3b82f6' : '#cbd5e1')};
    color: #fff; display: flex; align-items: center; justify-content: center;
    font-size: 0.8rem; font-weight: 700;
  }
  .info {
    display: flex; flex-direction: column;
    .name {
      font-weight: 700; font-size: 0.95rem;
      color: ${(props) => (props.$role === 'MAIN' ? '#1e293b' : '#475569')};
    }
    .role {
      font-size: 0.75rem; font-weight: 600;
      color: ${(props) => (props.$role === 'MAIN' ? '#3b82f6' : '#94a3b8')};
    }
  }
  .phone { font-size: 0.85rem; color: #64748b; font-weight: 500; }
`;

type Props = {
  event: ManagerEventItem;
  onClose: () => void;
};

// 한글 매핑
const CATEGORY_MAP: Record<string, string> = {
  GENERAL: '일반', COMPETITION: '대회', CAMP: '캠프', DOROLAND: '도로랜드', BOOTH: '부스', ETC: '기타'
};
const LECTURE_STATUS_MAP: Record<string, string> = {
  RECRUITING: '모집중', ALLOCATING: '배정중', COMPLETED: '베정완료'
};

export default function ManagerEventDetailModal({ event, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  if (!mounted) return null;

  // 1. 카테고리 뱃지 설정 (색상 적용)
  const categoryKo = CATEGORY_MAP[event.category] || event.category || '강의';
  // [수정] constants.ts에 있는 테마(배경)와 보더(텍스트) 색상 가져오기
  // @ts-ignore
  const catBg = MANAGER_THEME[event.category] || MANAGER_THEME.ETC;
  // @ts-ignore
  const catColor = MANAGER_BORDER[event.category] || MANAGER_BORDER.ETC;

  // 2. 상태 뱃지 설정
  const statusKo = LECTURE_STATUS_MAP[event.status] || event.status;
  let statusBg = '#eff6ff'; // default blue
  let statusColor = '#3b82f6';

  if (event.status === 'ALLOCATING') {
    statusBg = '#FEF3C7'; statusColor = '#92400E'; // orange
  }
  if (event.status === 'COMPLETED' || event.status === 'CONFIRMED') {
    statusBg = '#f3f4f6'; statusColor = '#4b5563'; // gray
  }

  // 3. 강사 분류
  const mainInstructors = event.instructors.filter(i => i.role === 'MAIN');
  const assistInstructors = event.instructors.filter(i => i.role === 'ASSISTANT');

  // 날짜 포맷
  const formatTimeRange = (date: string, start: string, end: string) => {
    const d = new Date(date);
    const dateStr = `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    return `${dateStr} | ${start.substring(0, 5)} ~ ${end.substring(0, 5)}`;
  };

  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>

        {/* 헤더 */}
        <Header>
          <TitleArea>
            <Badges>
              {/* 카테고리 뱃지: 요청하신 색상(노랑, 파랑 등) 적용 */}
              <Badge $bg={catBg} $color={catColor}>{categoryKo}</Badge>
              {/* 상태 뱃지: 상태별 색상 적용 */}
              <Badge $bg={statusBg} $color={statusColor}>{statusKo}</Badge>
            </Badges>
            <h2>{event.title}</h2>
          </TitleArea>
          <CloseBtn onClick={onClose}><CloseIcon /></CloseBtn>
        </Header>

        {/* 일정 */}
        <Section>
          <SectionLabel><ClockIcon /> 강의 일정</SectionLabel>
          {event.schedules && event.schedules.length > 0 ? (
            <ScheduleList>
              {event.schedules.map((sch) => (
                <ScheduleItem key={sch.id}>
                  {formatTimeRange(sch.date, sch.start_time, sch.end_time)}
                </ScheduleItem>
              ))}
            </ScheduleList>
          ) : (
            <TimeBadge>
              {new Date(event.start).toLocaleDateString()} &nbsp;|&nbsp;
              {event.start.split('T')[1].substring(0,5)} ~ {event.end.split('T')[1].substring(0,5)}
            </TimeBadge>
          )}
        </Section>

        {/* 장소 & 대상/정원 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Section>
            <SectionLabel><MapPinIcon /> 강의 장소</SectionLabel>
            <ContentBox>{event.location || '장소 미정'}</ContentBox>
          </Section>
          <Section>
            <SectionLabel><UsersIcon /> 대상 / 정원</SectionLabel>
            <ContentBox>{event.target || '-'} / {event.capacity || '-'}</ContentBox>
          </Section>
        </div>

        {/* 강사료 */}
        <Section>
          <SectionLabel><DollarIcon /> 강사료 </SectionLabel>
          <ContentBox style={{ fontWeight: 700 }}>
            {event.fee || '-'}
          </ContentBox>
        </Section>

        {/* 강의 내용 */}
        <Section>
          <SectionLabel><FileTextIcon /> 강의 내용</SectionLabel>
          <ContentBox>{event.content || '-'}</ContentBox>
        </Section>

        {/* 특이 사항 */}
        {event.note && (
          <Section>
            <SectionLabel><FileTextIcon /> 특이 사항</SectionLabel>
            <ContentBox>{event.note}</ContentBox>
          </Section>
        )}

        {/* 첨부 파일 */}
        {event.attachment_url && (
          <Section>
            <SectionLabel><LinkIcon /> 첨부 파일</SectionLabel>
            <ContentBox>
              <LinkText href={event.attachment_url} target="_blank">{event.attachment_url}</LinkText>
            </ContentBox>
          </Section>
        )}

        {/* 배정된 강사 목록 */}
        <Section>
          <SectionLabel><UsersIcon /> 배정된 강사 ({event.instructors.length}명)</SectionLabel>
          <InstructorList>
            {/* 주강사 */}
            {mainInstructors.map((main, idx) => (
              <InstructorCard key={`main-${idx}`} $role="MAIN">
                <div className="left">
                  <div className="avatar">{main.name.slice(0, 1)}</div>
                  <div className="info">
                    <span className="name">{main.name} 강사님</span>
                    <span className="role">주 도로쌤</span>
                  </div>
                </div>
                <div className="phone">{main.phone}</div>
              </InstructorCard>
            ))}

            {/* 보조강사 */}
            {assistInstructors.map((assist, index) => (
              <InstructorCard key={`sub-${index}`} $role="ASSISTANT">
                <div className="left">
                  <div className="avatar">{assist.name.slice(0, 1)}</div>
                  <div className="info">
                    <span className="name">{assist.name} 강사님</span>
                    <span className="role">보조 도로쌤</span>
                  </div>
                </div>
                <div className="phone">{assist.phone}</div>
              </InstructorCard>
            ))}

            {mainInstructors.length === 0 && assistInstructors.length === 0 && (
               <ContentBox style={{ textAlign: 'center', color: '#999' }}>아직 배정된 강사가 없습니다.</ContentBox>
            )}
          </InstructorList>
        </Section>

      </ModalBox>
    </Backdrop>,
    document.body
  );
}