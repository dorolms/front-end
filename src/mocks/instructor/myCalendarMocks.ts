// src/mocks/instructor/myCalendarMocks.ts

// 타입을 따로 파일로 안 빼는 버전
export type LectureStatus = "recruiting" | "allocating" | "completed";
export type MyLectureStatus = "APPLIED" | "PENDING" | "CONFIRMED" | null;

export interface InstructorMyCalendarLecture {
  lectureId: number;
  date: string; // "2023-11-21"
  startTime: string; // "09:00"
  endTime: string; // "11:00"
  title: string;
  location: string;
  type: string;
  status: LectureStatus;
  myStatus: MyLectureStatus;
}

export const INSTRUCTOR_MY_CALENDAR_EVENTS: InstructorMyCalendarLecture[] = [
  {
    lectureId: 1,
    date: "2025-11-21",
    startTime: "09:00",
    endTime: "11:00",
    title: "데이터베이스 - 운영역 예약가",
    location: "한양초 3-1",
    type: "general",
    status: "completed",
    myStatus: "CONFIRMED",
  },
  {
    lectureId: 2,
    date: "2025-11-11",
    startTime: "14:00",
    endTime: "16:00",
    title: "파이썬 코딩 캠프",
    location: "도성중 2층 컴실",
    type: "camp",
    status: "allocating",
    myStatus: "PENDING",
  },
  {
    lectureId: 3,
    date: "2025-11-26",
    startTime: "10:00",
    endTime: "12:00",
    title: "토로랜드 체험 부스 운영",
    location: "고양 킨텍스",
    type: "booth",
    status: "recruiting",
    myStatus: "APPLIED",
  },
  {
    lectureId: 4,
    date: "2025-11-03",
    startTime: "13:00",
    endTime: "15:00",
    title: "로봇 기초 수업",
    location: "분당초 1층 과학실",
    type: "general",
    status: "completed",
    myStatus: "CONFIRMED",
  },
  {
    lectureId: 5,
    date: "2025-11-03",
    startTime: "16:00",
    endTime: "18:00",
    title: "레고 로봇 미니 대회",
    location: "성남문화센터",
    type: "competition",
    status: "allocating",
    myStatus: "PENDING",
  },
  {
    lectureId: 6,
    date: "2025-11-04",
    startTime: "09:00",
    endTime: "11:00",
    title: "초등 코딩 원데이 클래스",
    location: "광교초 2-4",
    type: "general",
    status: "recruiting",
    myStatus: "APPLIED",
  },
  {
    lectureId: 7,
    date: "2025-11-05",
    startTime: "11:00",
    endTime: "13:00",
    title: "중등 AI 기초반",
    location: "용인중 3층 컴실",
    type: "camp",
    status: "completed",
    myStatus: "CONFIRMED",
  },
  {
    lectureId: 8,
    date: "2025-11-06",
    startTime: "15:00",
    endTime: "17:00",
    title: "창의 로봇 만들기",
    location: "판교초 1층 강당",
    type: "totoland",
    status: "allocating",
    myStatus: "PENDING",
  },
  {
    lectureId: 9,
    date: "2025-11-07",
    startTime: "09:00",
    endTime: "12:00",
    title: "메이커스페이스 체험",
    location: "과천 메이커랩",
    type: "etc",
    status: "recruiting",
    myStatus: "APPLIED",
  },
];
