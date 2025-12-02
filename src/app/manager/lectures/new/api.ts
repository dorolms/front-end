import axios from 'axios';

// 환경 변수에서 API 주소를 가져오거나, 없으면 로컬 주소 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  // 1. 로컬 스토리지에서 토큰 꺼내기
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  // 2. 토큰이 있으면 Bearer 헤더 반환, 없으면 빈 객체
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- 타입 정의 (UI에서 넘겨줄 데이터 구조) ---

export interface Schedule {
  date: string;
  start_time: string;
  end_time: string;
}

export interface CreateLecturePayload {
  title: string;
  type: string;
  category: string;
  status: string;
  end_date: string;
  
  recruitment_main: number;
  recruitment_assist: number;
  
  schedules: Schedule[];

  location: string;
//   manager_id: number;
  target: string;
  content: string;
  note: string;
  
  fee: string;
  attachment_url: string | null;
}

// --- API 호출 함수 ---

export const createLecture = async (payload: CreateLecturePayload) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/lectures/lectures/`,
      payload,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('강의 등록 실패:', error);
    throw error; // 에러를 던져서 페이지에서 alert 등을 띄울 수 있게 함
  }
};