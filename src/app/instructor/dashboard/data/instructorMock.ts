// src/app/instructor/dashboard/data/instructorMock.ts
import type { InstructorEventItem } from '../types';

export const mockInstructorEvents: InstructorEventItem[] = [
  // --- 범위 밖(컨텍스트용) ---

  {
    id: 'L-251111-DB-ERICA',
    title: '9:00 AM 데이터베이스 - 한양대 ERICA',
    start: '2025-11-11T09:00:00',
    end: '2025-11-11T12:00:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: '한양대 ERICA 제1공학관 303호',
    content: '관계형 데이터베이스 기초 및 SQL 실습',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '박보조', phone: '010-1111-2222', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },

  // --- 11월 14일 (금) ---

  {
    id: 'L-251114-SCRATCH-CLUB-AM',
    title: '스크래치 코딩 클럽 - 초등 저학년',
    start: '2025-11-14T09:30:00',
    end: '2025-11-14T11:30:00',
    category: 'GENERAL',
    status: 'RECRUITING',
    location: '도롤랜드 교육센터 1층 실습실',
    content: '스크래치로 나만의 애니메이션과 미니 게임 만들기',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
    ],
    instructorStatus: 'APPLIED',
  },
  {
    id: 'L-251114-COMPETITION-PREP-PM',
    title: '지역 코딩 경진대회 대비 특강',
    start: '2025-11-14T13:30:00',
    end: '2025-11-14T16:30:00',
    category: 'COMPETITION',
    status: 'ALLOCATING',
    location: '안산시 청소년 정보센터 2실',
    content: '파이썬 기초 문법과 알고리즘 유형 정리 및 연습 문제 풀이',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '최기술', phone: '010-5555-4444', role: 'ASSISTANT' },
    ],
    instructorStatus: 'PENDING',
  },
  {
    id: 'L-251114-AI-PLAY-EVE',
    title: 'AI 체험 교실 - 이미지 인식 놀이',
    start: '2025-11-14T17:00:00',
    end: '2025-11-14T19:00:00',
    category: 'DOROLAND',
    status: 'RECRUITING',
    location: '도롤랜드 교육센터 2층',
    content: '카메라와 간단한 딥러닝 모델을 활용한 실시간 이미지 인식 체험',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'APPLIED', // 보조로 지원 완료
  },

  // --- 11월 15일 (토) ---

  {
    id: 'L-251115-SCHOOL-VISIT-AM',
    title: '학교로 찾아가는 SW 교실 - A중 2학년',
    start: '2025-11-15T09:00:00',
    end: '2025-11-15T12:00:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: 'A중학교 컴퓨터실',
    content: '엔트리로 배우는 피지컬 컴퓨팅 기초 및 LED 제어',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '박보조', phone: '010-1111-2222', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },
  {
    id: 'L-251115-PYTHON-BASIC-PM',
    title: '파이썬 기초 집합교육 (주말반)',
    start: '2025-11-15T13:30:00',
    end: '2025-11-15T17:30:00',
    category: 'GENERAL',
    status: 'RECRUITING',
    location: '도롤랜드 교육센터 3층',
    content: '변수, 조건문, 반복문, 리스트까지 파이썬 기초 문법 전체 훑기',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
    ],
    instructorStatus: 'APPLIED',
  },
  {
    id: 'L-251115-ONLINE-MENTOR-EVE',
    title: '온라인 진로 멘토링 - 개발자에게 물어봐',
    start: '2025-11-15T19:00:00',
    end: '2025-11-15T21:00:00',
    category: 'ETC',
    status: 'RECRUITING',
    location: '온라인 (Zoom)',
    content: 'SW·AI 분야 진로 Q&A 및 포트폴리오 피드백',
    instructors: [
      { name: '한멘토', phone: '010-8888-0000', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'APPLIED',
  },

  // --- 11월 16일 (일) ---

  {
    id: 'L-251116-AI-CAMP-ONE-DAY',
    title: '1일 AI 미니 캠프 - 초등 고학년',
    start: '2025-11-16T10:00:00',
    end: '2025-11-16T16:00:00',
    category: 'CAMP',
    status: 'ALLOCATING',
    location: '수원 청소년 수련관',
    content: '머신러닝 개념 소개 및 간단한 분류 모델 실습',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'PENDING',
  },
  {
    id: 'L-251116-ROBOT-WORKSHOP-AM',
    title: '로봇 코딩 체험 워크숍',
    start: '2025-11-16T09:30:00',
    end: '2025-11-16T12:30:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: '안양 과학관 로봇실',
    content: '라인트레이서 로봇 조립 및 센서 튜닝 실습',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '최비행', phone: '010-4321-4321', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },

  // --- 11월 17일 (월) ---

  {
    id: 'L-251117-HTML-CSS-AM',
    title: '나만의 첫 웹페이지 만들기 (HTML & CSS)',
    start: '2025-11-17T09:30:00',
    end: '2025-11-17T12:30:00',
    category: 'GENERAL',
    status: 'ALLOCATING',
    location: '도롤랜드 교육센터 1층 실습실',
    content: 'HTML 태그와 간단한 CSS 스타일링으로 자기소개 페이지 만들기',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '박메이커', phone: '010-9876-5432', role: 'ASSISTANT' },
    ],
    instructorStatus: 'PENDING',
  },
  {
    id: 'L-251117-SCIENCE-BOOTH-PM',
    title: '과학 축전 부스 운영 - AI 체험존',
    start: '2025-11-17T13:00:00',
    end: '2025-11-17T18:00:00',
    category: 'BOOTH',
    status: 'CONFIRMED',
    location: '안산 문화광장 야외부스 B-12',
    content: 'AI 그림 생성 체험 부스 운영 및 현장 안전 관리',
    instructors: [
      { name: '박체험', phone: '010-7777-1111', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
      { name: '정스태프', phone: '010-2222-3333', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },

  // --- 11월 18일 (화) ---

  {
    id: 'L-251118-SCHOOL-VISIT-ELEM-AM',
    title: '학교로 찾아가는 AI 수업 - B초 5학년',
    start: '2025-11-18T09:00:00',
    end: '2025-11-18T12:00:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: 'B초등학교 컴퓨터실',
    content: '이미지 인식과 분류를 활용한 생활 속 AI 이해',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '박보조', phone: '010-1111-2222', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },
  {
    id: 'L-251118-DORO-AI-CAMP-PM',
    title: '도로랜드 AI 캠프 [오후]',
    start: '2025-11-18T14:00:00',
    end: '2025-11-18T17:00:00',
    category: 'DOROLAND',
    status: 'ALLOCATING',
    location: '도로랜드 제1관',
    content: '도로랜드 캐릭터와 함께하는 인공지능 학습 놀이',
    instructors: [
      { name: '이도로', phone: '010-9999-8888', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
      { name: '김서폿', phone: '010-1212-3434', role: 'ASSISTANT' },
    ],
    instructorStatus: 'PENDING',
  },
  {
    id: 'L-251118-ONLINE-COACH-EVE',
    title: '코딩 대회 온라인 코칭 세션',
    start: '2025-11-18T19:00:00',
    end: '2025-11-18T21:00:00',
    category: 'COMPETITION',
    status: 'RECRUITING',
    location: '온라인 (Discord)',
    content: '전국 코딩 대회 예비 참가자를 위한 문제 풀이 전략 코칭',
    instructors: [
      { name: '정감독', phone: '010-1111-9999', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'APPLIED',
  },

  // --- 11월 19일 (수) ---

  {
    id: 'L-251119-SCHOOL-VISIT-HODONG-AM',
    title: '학교로 찾아가는 생활과학교실 - 호동초 6학년',
    start: '2025-11-19T09:00:00',
    end: '2025-11-19T12:10:00',
    category: 'GENERAL',
    status: 'ALLOCATING',
    location: '안산호동초등학교 컴퓨터실',
    content: '생활 속 과학과 AI를 연결하는 체험형 수업',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
    instructorStatus: 'PENDING',
  },
  {
    id: 'L-251119-SMARTCITY-PM',
    title: '스마트시티 IoT 체험 수업',
    start: '2025-11-19T13:30:00',
    end: '2025-11-19T16:30:00',
    category: 'GENERAL',
    status: 'RECRUITING',
    location: '도롤랜드 실습실 2',
    content: '센서 데이터를 활용한 도시 교통·환경 모니터링 체험',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
      { name: '최기술', phone: '010-5555-4444', role: 'MAIN' },
    ],
    instructorStatus: 'APPLIED',
  },
  {
    id: 'L-251119-CONTEST-REHEARSAL-EVE',
    title: '코딩 대회 예선 리허설',
    start: '2025-11-19T17:00:00',
    end: '2025-11-19T19:00:00',
    category: 'COMPETITION',
    status: 'CONFIRMED',
    location: '도롤랜드 교육센터 3층',
    content: '온라인 시험 환경 점검 및 모의 문제 풀이',
    instructors: [
      { name: '정감독', phone: '010-1111-9999', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },
  {
    id: 'L-251119-CONTEST-REHEARSAL-EVE2',
    title: '코딩 대회 예선 리허설2',
    start: '2025-11-19T20:00:00',
    end: '2025-11-19T21:00:00',
    category: 'COMPETITION',
    status: 'CONFIRMED',
    location: '도롤랜드 교육센터 3층',
    content: '온라인 시험 환경 점검 및 모의 문제 풀이',
    instructors: [
      { name: '정감독', phone: '010-1111-9999', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },

  // --- 11월 20일 (목) ---

  {
    id: 'L-251120-AI-IMAGE-AM',
    title: '생성형 AI로 나만의 캐릭터 만들기',
    start: '2025-11-20T10:00:00',
    end: '2025-11-20T12:00:00',
    category: 'DOROLAND',
    status: 'RECRUITING',
    location: '도롤랜드 교육센터 2층',
    content: '텍스트 프롬프트를 활용한 이미지 생성 실습 및 저작권 이야기',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
    instructorStatus: 'APPLIED',
  },
  {
    id: 'L-251120-CAREER-TALK-PM',
    title: '소프트웨어 직업 세계와 진로 특강',
    start: '2025-11-20T13:30:00',
    end: '2025-11-20T15:00:00',
    category: 'GENERAL',
    status: 'CONFIRMED',
    location: 'C고등학교 시청각실',
    content: '소프트웨어·AI 관련 직업 소개와 진로 설계 팁',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
    ],
    instructorStatus: 'CONFIRMED',
  },
  {
    id: 'L-251120-MAKER-BOOTH-EVE',
    title: '메이커 페어 부스 - 코딩 장난감 체험',
    start: '2025-11-20T16:00:00',
    end: '2025-11-20T19:00:00',
    category: 'BOOTH',
    status: 'ALLOCATING',
    location: 'D시 메이커스페이스 전시장',
    content: '블록 코딩 로봇과 전자 키트 체험 부스 운영',
    instructors: [
      { name: '박메이커', phone: '010-9876-5432', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'PENDING',
  },

  // --- 범위 밖(앞으로 있을 일정) ---

  {
    id: 'L-251123-CAMP-WINTER-YONGIN',
    title: '겨울방학 SW 캠프 (용인)',
    start: '2025-11-23T10:00:00',
    end: '2025-11-23T16:00:00',
    category: 'CAMP',
    status: 'CONFIRMED',
    location: '용인 청소년수련원',
    content: '초·중등 대상 1일 SW·AI 집중 캠프',
    instructors: [
      { name: '김지수', phone: '010-1234-5678', role: 'MAIN' },
      { name: '이헬퍼', phone: '010-5656-7878', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },
  {
    id: 'L-251129-CODING-CONTEST-ONLINE',
    title: '전국 코딩 대회 예선 온라인 감독',
    start: '2025-11-29T09:00:00',
    end: '2025-11-29T13:00:00',
    category: 'COMPETITION',
    status: 'CONFIRMED',
    location: '온라인 (Zoom 감독)',
    content: '전국 코딩 대회 예선 온라인 감독',
    instructors: [
      { name: '정감독', phone: '010-1111-9999', role: 'MAIN' },
      { name: '김지수', phone: '010-1234-5678', role: 'ASSISTANT' },
    ],
    instructorStatus: 'CONFIRMED',
  },
];
