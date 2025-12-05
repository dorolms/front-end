// src/components/manager/NotificationList/api.ts

const BASE_URL = "http://127.0.0.1:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/* -------------------------------------------------------------------------- */
/*  Notification API                                                          */
/* -------------------------------------------------------------------------- */

/**
 * [API 1] 전체 알림 조회 (매니저 전용)
 * - 모든 유저의 알림을 가져옴
 * - 강사 리스트 및 각 강사의 안 읽은 알림 개수를 집계할 때 사용
 */
export const getAllNotificationsAPI = async () => {
  const response = await fetch(`${BASE_URL}/api/accounts/notifications/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("전체 알림 조회 실패");
  return response.json();
};

/**
 * [API 2] 특정 강사의 알림 조회
 * @param userId - 조회하려는 강사의 user_id
 */
export const getInstructorNotificationsAPI = async (userId: number) => {
  const response = await fetch(
    `${BASE_URL}/api/accounts/notifications/?user_id=${userId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) throw new Error("강사 알림 조회 실패");
  return response.json();
};

/**
 * [API 3] 알림 재공지(재전송)
 * - 기존 알림 내용을 기반으로 동일한 사용자에게 다시 알림을 생성
 * - 메시지 앞에 [재공지] 태그를 자동으로 추가함
 */
export const resendNotificationAPI = async (originalNoti: any) => {
  const response = await fetch(`${BASE_URL}/api/accounts/notifications/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      user: originalNoti.user,                     // 알림 받을 사용자 ID
      message: `[재공지] ${originalNoti.message}`, // 앞에 [재공지] 추가하여 전송
      lecture: originalNoti.lecture,               // 관련된 강의 ID (optional)
      // notification_type: originalNoti.notification_type // 필요 시 포함 가능
    }),
  });

  if (!response.ok) throw new Error("재공지 전송 실패");
  return response.json();
};
