// src/app/manager/dashboard/data/managerMock.ts
import type { ManagerEventItem, RecruitmentItem } from '../types';

// --- 1. 캘린더용 강의 데이터 (2025년 11월 24일 주간 중심) ---
export const mockManagerEvents: ManagerEventItem[] = [
  // 월요일 (11.24)
  {
    id: 'm1',
    title: '안산초 코딩 교실 [3-1반]',
    start: '2025-11-24T09:00:00',
    end: '2025-11-24T12:00:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: '안산초등학교 컴퓨터실',
    content: '엔트리를 활용한 순차 구조 익히기 및 미로 찾기 게임 만들기',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '박보조', phone: '010-1111-2222', role: 'ASSISTANT' },
    ],
  },
  {
    id: 'm2',
    title: '스마트팜 센서 실습',
    start: '2025-11-24T13:00:00',
    end: '2025-11-24T15:00:00',
    category: 'ETC',
    status: 'CONFIRMED',
    location: '한양대 ERICA 메이커스페이스',
    content: '아두이노 온습도 센서를 활용한 스마트팜 데이터 모니터링',
    instructors: [
      { name: '최기술', phone: '010-5555-4444', role: 'MAIN' },
    ],
  },


  // 화요일 (11.25)
  {
    id: 'm3',
    title: '도로랜드 AI 캠프 [오전]',
    start: '2025-11-25T09:00:00',
    end: '2025-11-25T12:00:00',
    category: 'DOROLAND', // 파랑 (흰 글씨)
    status: 'CONFIRMED',
    location: '도로랜드 제1관',
    content: '도로랜드 캐릭터와 함께하는 인공지능 학습 놀이',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김서폿', phone: '010-1212-3434', role: 'ASSISTANT' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
  },
  {
    id: 'm4',
    title: '도로랜드 AI 캠프 [오후]',
    start: '2025-11-25T13:30:00',
    end: '2025-11-25T16:30:00',
    category: 'DOROLAND',
    status: 'CONFIRMED',
    location: '도로랜드 제1관',
    content: '자율주행 자동차 키트 조립 및 주행 테스트',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김서폿', phone: '010-1212-3434', role: 'ASSISTANT' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
  },
  {
    id: 'm10',
    title: '도로랜드 AI 캠프 [오후]',
    start: '2025-11-25T17:00:00',
    end: '2025-11-25T18:30:00',
    category: 'DOROLAND',
    status: 'CONFIRMED',
    location: '도로랜드 제1관',
    content: '자율주행 자동차 키트 조립 및 주행 테스트',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김서폿', phone: '010-1212-3434', role: 'ASSISTANT' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
  },
  {
    id: 'm11',
    title: '도로랜드 AI 캠프 [오후]',
    start: '2025-11-25T19:00:00',
    end: '2025-11-25T20:30:00',
    category: 'DOROLAND',
    status: 'CONFIRMED',
    location: '도로랜드 제1관',
    content: '자율주행 자동차 키트 조립 및 주행 테스트',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김서폿', phone: '010-1212-3434', role: 'ASSISTANT' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
  },

  // 수요일 (11.26)
  {
    id: 'm5',
    title: '청소년 과학 대제전 부스',
    start: '2025-11-26T09:00:00',
    end: '2025-11-26T17:00:00',
    category: 'BOOTH', // 핑크
    status: 'CONFIRMED',
    location: '상록수 체육관',
    content: 'VR/AR 체험 부스 운영 및 안전 관리',
    instructors: [
      { name: '박체험', phone: '010-7777-1111', role: 'MAIN' },
      { name: '정스태프', phone: '010-2222-3333', role: 'ASSISTANT' },
      { name: '강가이드', phone: '010-4444-5555', role: 'ASSISTANT' },
      { name: '윤안전', phone: '010-6666-7777', role: 'ASSISTANT' },
    ],
  },

  // 목요일 (11.27)
  {
    id: 'm6',
    title: 'SW 마이스터고 멘토링',
    start: '2025-11-27T16:00:00',
    end: '2025-11-27T19:00:00',
    category: 'CAMP', // 연두
    status: 'CONFIRMED',
    location: '경기모바일과학고등학교',
    content: '현직 개발자와 함께하는 진로 멘토링 및 프로젝트 피드백',
    instructors: [
      { name: '한멘토', phone: '010-8888-0000', role: 'MAIN' },
    ],
  },

  // 금요일 (11.28)
  {
    id: 'm7',
    title: '코딩 드론 제어 입문',
    start: '2025-11-28T10:00:00',
    end: '2025-11-28T12:00:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: '송호중학교 강당',
    content: '드론의 비행 원리 이해 및 코딩을 통한 이착륙 제어',
    instructors: [
      { name: '김드론', phone: '010-1234-1234', role: 'MAIN' },
      { name: '최비행', phone: '010-4321-4321', role: 'ASSISTANT' },
    ],
  },
  {
    id: 'm8',
    title: '메이커스페이스 장비 교육',
    start: '2025-11-28T14:00:00',
    end: '2025-11-28T16:00:00',
    category: 'ETC',
    status: 'CONFIRMED',
    location: '한양대 ERICA 창업보육센터',
    content: '3D 프린터 및 레이저 커팅기 안전 교육 및 기초 사용법',
    instructors: [
      { name: '박메이커', phone: '010-9876-5432', role: 'MAIN' },
    ],
  },

  // 토요일 (11.29)
  {
    id: 'm9',
    title: '전국 코딩 대회 예선 감독',
    start: '2025-11-29T09:00:00',
    end: '2025-11-29T13:00:00',
    category: 'COMPETITION', // 하늘
    status: 'CONFIRMED',
    location: '온라인 (Zoom 감독)',
    content: '제 5회 전국 청소년 알고리즘 대회 온라인 예선 감독관',
    instructors: [
      { name: '정감독', phone: '010-1111-9999', role: 'MAIN' },
      { name: '이부감독', phone: '010-2222-8888', role: 'ASSISTANT' },
    ],
  },
  {
    id: 'm12',
    title: '전국 코딩 대회 예선 감독',
    start: '2025-11-19T09:00:00',
    end: '2025-11-19T13:00:00',
    category: 'COMPETITION', // 하늘
    status: 'CONFIRMED',
    location: '온라인 (Zoom 감독)',
    content: '제 5회 전국 청소년 알고리즘 대회 온라인 예선 감독관',
    instructors: [
      { name: '정감독', phone: '010-1111-9999', role: 'MAIN' },
      { name: '이부감독', phone: '010-2222-8888', role: 'ASSISTANT' },
    ],
  },
];

