// src/app/instructor/dashboard/components/InstructorEventDetailModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { InstructorEventItem } from '../types';

const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 480px;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
`;

const Meta = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  color: #888;
  margin-bottom: 2px;
`;

const ContentText = styled.div`
  font-size: 0.95rem;
  color: #333;
  line-height: 1.4;
  white-space: pre-wrap;
`;

const InstructorRow = styled.div`
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  .role {
    font-weight: 600;
    color: #444;
    min-width: 90px;
  }
  .info {
    color: #111;
  }
`;

type Props = {
  event: InstructorEventItem;
  onClose: () => void;
};

export default function InstructorEventDetailModal({ event, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const startDate = new Date(event.start);
  const dateStr = `${startDate.getFullYear()}.${startDate.getMonth() + 1}.${startDate.getDate()}`;
  const timeStr = `${startDate.getHours()}:${String(startDate.getMinutes()).padStart(
    2,
    '0',
  )} ~ ${new Date(event.end).getHours()}:${String(new Date(event.end).getMinutes()).padStart(
    2,
    '0',
  )}`;

  const mainInstructor = event.instructors.find((i) => i.role === 'MAIN');
  const assistInstructors = event.instructors.filter((i) => i.role === 'ASSISTANT');

  return createPortal(
    <Bg onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{event.title}</Title>
          <CloseBtn onClick={onClose}>&times;</CloseBtn>
        </Header>
        <Meta>
          {dateStr} · {timeStr}
        </Meta>

        <Section>
          <Label>장소</Label>
          <ContentText>{event.location || '미정'}</ContentText>
        </Section>

        <Section>
          <Label>콘텐츠</Label>
          <ContentText>{event.content || '내용 없음'}</ContentText>
        </Section>

        <Section>
          <Label>담당자 (강사)</Label>

          {mainInstructor ? (
            <InstructorRow>
              <span className="role">주 도로쌤</span>
              <span className="info">
                {mainInstructor.name} 강사님 · {mainInstructor.phone}
              </span>
            </InstructorRow>
          ) : (
            <InstructorRow>
              <span className="role">주 도로쌤</span>
              <span className="info">-</span>
            </InstructorRow>
          )}

          {assistInstructors.map((assist, index) => (
            <InstructorRow key={index}>
              <span className="role">보조 도로쌤 {index + 1}</span>
              <span className="info">
                {assist.name} 강사님 · {assist.phone}
              </span>
            </InstructorRow>
          ))}
        </Section>
      </Box>
    </Bg>,
    document.body,
  );
}
