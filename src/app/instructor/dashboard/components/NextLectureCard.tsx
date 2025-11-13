'use client';
import styled from 'styled-components';
import type { EventItem } from '../types';
import { diffDays } from '../hooks/useDashboard';

const Card = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/** 상단: 왼쪽 회색 영역 + 오른쪽 D-day */
const TopRow = styled.div`
  display: flex;
  height: 64px;
`;

const LeftBanner = styled.div`
  width: 108px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e5e5e5;
  font-size: 0.95rem;
  font-weight: 600;
  gap: 6px;
`;

const BannerIcon = styled.span`
  font-size: 1.1rem;
`;

const RightTop = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
  font-size: 1.4rem;
  font-weight: 800;
  color: #d90429; /* 빨간 D-6 */
`;

/** 아래 정보 박스 */
const InfoBox = styled.div`
  flex: 1;
  padding: 16px 24px 20px 24px;
  background: #fafafa;
  display: grid;
  grid-template-columns: 120px 1fr;
  row-gap: 10px;
  column-gap: 16px;
  font-size: 0.9rem;
`;

const Label = styled.div`
  background: #f1f1f1;
  border-radius: 4px;
  padding: 8px 10px;
  font-weight: 600;
  color: #444;
`;

const Value = styled.div`
  padding: 8px 4px;
  color: #111;
  white-space: pre-line;
`;

type Props = {
  event: EventItem | null;
};

function formatKoreanDateRange(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][s.getDay()];
  const range = `${pad(s.getHours())}:${pad(s.getMinutes())}~${pad(
    e.getHours()
  )}:${pad(e.getMinutes())}`;
  return `${s.getFullYear().toString().slice(2)}/${pad(
    s.getMonth() + 1
  )}/${pad(s.getDate())}(${weekday}) ${range}`;
}

export default function NextLectureCard({ event }: Props) {
  if (!event) {
    return (
      <Card>
        <TopRow>
          <LeftBanner>
            <BannerIcon>📅</BannerIcon>
            <span>다음 강의</span>
          </LeftBanner>
          <RightTop>—</RightTop>
        </TopRow>
        <InfoBox>
          <Label>강의 일정</Label>
          <Value>예정된 확정 강의가 없습니다.</Value>
          <Label>강의명</Label>
          <Value>—</Value>
          <Label>콘텐츠</Label>
          <Value>—</Value>
          <Label>강의 장소</Label>
          <Value>—</Value>
          <Label>담당자</Label>
          <Value>—</Value>
        </InfoBox>
      </Card>
    );
  }

  const d = diffDays(event.start);
  const dStr = d > 0 ? `D-${d}` : d === 0 ? 'D-DAY' : `D+${Math.abs(d)}`;

  return (
    <Card>
      <TopRow>
        <LeftBanner>
          <BannerIcon>📅</BannerIcon>
          <span>다음 강의</span>
        </LeftBanner>
        <RightTop>{dStr}</RightTop>
      </TopRow>
      <InfoBox>
        <Label>강의 일정</Label>
        <Value>{formatKoreanDateRange(event.start, event.end)}</Value>

        <Label>강의명</Label>
        <Value>{event.title}</Value>

        <Label>콘텐츠</Label>
        <Value>{event.content ?? '—'}</Value>

        <Label>강의 장소</Label>
        <Value>{event.location ?? '—'}</Value>

        <Label>담당자</Label>
        <Value>{event.manager ?? '—'}</Value>
      </InfoBox>
    </Card>
  );
}
