import type { Notice } from './types';

const BASE_URL = 'http://127.0.0.1:8000';

type ApiResponse<T> = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
};

/**
 * 날짜 포맷팅 함수
 * 16글자(날짜+시간)까지
 */
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';

  // T가 들어간 형식(ISO)이 오면 공백으로 바꿔줍니다.
  const cleanStr = dateString.replace('T', ' ');

  // 예: "2025-11-29 20:02:00" -> "2025-11-29 20:02" (앞에서 16글자만 자름)
  if (cleanStr.length >= 16) {
    return cleanStr.substring(0, 16);
  }
  return cleanStr;
};

// 데이터 매핑 함수
const mapToNotice = (data: any): Notice => {
  if (!data) {
    return { id: 0, title: '', content: '', author: '', createdAt: '' };
  }

  const id = data.id || data.announcementId || 0;

  return {
    id: id,
    title: data.title,
    content: data.content,
    // author_name, authorName, author 셋 다 확인
    author: data.author_name || data.authorName || data.author || '관리자',
    // created_at, createdAt 셋 다 확인
    createdAt: formatDate(data.created_at || data.createdAt),
  };
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// 이중 포장 뜯기 함수
const unwrapResponse = (json: any) => {
  if (!json) return null;
  let target = json.result;
  if (target && target.result) {
    return target.result;
  }
  return target || json;
};

/* --- API 함수들 --- */

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

    // 백엔드가 배열을 바로 주는 경우 대응
    if (Array.isArray(json)) {
        realData = json;
    }

    if (Array.isArray(realData)) {
      return realData.map(mapToNotice);
    }
    return [];
  } catch (error) {
    console.error('[목록 조회 실패]', error);
    return [];
  }
}

export async function createNotice(payload: { title: string; content: string }) {
  const res = await fetch(`${BASE_URL}/api/announcements/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('공지 등록 실패');

  const json = await res.json();
  const realData = unwrapResponse(json);
  return mapToNotice(realData);
}

export async function updateNotice(id: number, payload: { title: string; content: string }) {
  if (!id) throw new Error('수정할 게시글의 ID가 없습니다.');

  const res = await fetch(`${BASE_URL}/api/announcements/${id}/`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('공지 수정 실패');

  const json = await res.json();
  const realData = unwrapResponse(json);
  return mapToNotice(realData);
}

export async function deleteNotice(id: number) {
  const res = await fetch(`${BASE_URL}/api/announcements/${id}/`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) throw new Error('공지 삭제 실패');
  return true;
}