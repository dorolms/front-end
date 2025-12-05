import axios from 'axios';

// 환경 변수에서 API 주소를 가져오거나, 없으면 로컬 주소 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getAuthHeaders = () => {
  // 1. 로컬 스토리지에서 토큰 꺼내기
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  // 2. 토큰이 있으면 Bearer 헤더 반환, 없으면 빈 객체
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export type LectureRole = 'main' | 'assist';
export type AssignmentStatus = 'pending' | 'assigned' | 'rejected';

// [수정] API 응답 구조에 맞춘 User 타입
export interface UserInfo {
  id: number;
  name: string;
  major: string;
  phone_num: string;
  role: string;
}

export interface Application {
  id: number;
  lecture: number;
  lecture_title: string;
  
  // 유저 정보가 객체로 들어옴
  user: UserInfo;
  
  applied_role: LectureRole;
  assignment_status: AssignmentStatus;
  created_at: string; // applied_at -> created_at
  is_notification_read: boolean;
}

// 스케줄 타입
export interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
}

// 강의 상세 정보 타입 (API Response 구조)
export interface LectureDetail {
  id: number;
  title: string;
  type: string;
  category: string;
  status: string;      // "RECRUITING"
  location: string;
  target: string;      // [변경] target_audience -> target
  capacity: string;    // [신규] "30명" 등 문자열
  content: string;     // [변경] content_description -> content
  end_date: string;    // [변경] recruitment_deadline -> end_date
  fee: string;         // [변경] fee_main/assist -> fee (문자열)
  
  recruitment_main: number;   // [변경] recruitment_main_needed -> recruitment_main
  recruitment_assist: number; // [변경] recruitment_assist_needed -> recruitment_assist
  
  note: string;        // [변경] special_notes -> note
  attachment_url: string | null;
  
  manager_name: string;
  manager_phone: string;
  
  schedules: Schedule[];
  
  // [핵심] 지원자 목록이 강의 객체 안에 포함됨
  applications: Application[];
  confirmed_instructors: any[];
}

export interface patchData {
  id: number;
  lecture: number;
  applied_role: LectureRole;
  assignment_status: AssignmentStatus;
}

export const getLectureDetail = async (id: number): Promise<LectureDetail> => {
  try {
    const response = await axios.get<LectureDetail>(`${API_BASE_URL}/api/lectures/lectures/${id}/`, {
      // [수정] 헤더 추가
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch lecture detail (ID: ${id}):`, error);
    throw error;
  }
};

export const patchApplications = async (payload: patchData) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/lectures/applications/${payload.id}/`,
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
    console.error('정보 갱신 실패:', error);
    throw error; // 에러를 던져서 페이지에서 alert 등을 띄울 수 있게 함
  }
};
