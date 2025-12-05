import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { LectureDetail } from "../types";
import LectureActionButtons from "./LectureActionButtons";

// =========================================================================
// 🔧 Constants & Utils
// =========================================================================
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const TYPE_LABELS: Record<string, string> = {
  general: "일반",
  competition: "대회",
  camp: "캠프",
  doroland: "도로랜드",
  booth: "부스",
  etc: "기타",
};

const STATUS_LABELS: Record<string, string> = {
  RECRUITING: "모집 중",
  ALLOCATING: "배정 중",
  COMPLETED: "배정 완료",
  COMPETITION: "배정 완료",
};

// JWT 토큰에서 user_id 추출
const getUserIdFromToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return null;

  try {
    const payload = accessToken.split(".")[1];
    const decodedPayload = JSON.parse(atob(payload));
    return String(
      decodedPayload.user_id || decodedPayload.id || decodedPayload.sub || ""
    );
  } catch (error) {
    console.error("JWT 디코딩 실패:", error);
    return null;
  }
};

// Access Token 가져오기
const getAccessToken = (): string | null => {
  return typeof window !== "undefined"
    ? localStorage.getItem("accessToken")
    : null;
};

// 라벨 변환 함수
const getTypeLabel = (type: string) => TYPE_LABELS[type] || type;
const getStatusLabel = (status: string) => STATUS_LABELS[status] || status;

// =========================================================================
// 🧩 ConfirmModal Component
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
// 🎬 Main Modal Component
// =========================================================================
interface InstructorEventDetailModalProps {
  lectureId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const InstructorEventDetailModal: React.FC<InstructorEventDetailModalProps> = ({
  lectureId,
  isOpen,
  onClose,
}) => {
  // ===== State =====
  const [lectureDetail, setLectureDetail] = useState<LectureDetail | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // ===== Effects =====
  useEffect(() => {
    if (isOpen && lectureId) {
      fetchLectureDetail(lectureId);
    }

    if (!isOpen) {
      resetState();
    }
  }, [isOpen, lectureId]);

  // ===== Helper Functions =====
  const resetState = () => {
    setLectureDetail(null);
    setError(null);
    setIsCancelModalOpen(false);
    setIsActionLoading(false);
    setApplicationSuccess(false);
  };

  const findMyApplication = () => {
    if (!lectureDetail?.applications) return null;

    const currentUserId = getUserIdFromToken();
    if (!currentUserId) return null;

    return lectureDetail.applications.find(
      (app: any) => app.user.id === parseInt(currentUserId)
    );
  };

  const getMyApplicationId = (): number | null => {
    const myApp = findMyApplication();
    return myApp ? myApp.id : null;
  };

  const getMyApplicationStatus = (): string | null => {
    const myApp = findMyApplication();
    return myApp ? myApp.assignment_status : null;
  };

  // ===== API Calls =====
  const fetchLectureDetail = async (id: number) => {
    if (!BASE_URL) {
      setError("API 서버 주소(.env)가 설정되어 있지 않습니다.");
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      setError("로그인이 필요합니다. 다시 로그인 후 이용해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/api/lectures/lectures/${id}`, {
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
      setLectureDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("Failed to fetch lecture detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLecture = async (appliedRole: "main" | "assist") => {
    if (!lectureDetail || !lectureId) return;

    const accessToken = getAccessToken();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsActionLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/lectures/applications/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          lecture: lectureId,
          applied_role: appliedRole,
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = "강의 신청에 실패했습니다.";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.detail ||
            errorData.message ||
            errorData.error ||
            errorMessage;
        } catch {
          errorMessage = `서버 오류 (${response.status})`;
        }

        throw new Error(errorMessage);
      }

      setApplicationSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "오류가 발생했습니다.");
      console.error("Failed to apply lecture:", err);
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleCancelLecture = async () => {
    if (!lectureDetail) return;

    const myApplicationId = getMyApplicationId();
    if (!myApplicationId) {
      alert("신청 정보를 찾을 수 없습니다.");
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsActionLoading(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/lectures/applications/${myApplicationId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = "강의 신청 취소에 실패했습니다.";

        try {
          const errorData = JSON.parse(responseText);
          errorMessage =
            errorData.detail === "No Application matches the given query."
              ? "신청 내역을 찾을 수 없습니다."
              : errorData.message ||
                errorData.error ||
                errorData.detail ||
                errorMessage;
        } catch {
          errorMessage = `서버 오류 (${response.status})`;
        }

        throw new Error(errorMessage);
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

  const handleApplicationModalClose = async () => {
    if (applicationSuccess) {
      window.location.reload();
    }
  };

  // ===== Render Guards =====
  if (!isOpen) return null;

  // ===== Render =====
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
                {/* 기본 정보 */}
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

                {/* 강사 액션 */}
                <Section>
                  <SectionTitle>강사 액션</SectionTitle>
                  <LectureActionButtons
                    status={lectureDetail.status}
                    myApplicationStatus={getMyApplicationStatus()}
                    isLoading={isActionLoading}
                    onApply={handleApplyLecture}
                    onCancel={() => setIsCancelModalOpen(true)}
                    onApplicationModalClose={handleApplicationModalClose}
                    lectureTitle={lectureDetail.title}
                    lectureId={lectureDetail.id}
                  />
                </Section>

                <Divider />

                {/* 강의 일정 */}
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

                {/* 모집 정보 */}
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

                {/* 강의 내용 */}
                {lectureDetail.content && (
                  <>
                    <Divider />
                    <Section>
                      <SectionTitle>강의 내용</SectionTitle>
                      <ContentBox>{lectureDetail.content}</ContentBox>
                    </Section>
                  </>
                )}

                {/* 특이사항 */}
                {lectureDetail.note && (
                  <>
                    <Divider />
                    <Section>
                      <SectionTitle>특이사항</SectionTitle>
                      <ContentBox>{lectureDetail.note}</ContentBox>
                    </Section>
                  </>
                )}

                {/* 첨부파일 */}
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

                {/* 확정 강사 */}
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

      {/* 취소 확인 모달 */}
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
// 💅 Styled Components
// =========================================================================
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
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
