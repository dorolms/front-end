// src/app/manager/dashboard/components/ManagerEventDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { ManagerEventItem } from '../types';

const Bg = styled.div`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3);
  display: flex; justify-content: center; align-items: center; z-index: 9999;
`;

const Box = styled.div`
  background: #fff; border-radius: 12px; width: 480px;
  padding: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  display: flex; flex-direction: column; gap: 16px;
`;

const Header = styled.div`
  display: flex; justify-content: space-between; align-items: flex-start;
`;

const Title = styled.h2`
  margin: 0; font-size: 1.25rem; font-weight: 700; color: #111;
`;

const CloseBtn = styled.button`
  background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #999;
`;

const Meta = styled.div`
  font-size: 0.9rem; color: #666; font-weight: 500;
`;

const Section = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;

const Label = styled.div`
  font-size: 0.85rem; font-weight: 700; color: #888; margin-bottom: 2px;
`;

const ContentText = styled.div`
  font-size: 0.95rem; color: #333; line-height: 1.4;
  white-space: pre-wrap; /* 줄바꿈 허용 */
`;

const InstructorRow = styled.div`
  font-size: 0.95rem; color: #333; margin-bottom: 4px;
  display: flex; align-items: center; gap: 6px;

  .role { font-weight: 600; color: #444; min-width: 90px; }
  .info { color: #111; }
`;

type Props = {
  event: ManagerEventItem;
  onClose: () => void;
};

export default function ManagerEventDetailModal({ event, onClose }: Props) {
  // 모달 포탈 처리를 위한 마운트 체크
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // 날짜/시간 포맷팅
  const startDate = new Date(event.start);
  const dateStr = `${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()}`;
  const timeStr = `${startDate.getHours()}:${String(startDate.getMinutes()).padStart(2, '0')} ~ ${new Date(event.end).getHours()}:${String(new Date(event.end).getMinutes()).padStart(2, '0')}`;

  // 강사 분류 (주강사, 보조강사)
  const mainInstructor = event.instructors.find(i => i.role === 'MAIN');
  const assistInstructors = event.instructors.filter(i => i.role === 'ASSISTANT');

  return createPortal(
    <Bg onClick={onClose}>
      <Box onClick={e => e.stopPropagation()}>
        <Header>
          <Title>{event.title}</Title>
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <Meta>{dateStr} · {timeStr}</Meta>

        {/* 1. 장소 */}
        <Section>
          <Label>장소</Label>
          <ContentText>{event.location || '미정'}</ContentText>
        </Section>

        {/* 2. 콘텐츠 */}
        <Section>
          <Label>콘텐츠</Label>
          <ContentText>{event.content || '내용 없음'}</ContentText>
        </Section>

        {/* 3. 담당자(강사) 리스트 - 핵심 수정 부분 */}
        <Section>
          <Label>담당자 (강사)</Label>

          {/* 주 도로쌤 (1명) */}
          {mainInstructor ? (
            <InstructorRow>
              <span className="role">주 도로쌤</span>
              <span className="info">{mainInstructor.name} 강사님 · {mainInstructor.phone}</span>
            </InstructorRow>
          ) : (
            <InstructorRow><span className="role">주 도로쌤</span><span className="info">-</span></InstructorRow>
          )}

          {/* 보조 도로쌤 (N명 자동 생성) */}
          {assistInstructors.length > 0 ? (
            assistInstructors.map((assist, index) => (
              <InstructorRow key={index}>
                <span className="role">보조 도로쌤 {index + 1}</span>
                <span className="info">{assist.name} 강사님 · {assist.phone}</span>
              </InstructorRow>
            ))
          ) : (
             // 보조 강사가 없을 때 표시 여부는 선택사항 (여기선 생략하거나 '없음' 표시)
             null
          )}
        </Section>
      </Box>
    </Bg>,
    document.body
  );
}