// --- 2. 우측 하단 위젯용 모집 현황 데이터 ---
export const mockRecruitments: RecruitmentItem[] = [
  {
    id: 1,
    title: '겨울방학 SW 캠프 (용인)',
    date: '12.15(월)',
    status: 'RECRUITING',
    currentCount: 15, // 지원자 15명
    targetCount: 4    // 모집 인원 4명
  },
  {
    id: 2,
    title: '찾아가는 과학교실 - 시흥',
    date: '12.18(목)',
    status: 'RECRUITING',
    currentCount: 2,  // 지원자 2명
    targetCount: 3    // 모집 인원 3명 (미달)
  },
  {
    id: 3,
    title: '인천 로봇 경진대회 심사',
    date: '12.20(토)',
    status: 'RECRUITING',
    currentCount: 8,
    targetCount: 2
  },
  {
    id: 4,
    title: '스마트팜 센서 실습 (추가)',
    date: '11.30(일)',
    status: 'ALLOCATING',
    currentCount: 1, // 1명 확인 완료
    targetCount: 2   // 총 2명 배정됨 (1명 미확인 상태)
  },
  {
    id: 5,
    title: '창의과학 페스티벌',
    date: '12.01(월)',
    status: 'ALLOCATING',
    currentCount: 5, // 5명 확인 완료
    targetCount: 5   // 총 5명 배정됨 (전원 확인 완료 - 초록색)
  },
  {
    id: 6,
    title: '학부모 코딩 특강',
    date: '12.05(금)',
    status: 'ALLOCATING',
    currentCount: 0, // 아무도 확인 안 함
    targetCount: 1
  },
];