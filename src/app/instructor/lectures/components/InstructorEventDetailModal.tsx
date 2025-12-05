import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { LectureDetail } from "../types";
import LectureActionButtons from "./LectureActionButtons";

// =========================================================================
// 🧩 확인 모달 컴포넌트
// =========================================================================
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ConfirmModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ConfirmModalBody>
          <p>{message}</p>
          <ButtonGroup>
            <CancelButton onClick={onClose} disabled={isLoading}>
              취소
            </CancelButton>
            <ConfirmButton onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "처리 중..." : confirmText}
            </ConfirmButton>
          </ButtonGroup>
        </ConfirmModalBody>
      </ConfirmModalContainer>
    </Overlay>
  );
};

// =========================================================================
// 🎬 메인 모달 컴포넌트
// =========================================================================
interface InstructorEventDetailModalProps {
  lectureId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// 🔹 JWT 토큰에서 user_id 추출 함수
const getUserIdFromToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    // JWT는 header.payload.signature 형식
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    console.log("🔓 디코딩된 JWT payload:", decodedPayload);

    // user_id 또는 id 필드 찾기
    const userId =
      decodedPayload.user_id || decodedPayload.id || decodedPayload.sub;
    console.log("👤 추출된 userId:", userId);

    return userId ? String(userId) : null;
  } catch (error) {
    console.error("JWT 디코딩 실패:", error);
    return null;
  }
};

