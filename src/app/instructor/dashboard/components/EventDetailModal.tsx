'use client';
/**
 * EventDetailModal.tsx
 * - 주간 캘린더에서 이벤트 클릭 시 뜨는 상세 정보 모달
 * - 제목 / 날짜 / 시간 / 장소 / 콘텐츠 / 담당자 표시
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import type { EventItem } from '../types';

const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 25000;
`;

const Box = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  min-width: 420px;
  max-width: 520px;
  padding: 18px 20px 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const Title = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  flex: 1;
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
`;

const Meta = styled.div`
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  font-size: 0.9rem;
  margin-bottom: 4px;
`;

const Label = styled.div`
  width: 70px;
  color: #666;
`;

const Value = styled.div`
  flex: 1;
  color: #111;
  white-space: pre-line;
`;

type Props = {
  event: EventItem;
  onClose: () => void;
};

function formatDateTime(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][s.getDay()];

  const timeRange = `${pad(s.getHours())}:${pad(s.getMinutes())}~${pad(
    e.getHours()
  )}:${pad(e.getMinutes())}`;
  return {
    dateStr: `${s.getMonth() + 1}월 ${s.getDate()}일 (${weekday})`,
    timeStr: timeRange,
  };
}

export default function EventDetailModal({ event, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [el] = useState(() => {
    const div = document.createElement('div');
    div.id = 'dashboard-event-modal-root';
    return div;
  });

  useEffect(() => {
    document.body.appendChild(el);
    setMounted(true);
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.removeChild(el);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [el, onClose]);

  if (!mounted) return null;

  const { dateStr, timeStr } = formatDateTime(event.start, event.end);

  return createPortal(
    <Bg onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{event.title}</Title>
          <CloseBtn aria-label="닫기" onClick={onClose}>
            ×
          </CloseBtn>
        </Header>
        <Meta>
          {dateStr} · {timeStr}
        </Meta>
        <Row>
          <Label>장소</Label>
          <Value>{event.location ?? '-'}</Value>
        </Row>
        <Row>
          <Label>콘텐츠</Label>
          <Value>{event.content ?? '-'}</Value>
        </Row>
        <Row>
          <Label>담당자</Label>
          <Value>{event.manager ?? '-'}</Value>
        </Row>
      </Box>
    </Bg>,
    el
  );
}
