import { EventItem } from "../_types";

export const mockEvents: EventItem[] = [
  /* -----------------------------
     2025-11-10 (월)
  ----------------------------- */
  {
    id: 'e1',
    title: '데이터베이스 - 한양대 에리카',
    start: '2025-11-10T09:00:00',
    end: '2025-11-10T13:00:00',
    location: '안산초등초등학교 컴퓨터실',
    category: 'GENERAL',
    status: 'CONFIRMED',
    manager: '김지수 매니저 · 010-1234-5678',
    content: '관계형 데이터베이스 기초와 실습을 진행합니다.',
  },
  {
    id: 'e2',
    title: 'AI 기초 - 도로랜드 특별편',
    start: '2025-11-10T14:00:00',
    end: '2025-11-10T16:00:00',
    location: '도로랜드 제1관',
    category: 'DOROLAND',
    status: 'CONFIRMED',
    manager: '홍기범 매니저 · 010-9988-1122',
    content: 'AI가 일상에서 어떻게 쓰이는지 체험 중심으로 배웁니다.',
  },

  /* -----------------------------
     2025-11-11 (화)
  ----------------------------- */
  {
    id: 'e3',
    title: '코딩 부트캠프 - 기초반',
    start: '2025-11-11T09:00:00',
    end: '2025-11-11T12:00:00',
    location: '안산청소년센터 2층',
    category: 'CAMP',
    status: 'CONFIRMED',
    manager: '원빈 매니저 · 010-2222-3333',
    content: '블록코딩과 파이썬 문법 기초를 빠르게 배우는 수업.',
  },
  {
    id: 'e4',
    title: '자율주행 자동차 만들기 - 3차시',
    start: '2025-11-11T13:00:00',
    end: '2025-11-11T16:00:00',
    location: '광덕중학교 과학실',
    category: 'GENERAL',
    status: 'REQUESTED',
    manager: '박보영 매니저 · 010-8765-1234',
    content: '센서와 라인트레이싱 기반 간단한 자율주행 구현.',
  },

  /* -----------------------------
     2025-11-12 (수)
  ----------------------------- */
  {
    id: 'e5',
    title: '청소년 AI 대회 준비반',
    start: '2025-11-12T10:00:00',
    end: '2025-11-12T12:00:00',
    location: '상록수고등학교 1실',
    category: 'COMPETITION',
    status: 'CONFIRMED',
    manager: '최은영 매니저 · 010-4444-5555',
    content: 'AI 경진대회 대비 문제풀이 및 모델 훈련 실습.',
  },
  {
    id: 'e6',
    title: '로봇 체험 부스 운영',
    start: '2025-11-12T13:00:00',
    end: '2025-11-12T17:00:00',
    location: '안산문화광장',
    category: 'BOOTH',
    status: 'PENDING',
    manager: '정용화 매니저 · 010-5555-6666',
    content: '간단한 로봇 조작 및 장애물 미션 체험.',
  },

  /* -----------------------------
     2025-11-13 (목) — 오늘
  ----------------------------- */
  {
    id: 'e7',
    title: '데이터 사이언스 - 실습',
    start: '2025-11-13T09:00:00',
    end: '2025-11-13T13:00:00',
    location: '한양대 ERICA 제1공학관',
    category: 'GENERAL',
    status: 'CONFIRMED',
    manager: '남도현 매니저 · 010-7777-1212',
    content: '파이썬 기반 데이터 분석 및 시각화 실습.',
  },
  {
    id: 'e8',
    title: 'AI 창의 메이커 교실',
    start: '2025-11-13T15:00:00',
    end: '2025-11-13T17:00:00',
    location: '안산중앙중학교 메이커룸',
    category: 'CAMP',
    status: 'REQUESTED',
    manager: '김다솔 매니저 · 010-8373-4421',
    content: '아두이노와 간단한 AI 센서를 활용한 만들기 수업.',
  },

  /* -----------------------------
     2025-11-14 (금)
  ----------------------------- */
  {
    id: 'e9',
    title: '생활과학교실 - 3차시',
    start: '2025-11-14T09:00:00',
    end: '2025-11-14T13:00:00',
    location: '월피초등학교 과학실',
    category: 'GENERAL',
    status: 'CONFIRMED',
    manager: '한유림 매니저 · 010-2929-1111',
    content: '생활 속 과학 원리를 실험 중심으로 배우는 수업.',
  },
  {
    id: 'e10',
    title: 'AI 리터러시 교육 특강',
    start: '2025-11-14T14:00:00',
    end: '2025-11-14T16:00:00',
    location: '세화여중 컴퓨터실',
    category: 'ETC',
    status: 'PENDING',
    manager: '유재민 매니저 · 010-1331-2442',
    content: '생성형 AI의 원리와 올바른 활용법을 배우는 특강.',
  },

  /* -----------------------------
     2025-11-15 (토)
  ----------------------------- */
  {
    id: 'e11',
    title: '부스 운영 - AI 놀이터',
    start: '2025-11-15T10:00:00',
    end: '2025-11-15T15:00:00',
    location: '안산문화예술의전당 야외광장',
    category: 'BOOTH',
    status: 'CONFIRMED',
    manager: '이준호 매니저 · 010-5555-8888',
    content: 'AI 얼굴 인식·음성인식 체험 부스 운영.',
  },

  /* -----------------------------
     2025-11-17 (월)
  ----------------------------- */
  {
    id: 'e12',
    title: '도로랜드 체험의 날',
    start: '2025-11-17T09:00:00',
    end: '2025-11-17T13:00:00',
    location: '도로랜드 메인홀',
    category: 'DOROLAND',
    status: 'PENDING',
    manager: '이주호 매니저 · 010-5432-2222',
    content: 'AI·로봇·VR 체험 중심 교육.',
  },

  /* -----------------------------
     2025-11-18 (화)
  ----------------------------- */
  {
    id: 'e13',
    title: 'AI 문제해결 Workshop',
    start: '2025-11-18T14:00:00',
    end: '2025-11-18T17:00:00',
    location: '안산청소년수련관 세미나실',
    category: 'COMPETITION',
    status: 'CONFIRMED',
    manager: '이나영 매니저 · 010-4422-8811',
    content: '팀별 프로젝트 문제 해결 실습.',
  },

  /* -----------------------------
     2025-11-20 (목)
  ----------------------------- */
  {
    id: 'e14',
    title: 'AI 융합 체험교실',
    start: '2025-11-20T09:00:00',
    end: '2025-11-20T11:00:00',
    location: '선부고등학교 AI랩',
    category: 'GENERAL',
    status: 'REQUESTED',
    manager: '박다연 매니저 · 010-9191-2233',
    content: 'AI 센서 체험 및 프로젝트 실습.',
  },
  {
    id: 'e15',
    title: '드론 기초캠프',
    start: '2025-11-20T13:00:00',
    end: '2025-11-20T17:00:00',
    location: '안산드론센터 A동',
    category: 'CAMP',
    status: 'PENDING',
    manager: '서지훈 매니저 · 010-8822-2344',
    content: '기초 드론 조작과 안전 교육.',
  },

  /* -----------------------------
     2025-11-22 (토)
  ----------------------------- */
  {
    id: 'e16',
    title: 'AI 발명 공작교실',
    start: '2025-11-22T09:00:00',
    end: '2025-11-22T12:00:00',
    location: '안산발명교육센터',
    category: 'GENERAL',
    status: 'CONFIRMED',
    manager: '차은우 매니저 · 010-7777-3333',
    content: '창의 공작과 AI 모듈을 결합한 프로젝트 실습.',
  },
  {
    id: 'e17',
    title: '청소년 메타버스 대회',
    start: '2025-11-22T14:00:00',
    end: '2025-11-22T18:00:00',
    location: '안산스마트허브',
    category: 'COMPETITION',
    status: 'CONFIRMED',
    manager: '백현 매니저 · 010-1212-9595',
    content: '메타버스 환경에서 진행하는 창작 대회.',
  },

  /* -----------------------------
     2025-11-24 (월)
  ----------------------------- */
  {
    id: 'e18',
    title: '코딩 첫걸음 - 로봇편',
    start: '2025-11-24T10:00:00',
    end: '2025-11-24T12:00:00',
    location: '성포초등학교 과학실',
    category: 'GENERAL',
    status: 'REQUESTED',
    manager: '박보검 매니저 · 010-8899-1111',
    content: '로봇 블록코딩과 기본 동작 구현 수업.',
  },
  {
    id: 'e19',
    title: '스마트팜 센서 실습',
    start: '2025-11-24T13:00:00',
    end: '2025-11-24T15:00:00',
    location: '한양대 ERICA 메이커스페이스',
    category: 'ETC',
    status: 'CONFIRMED',
    manager: '홍박사 매니저 · 010-4477-5252',
    content: '스마트팜 센서 데이터 측정 및 분석.',
  },
  {
    id: 'e20',
    title: '스마트팜 센서 실습 2 ',
    start: '2025-11-24T16:00:00',
    end: '2025-11-24T17:00:00',
    location: '한양대 ERICA 메이커스페이스',
    category: 'ETC',
    status: 'CONFIRMED',
    manager: '홍박사 매니저 · 010-4477-5252',
    content: '스마트팜 센서 데이터 측정 및 분석.',
  },
  {
    id: 'e21',
    title: '스마트팜 센서 실습 3 ',
    start: '2025-11-24T18:00:00',
    end: '2025-11-24T19:00:00',
    location: '한양대 ERICA 메이커스페이스',
    category: 'ETC',
    status: 'CONFIRMED',
    manager: '홍박사 매니저 · 010-4477-5252',
    content: '스마트팜 센서 데이터 측정 및 분석.',
  },
  {
    id: 'e22',
    title: '스마트팜 센서 실습 4 ',
    start: '2025-11-24T20:00:00',
    end: '2025-11-24T21:00:00',
    location: '한양대 ERICA 메이커스페이스',
    category: 'ETC',
    status: 'CONFIRMED',
    manager: '홍박사 매니저 · 010-4477-5252',
    content: '스마트팜 센서 데이터 측정 및 분석.',
  },
];
