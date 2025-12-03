import type { Notice } from './types';

// 프록시 사용
const BASE_URL = 'http://127.0.0.1:8000';

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

// 날짜 포맷팅 (YYYY-MM-DD HH:mm)
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  const cleanStr = dateString.replace('T', ' ');
  if (cleanStr.length >= 16) {
    return cleanStr.substring(0, 16);
  }
  return cleanStr;
};

// 데이터 변환
const mapToNotice = (data: any): Notice => {
  if (!data) return { id: 0, title: '', content: '', author: '', createdAt: '' };

  return {
    id: data.id || data.announcementId || 0,
    title: data.title,
    content: data.content,
    author: data.author_name || data.authorName || data.author || '관리자',
    createdAt: formatDate(data.created_at || data.createdAt),
  };
};

// 토큰 헤더 (강사도 로그인해야 볼 수 있으므로 필요)
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// 이중 포장 뜯기
const unwrapResponse = (json: any) => {
  if (!json) return null;
  let target = json.result;
  if (target && target.result) return target.result;
  return target || json;
};

/* --- API 함수 (조회만 존재) --- */

export async function fetchNotices(): Promise<Notice[]> {
  const url = `${BASE_URL}/api/announcements/`;
  try {
    const res = await fetch(url, { cache: 'no-store', headers: getHeaders() });

    if (!res.ok) {
       if (res.status === 401) throw new Error('로그인이 필요합니다.');
       throw new Error(`서버 에러: ${res.status}`);
    }

    const json = await res.json();
    let realData = unwrapResponse(json);

    if (Array.isArray(json)) realData = json;

    if (Array.isArray(realData)) {
      return realData.map(mapToNotice);
    }
    return [];
  } catch (error) {
    console.error('[강사 공지 조회 실패]', error);
    return [];
  }
}