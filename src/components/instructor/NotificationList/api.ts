const BASE_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// 1. 알림 목록 조회
export const getNotificationsAPI = async () => {
  const response = await fetch(`${BASE_URL}/api/accounts/notifications/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    // 에러 확인용 로그
    console.error("API Error:", response.status, errorText);
    throw new Error("알림 목록을 불러오는데 실패했습니다.");
  }
  return response.json();
};

// 2. 알림 읽음 처리
export const markAsReadAPI = async (id: number) => {
  const response = await fetch(`${BASE_URL}/api/accounts/notifications/${id}/mark-as-read/`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("읽음 처리에 실패했습니다.");
  }
  return response;
};