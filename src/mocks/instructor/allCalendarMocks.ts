// src/mocks/instructor/allCalendarMocks.ts

export type LectureStatus = "recruiting" | "allocating" | "completed";

export interface InstructorAllCalendarLecture {
  lectureId: number;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  location: string;
  type: string; // general / camp / booth / ...
  status: LectureStatus; // 모집중 / 배정중 / 완료
}

export const INSTRUCTOR_ALL_CALENDAR_EVENTS: InstructorAllCalendarLecture[] = [
  {
    lectureId: 10,
    date: "2023-07-05",
    startTime: "09:00",
    endTime: "11:00",
    title: "[초등] 로봇 기초 교육",
    location: "남양초 1층 과학실",
    type: "general",
    status: "recruiting",
  },
  {
    lectureId: 11,
    date: "2023-07-11",
    startTime: "13:00",
    endTime: "15:00",
    title: "[중등] 코딩 대회 대비 특강",
    location: "성남 OO중",
    type: "competition",
    status: "allocating",
  },
  {
    lectureId: 12,
    date: "2023-07-21",
    startTime: "14:00",
    endTime: "16:00",
    title: "[고등] AI 기초 캠프",
    location: "경기고 2층 세미나실",
    type: "camp",
    status: "completed",
  },
];
