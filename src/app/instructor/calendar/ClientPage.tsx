'use client';
import { useState, useEffect } from 'react';
import {
  Wrap,
  CalendarBox,
} from './styles';
import InstructorMonthlyCalendar from './components/InstructorMonthlyCalendar';
import InstructorEventDetailModal from './components/InstructorEventDetailModal';
import * as API from './api';
import type { InstructorEventItem } from './types';

export default function InstructorClientPage() {
  const [selectedEvent, setSelectedEvent] = useState<InstructorEventItem | null>(null);
  const [events, setEvents] = useState<InstructorEventItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const eventsData = await API.fetchMyLectures();
        setEvents(eventsData);
      } catch (error) {
        console.error('데이터 로딩 실패', error);
      }
    };
    load();
  }, []);

  const handleEventClick = async (event: InstructorEventItem) => {
    // 1. 모달 즉시 열기
    setSelectedEvent(event);

    // 2. 상세 정보 가져오기
    const detail = await API.fetchLectureDetail(event.id);
    
    // 3. 상세 정보가 있으면 병합
    if (detail) {
      setSelectedEvent((prev) => {
        if (!prev || prev.id !== event.id) return prev;
        
        // 타입 안전하게 병합
        return {
          ...prev,
          title: detail.title || prev.title,
          content: detail.content || prev.content,
          location: detail.location || prev.location,
          target: detail.target,
          capacity: detail.capacity,
          fee: detail.fee,
          note: detail.note,
          attachment_url: detail.attachment_url,
          schedules: detail.schedules || prev.schedules,
          instructors: detail.instructors || prev.instructors,
        } as InstructorEventItem; // ✅ 타입 단언 추가
      });
    }
  };

  return (
    <Wrap>
      <CalendarBox>
        <InstructorMonthlyCalendar
          events={events}
          onEventClick={handleEventClick}
        />
      </CalendarBox>
      
      {selectedEvent && (
        <InstructorEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </Wrap>
  );
}