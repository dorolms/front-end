// src/lib/api-mock.ts

// --- 1. 타입 정의 (DBML 100% 일치) ---

export type LectureRole = 'main' | 'assist';
export type DbAssignmentStatus = 'pending' | 'assigned' | 'rejected';

// UI에서 사용할 지원자 타입 (DB 구조: 1행 = 1지원)
export interface Applicant {
  application_id: number;
  user_id: number;
  name: string;
  phone_number: string;
  email: string;
  
  applied_role: LectureRole; // 단일 역할
  
  applied_at: string;
  
  // [수정] URL -> Snapshot (Text)
  portfolio_snapshot: string | null; 
  
  assignment_status: DbAssignmentStatus;
  assigned_role: LectureRole | null; 
}

export interface LectureDetail {
  lecture_id: number;
  title: string;
  type: string;           
  category: string;
  period_start: string;   
  period_end: string;     
  location: string;
  manager_name: string;   
  manager_phone: string;  
  target_audience: string;
  recruitment_deadline: string;
  content_description: string;
  special_notes: string;
  attachment_url: string | null;
  
  recruitment_main_needed: number;
  recruitment_assist_needed: number;
  fee_main: number;
  fee_assist: number;
}

// API 응답 구조
export interface LectureResponse {
  lecture: LectureDetail;
  applicants: Applicant[];
}

// --- 2. 가짜 JSON 데이터 (레코드 분리됨) ---

const MOCK_DB: LectureResponse = {
  lecture: {
    lecture_id: 2025001,
    title: '[2025-1학기] 도로초등학교 4학년 AI 기초 교육 강사 모집',
    type: '일반 (General)',
    category: 'AI / SW',
    period_start: '2025-03-25 14:00',
    period_end: '2025-04-25 16:00',
    location: '서울시 성동구 도로초등학교 4층 컴퓨터실',
    manager_name: '김지수',
    manager_phone: '010-1234-5678',
    target_audience: '초등학교 4학년 (2개 학급, 총 50명)',
    recruitment_deadline: '2025-03-20',
    content_description: `본 강의는 초등학교 4학년을 대상으로 하는 AI 기초 교육입니다.\n엔트리와 티처블 머신을 활용하여 아이들이 인공지능의 원리를 쉽게 이해하도록 돕습니다.`,
    special_notes: '주차 공간이 협소하니 대중교통을 이용해주세요. 수업 10분 전 도착 필수입니다.',
    attachment_url: '2025_1학기_커리큘럼_가이드.pdf',
    recruitment_main_needed: 1,
    recruitment_assist_needed: 1,
    fee_main: 50000,
    fee_assist: 30000,
  },
  applicants: [
    { 
      application_id: 101, user_id: 1, name: '김범월', 
      applied_role: 'main', 
      phone_number: '010-1111-1111', email: 'mon@doro.com', applied_at: '2025-03-01', 
      portfolio_snapshot: "김범월 지원시점 포트폴리오 (main)\n\n[주요 경력]\n- 한양대학교 컴퓨터공학부 졸업\n- DORO 3년차 메인 강사", // [수정]
      assignment_status: 'pending', assigned_role: null 
    },
    { 
      application_id: 102, user_id: 1, name: '김범월', 
      applied_role: 'assist', 
      phone_number: '010-1111-1111', email: 'mon@doro.com', applied_at: '2025-03-01', 
      portfolio_snapshot: "김범월 지원시점 포트폴리오 (assist)\n\n[주요 경력]\n- 한양대학교 컴퓨터공학부 졸업\n- DORO 3년차 메인 강사", // [수정]
      assignment_status: 'pending', assigned_role: null 
    },
    { 
      application_id: 103, user_id: 2, name: '김범화', 
      applied_role: 'assist', 
      phone_number: '010-2222-2222', email: 'tue@doro.com', applied_at: '2025-03-02', 
      portfolio_snapshot: "김범화입니다. 보조강사로 지원합니다.\n- 꼼꼼함이 장점입니다.", // [수정]
      assignment_status: 'pending', assigned_role: null 
    },
    { 
      application_id: 104, user_id: 3, name: '김범수', 
      applied_role: 'main', 
      phone_number: '010-3333-3333', email: 'wed@doro.com', applied_at: '2025-02-28', 
      portfolio_snapshot: "김범수 포트폴리오 텍스트\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n스크롤?\n\n\n\n\n\n되네", // [수정]
      assignment_status: 'assigned', assigned_role: 'main' 
    },
    { 
      application_id: 105, user_id: 4, name: '김범목', 
      applied_role: 'assist', 
      phone_number: '010-4444-4444', email: 'thu@doro.com', applied_at: '2025-03-03', 
      portfolio_snapshot: "김범목 포트폴리오 (반려됨)", // [수정]
      assignment_status: 'rejected', assigned_role: null 
    },
    { 
      application_id: 106, user_id: 5, name: '김범금', 
      applied_role: 'assist', 
      phone_number: '010-5555-5555', email: 'fri@doro.com', applied_at: '2025-03-04', 
      portfolio_snapshot: "김범금 포트폴리오 내용입니다.", // [수정]
      assignment_status: 'pending', assigned_role: null 
    },
    { 
      application_id: 107, user_id: 6, name: '김범토', 
      applied_role: 'main', 
      phone_number: '010-6666-6666', email: 'sat@doro.com', applied_at: '2025-03-05', 
      portfolio_snapshot: "김범토 지원서 텍스트 스냅샷입니다. (main)", // [수정]
      assignment_status: 'pending', assigned_role: null 
    },
    { 
      application_id: 108, user_id: 6, name: '김범토', 
      applied_role: 'assist', 
      phone_number: '010-6666-6666', email: 'sat@doro.com', applied_at: '2025-03-05', 
      portfolio_snapshot: "김범토 지원서 텍스트 스냅샷입니다. (assist)", // [수정]
      assignment_status: 'assigned', assigned_role: 'assist' 
    },
    { 
      application_id: 109, user_id: 7, name: '김범일', 
      applied_role: 'assist', 
      phone_number: '010-7777-7777', email: 'sun@doro.com', applied_at: '2025-03-06', 
      portfolio_snapshot: "김범일 포트폴리오 (대기중)", // [수정]
      assignment_status: 'pending', assigned_role: null 
    },
  ]
};

// --- 3. 가짜 API 함수 ---

export const getLectureDetail = async (lectureId: string): Promise<LectureResponse> => {
  console.log(`[MOCK-API] Fetching details for lecture ${lectureId}...`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_DB;
};