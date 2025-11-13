/**
 * 대시보드 전용 훅
 * - confirmedOnly: 대시보드 캘린더에는 CONFIRMED만
 * - getNextConfirmed: 오늘 기준, 가장 임박한 확정 강의 1건
 * - 주간 범위는 FullCalendar가 timeGridWeek로 알아서 계산 (주 시작/끝은 locale/옵션으로 제어 가능)
 */

import { useMemo } from 'react';
import type { EventItem } from '../types';

export function useDashboard(events: EventItem[]) {
  const confirmed = useMemo(
    () => events.filter(e => e.status === 'CONFIRMED'),
    [events]
  );

  const nextConfirmed = useMemo(() => {
    const now = new Date().getTime();
    // 오늘 이후 시작하는 확정 강의 중 가장 빠른 것
    const upcoming = confirmed
      .filter(e => new Date(e.start).getTime() >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    return upcoming[0] ?? null;
  }, [confirmed]);

  return { confirmed, nextConfirmed };
}

/** D-Day 계산 (floor day diff) */
export function diffDays(fromISO: string, base = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const from = new Date(fromISO);
  // 시간 영향 줄이기 위해 로컬 자정 기준으로 보정
  const fromDay = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const baseDay = new Date(base.getFullYear(), base.getMonth(), base.getDate()).getTime();
  return Math.ceil((fromDay - baseDay) / msPerDay);
}