const InstructorEventDetailModal: React.FC<InstructorEventDetailModalProps> = ({
  lectureId,
  isOpen,
  onClose,
}) => {
  const [lectureDetail, setLectureDetail] = useState<LectureDetail | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 신청/취소 API 호출 로딩 상태
  const [isActionLoading, setIsActionLoading] = useState(false);

  // 🔹 확인 모달 상태 (취소만 사용)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // 🔹 신청 완료 상태 추가
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && lectureId) {
      fetchLectureDetail(lectureId);
    }

    if (!isOpen) {
      setLectureDetail(null);
      setError(null);
      setIsCancelModalOpen(false);
      setIsActionLoading(false);
      setApplicationSuccess(false);
    }
  }, [isOpen, lectureId]);

  const fetchLectureDetail = async (id: number) => {
    if (!baseUrl) {
      setError("API 서버 주소(.env)가 설정되어 있지 않습니다.");
      return;
    }

    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!accessToken) {
      setError("로그인이 필요합니다. 다시 로그인 후 이용해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/lectures/lectures/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("강의 정보를 불러오는데 실패했습니다.");
      }

      const data: LectureDetail = await response.json();
      console.log("--- API 응답 원본 데이터 ---");
      console.log(data);
      console.log("--- applications 배열 ---");
      console.log(data.applications);
      console.log("--- 현재 userId ---");
      console.log(localStorage.getItem("userId"));
      console.log("------------------------------");
      setLectureDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("Failed to fetch lecture detail:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 강의 신청 API 호출 (역할 포함)
  const handleApplyLecture = async (appliedRole: "main" | "assist") => {
    if (!lectureDetail || !lectureId) return;

    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsActionLoading(true);

    try {
      const requestBody = {
        lecture: lectureId,
        applied_role: appliedRole,
      };

      console.log("=== 강의 신청 요청 ===");
      console.log("URL:", `${baseUrl}/api/lectures/applications/`);
      console.log("Body:", requestBody);
      console.log("=====================");

      const response = await fetch(`${baseUrl}/api/lectures/applications/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = "강의 신청에 실패했습니다.";

        const responseText = await response.text();
        console.error("Server response:", responseText);

        try {
          const errorData = JSON.parse(responseText);

          if (errorData.lecture_id) {
            errorMessage = `lecture_id 오류: ${errorData.lecture_id.join(
              ", "
            )}`;
          } else if (errorData.lecture) {
            errorMessage = `lecture 오류: ${errorData.lecture.join(", ")}`;
          } else if (errorData.applied_role) {
            errorMessage = `applied_role 오류: ${errorData.applied_role.join(
              ", "
            )}`;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          } else {
            errorMessage = JSON.stringify(errorData);
          }
        } catch {
          errorMessage = `서버 오류 (${
            response.status
          }): ${responseText.substring(0, 100)}`;
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Success response:", result);

      // ✅ 신청 성공! 성공 플래그만 설정하고 새로고침은 나중에
      setApplicationSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("Failed to apply lecture:", err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  // 🔹 신청 모달이 완전히 닫힐 때 호출되는 콜백
  const handleApplicationModalClose = async () => {
    // 신청이 성공했다면 강의 정보를 새로고침
    // if (applicationSuccess && lectureId) {
    //   await fetchLectureDetail(lectureId);
    //   setApplicationSuccess(false);
    // }
    if (applicationSuccess) {
      window.location.reload(); // ✅ 페이지 전체를 새로고침
    }
  };

  // 🔹 현재 사용자의 신청 ID 찾기 함수 추가
  const getMyApplicationId = (): number | null => {
    console.log("🔍 getMyApplicationId 호출");

    if (!lectureDetail || !lectureDetail.applications) {
      console.log("❌ lectureDetail 또는 applications 없음");
      return null;
    }

    console.log("📋 applications 배열:", lectureDetail.applications);

    // 🔍 JWT 토큰에서 userId 추출
    const currentUserId = getUserIdFromToken();
    console.log("👤 현재 userId (JWT에서 추출):", currentUserId);

    if (!currentUserId) {
      console.log("❌ userId 추출 실패");
      return null;
    }

    // applications 배열에서 현재 사용자의 신청 찾기
    const myApplication = lectureDetail.applications.find((app: any) => {
      console.log(
        `비교 중: app.user.id=${app.user.id} (타입: ${typeof app.user
          .id}) vs currentUserId=${currentUserId} (타입: ${typeof currentUserId})`
      );
      // 둘 다 숫자로 비교
      return app.user.id === parseInt(currentUserId);
    });

    console.log("🎯 찾은 신청:", myApplication);

    // 신청이 있으면 application id 반환
    const applicationId = myApplication ? myApplication.id : null;
    console.log("✅ 반환할 applicationId:", applicationId);

    return applicationId;
  };

  // 🔹 강의 신청 취소 API 호출
  const handleCancelLecture = async () => {
    if (!lectureDetail) return;

    // ✅ 내 신청 ID 찾기
    const myApplicationId = getMyApplicationId();

    if (!myApplicationId) {
      alert("신청 정보를 찾을 수 없습니다.");
      console.error("❌ applicationId를 찾을 수 없습니다.");
      return;
    }

    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsActionLoading(true);

    try {
      console.log("=== 신청 취소 시도 ===");
      console.log("Application ID:", myApplicationId);
      console.log("Lecture ID:", lectureId);

      const response = await fetch(
        `${baseUrl}/api/lectures/applications/${myApplicationId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorMessage = "강의 신청 취소에 실패했습니다.";

        const responseText = await response.text();
        console.error("Server response:", responseText);

        try {
          const errorData = JSON.parse(responseText);

          if (errorData.detail === "No Application matches the given query.") {
            errorMessage = "신청 내역을 찾을 수 없습니다.";
          } else {
            errorMessage =
              errorData.message ||
              errorData.error ||
              errorData.detail ||
              errorMessage;
          }
        } catch {
          errorMessage = `서버 오류 (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      console.log("✅ 신청 취소 성공");

      if (lectureId) {
        await fetchLectureDetail(lectureId);
      }

      setIsCancelModalOpen(false);

      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("Failed to cancel lecture:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!isOpen) return null;

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      general: "일반",
      competition: "대회",
      camp: "캠프",
      doroland: "도로랜드",
      booth: "부스",
      etc: "기타",
    };
    return map[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      RECRUITING: "모집 중",
      ALLOCATING: "배정 중",
      COMPLETED: "배정 완료",
      COMPETITION: "배정 완료",
    };
    return map[status] || status;
  };

  // 🔹 현재 로그인한 사용자의 신청 상태 찾기
  const getMyApplicationStatus = (): string | null => {
    console.log("🔍 getMyApplicationStatus 호출");

    if (!lectureDetail || !lectureDetail.applications) {
      console.log("❌ lectureDetail 또는 applications 없음");
      return null;
    }

    console.log("📋 applications 배열:", lectureDetail.applications);

    // 🔍 JWT 토큰에서 userId 추출
    const currentUserId = getUserIdFromToken();

    console.log("👤 현재 userId (JWT에서 추출):", currentUserId);

    if (!currentUserId) {
      console.log("❌ userId 추출 실패");
      return null;
    }

    // applications 배열에서 현재 사용자의 신청 찾기
    const myApplication = lectureDetail.applications.find((app: any) => {
      console.log(
        `비교 중: app.user.id=${app.user.id} (타입: ${typeof app.user
          .id}) vs currentUserId=${currentUserId} (타입: ${typeof currentUserId})`
      );
      // 둘 다 숫자로 비교
      return app.user.id === parseInt(currentUserId);
    });

    console.log("🎯 찾은 신청:", myApplication);

    // 신청이 있으면 assignment_status 반환
    const status = myApplication ? myApplication.assignment_status : null;
    console.log("✅ 반환할 status:", status);

    return status;
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{lectureDetail?.title || "강의 정보"}</ModalTitle>
            <CloseButton onClick={onClose}>×</CloseButton>
          </ModalHeader>

          <ModalBody>
            {loading && (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>로딩 중...</LoadingText>
              </LoadingContainer>
            )}

            {error && (
              <ErrorContainer>
                <ErrorText>{error}</ErrorText>
                <RetryButton
                  onClick={() => lectureId && fetchLectureDetail(lectureId)}>
                  다시 시도
                </RetryButton>
              </ErrorContainer>
            )}

            {!loading && !error && lectureDetail && (
              <>
                <Section>
                  <SectionTitle>기본 정보</SectionTitle>
                  <InfoRow>
                    <Label>강의 타입</Label>
                    <Value>{getTypeLabel(lectureDetail.type)}</Value>
                  </InfoRow>

                  {lectureDetail.category && (
                    <InfoRow>
                      <Label>강의 구분</Label>
                      <Value>{lectureDetail.category}</Value>
                    </InfoRow>
                  )}

                  <InfoRow>
                    <Label>상태</Label>
                    <StatusBadge status={lectureDetail.status}>
                      {getStatusLabel(lectureDetail.status)}
                    </StatusBadge>
                  </InfoRow>

                  <InfoRow>
                    <Label>장소</Label>
                    <Value>{lectureDetail.location}</Value>
                  </InfoRow>

                  <InfoRow>
                    <Label>대상</Label>
                    <Value>{lectureDetail.target}</Value>
                  </InfoRow>

                  <InfoRow>
                    <Label>정원</Label>
                    <Value>{lectureDetail.capacity}명</Value>
                  </InfoRow>
                </Section>

                <Divider />
                <Section>
                  <SectionTitle>강사 액션</SectionTitle>
                  {(() => {
                    const myStatus = getMyApplicationStatus();
                    console.log(
                      "🎬 렌더링 시점 - status:",
                      lectureDetail.status
                    );
                    console.log(
                      "🎬 렌더링 시점 - myApplicationStatus:",
                      myStatus
                    );

                    return (
                      <LectureActionButtons
                        status={lectureDetail.status}
                        myApplicationStatus={myStatus}
                        isLoading={isActionLoading}
                        onApply={handleApplyLecture}
                        onCancel={() => setIsCancelModalOpen(true)}
                        onApplicationModalClose={handleApplicationModalClose}
                        lectureTitle={lectureDetail.title}
                        lectureId={lectureDetail.id}
                      />
                    );
                  })()}
                </Section>
                <Divider />

                <Section>
                  <SectionTitle>강의 일정</SectionTitle>
                  {lectureDetail.schedules.map((sch) => (
                    <InfoRow key={sch.id}>
                      <Label>{sch.date}</Label>
                      <Value>
                        {sch.start_time.slice(0, 5)} -{" "}
                        {sch.end_time.slice(0, 5)}
                      </Value>
                    </InfoRow>
                  ))}
                </Section>

                <Divider />

                <Section>
                  <SectionTitle>모집 정보</SectionTitle>
                  <InfoRow>
                    <Label>모집 마감</Label>
                    <Value>{lectureDetail.end_date}</Value>
                  </InfoRow>

                  <InfoRow>
                    <Label>모집 인원</Label>
                    <Value>
                      메인 {lectureDetail.recruitment_main}명 / 보조{" "}
                      {lectureDetail.recruitment_assist}명
                    </Value>
                  </InfoRow>

                  <InfoRow>
                    <Label>강의료</Label>
                    <Value>{lectureDetail.fee}</Value>
                  </InfoRow>
                </Section>

                {lectureDetail.content && (
                  <>
                    <Divider />
                    <Section>
                      <SectionTitle>강의 내용</SectionTitle>
                      <ContentBox>{lectureDetail.content}</ContentBox>
                    </Section>
                  </>
                )}

                {lectureDetail.note && (
                  <>
                    <Divider />
                    <Section>
                      <SectionTitle>특이사항</SectionTitle>
                      <ContentBox>{lectureDetail.note}</ContentBox>
                    </Section>
                  </>
                )}

                {lectureDetail.attachment_url && (
                  <>
                    <Divider />
                    <Section>
                      <SectionTitle>첨부파일</SectionTitle>
                      <AttachmentLink
                        href={lectureDetail.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer">
                        📎 첨부파일 다운로드
                      </AttachmentLink>
                    </Section>
                  </>
                )}

                {lectureDetail.confirmed_instructors.length > 0 && (
                  <>
                    <Divider />
                    <Section>
                      <SectionTitle>확정 강사</SectionTitle>
                      <InfoRow>
                        <Value>
                          {lectureDetail.confirmed_instructors.length}명 확정
                        </Value>
                      </InfoRow>
                    </Section>
                  </>
                )}
              </>
            )}
          </ModalBody>
        </ModalContainer>
      </Overlay>

      {/* 🔹 취소 확인 모달 */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelLecture}
        title="강의 신청 취소"
        message={`"${lectureDetail?.title}" 강의 신청을 정말로 취소하시겠습니까?`}
        confirmText="취소하기"
        isLoading={isActionLoading}
      />
    </>
  );
};

// =========================================================================
// 💅 스타일 컴포넌트
// =========================================================================

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ConfirmModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const ConfirmModalBody = styled.div`
  padding: 24px;

  p {
    margin: 0 0 24px 0;
    color: #374151;
    font-size: 15px;
    line-height: 1.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background-color: #93c5fd;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: #6b7280;
  font-size: 14px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const ErrorText = styled.div`
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563eb;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  font-size: 14px;
`;

const Value = styled.div`
  color: #111827;
  font-size: 14px;
  flex: 1;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${(props) => {
    if (props.status === "RECRUITING") return "#DBEAFE";
    if (props.status === "ALLOCATING") return "#FEF3C7";
    return "#E5E7EB";
  }};
  color: ${(props) => {
    if (props.status === "RECRUITING") return "#1E40AF";
    if (props.status === "ALLOCATING") return "#92400E";
    return "#374151";
  }};
`;

const ContentBox = styled.div`
  background-color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e5e7eb;
  margin: 20px 0;
`;

const AttachmentLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

export default InstructorEventDetailModal;
