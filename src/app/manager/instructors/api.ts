import axios from 'axios';

// 환경 변수에서 API 주소를 가져오거나, 없으면 로컬 주소 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// --- 1. 타입 정의 (API 명세 기준) ---

export interface InstructorBasic {
  id: number;
  name: string;
  major: string;
}

export interface InstructorDetail {
  id: number;
  name: string;
  major: string;
  profile_photo_url: string | null;
  portfolio: string | null;
  role?: string;
  email?: string;
  phone_number?: string;
  bio?: string;
}

// --- [추가] 인증 헤더 생성 헬퍼 함수 ---
const getAuthHeaders = () => {
  // 1. 로컬 스토리지에서 토큰 꺼내기 (저장하신 키 이름 확인 필요: 'token', 'access', 'accessToken' 등)
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  // 2. 토큰이 있으면 Bearer 헤더 반환, 없으면 빈 객체
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- 2. API 호출 함수 ---

/**
 * 강사 목록 조회
 */
export const getInstructorList = async (): Promise<InstructorBasic[]> => {
  try {
    const response = await axios.get<InstructorBasic[]>(`${API_BASE_URL}/api/accounts/instructors/`, {
      // [수정] 헤더 추가
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch instructor list:', error);
    throw error;
  }
};

/**
 * 강사 상세 정보 조회
 */
export const getInstructorDetail = async (id: number): Promise<InstructorDetail> => {
  try {
    const response = await axios.get<InstructorDetail>(`${API_BASE_URL}/api/accounts/instructors/${id}/`, {
      // [수정] 헤더 추가
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch instructor detail (ID: ${id}):`, error);
    throw error;
  }
};