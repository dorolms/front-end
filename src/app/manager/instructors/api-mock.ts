// src/app/manager/instructors/api-mock.ts

// [수정] DBML User 테이블 구조 반영
export interface Instructor {
  user_id: number;       // pk
  name: string;          // varchar(100)
  email: string;         // varchar(255)
  phone_number: string;  // varchar(20)
  role: 'manager' | 'instructor'; // Enum user_role
  profile_photo_url: string | null; // varchar(255)
  bio: string | null;    // text (이력, 학과 등 소개)
  portfolio_content: string | null; // text (상세 내용)
  created_at: string;    // timestamp
  
}

const MOCK_INSTRUCTORS: Instructor[] = [
  { 
    user_id: 1, name: '김범월', email: 'mon@doro.com', phone_number: '010-1111-1111', 
    role: 'instructor',
    profile_photo_url: null, created_at: '2024-01-15',
    // [수정] school, major, short_bio -> bio 필드로 통합
    bio: `한양대학교 컴퓨터소프트웨어학부\n전) 삼성전자 SW 멤버십 활동\n현) DORO 메인 강사 (3년차)`,
    portfolio_content: `
      [자기소개]
      안녕하세요, 아이들에게 코딩의 재미를 알려주는 강사 김범월입니다.
      이해하기 쉬운 비유와 실습 위주의 수업을 지향합니다.

      [주요 경력]
      - 2023 도로초등학교 AI 캠프 메인 강사
      - 2024 성동구 청소년 센터 파이썬 특강 진행
      
      [보유 기술]
      - Python, C++, JS
      - Entry, Scratch 교육 자격 보유
    `
  },
  { 
    user_id: 2, name: '김범화', email: 'tue@doro.com', phone_number: '010-2222-2222', 
    role: 'instructor',
    profile_photo_url: null, created_at: '2024-02-20',
    bio: `서울대학교 교육학과\n교육학 전공으로 아이들 눈높이 교육 전문`,
    portfolio_content: '아이들과 소통하며 성장하는 강사입니다. (포트폴리오 내용 생략)'
  },
  { user_id: 3, name: '김범수', email: 'wed@doro.com', phone_number: '010-3333-3333', role: 'instructor', profile_photo_url: `https://static.solved.ac/uploads/profile/360x360/bumsoo0515-picture-1732888839166.png`, bio: '한양대 에리카 인공지능학과\n어쩌구', portfolio_content: `
    스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n스\n크\n롤\n
    `, created_at: '2024-03-10' },
  { user_id: 4, name: '김범목', email: 'thu@doro.com', phone_number: '010-4444-4444', role: 'instructor', profile_photo_url: null, bio: null, portfolio_content: null, created_at: '2024-04-05' },
  { user_id: 5, name: '김범금', email: 'fri@doro.com', phone_number: '010-5555-5555', role: 'instructor', profile_photo_url: null, bio: '성균관대 소프트웨어학과', portfolio_content: '열정 가득!', created_at: '2024-05-12' },
];

export const getInstructors = async (): Promise<Instructor[]> => {
  console.log(`[MOCK-API] Fetching instructor list...`);
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_INSTRUCTORS;
};