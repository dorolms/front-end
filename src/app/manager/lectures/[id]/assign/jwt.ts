
/**
 * JWT 토큰 디코딩 함수 (라이브러리 없이 구현)
 */
export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Token parsing failed:', e);
    return null;
  }
};

/**
 * 토큰이 유효한지(만료되지 않았는지) 검사하는 함수
 * @returns {boolean} true: 유효함, false: 만료됨 or 잘못됨
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false;

  // JWT exp는 '초' 단위, Date.now()는 '밀리초' 단위이므로 변환 필요
  const currentTime = Math.floor(Date.now() / 1000);

  // 만료 시간(exp)이 현재 시간보다 커야 유효함
  return decoded.exp > currentTime;
};

/**
 * (선택) 토큰에서 권한(Role) 가져오기
 */
export const getUserRole = (token: string | null): string | null => {
  if (!token) return null;
  const decoded = parseJwt(token);
  return decoded?.role || null;
};