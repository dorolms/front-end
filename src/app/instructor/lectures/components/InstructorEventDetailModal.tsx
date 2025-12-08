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
// 🎨 Icons
// =========================================================================
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const DollarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const LinkIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

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
    <Backdrop onClick={onClose}>
      <ConfirmModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseBtn onClick={onClose}>
            <CloseIcon />
          </CloseBtn>
        </ModalHeader>
        <ConfirmModalBody>
          <ConfirmMessage>{message}</ConfirmMessage>
          <ConfirmButtonGroup>
            <CancelButton onClick={onClose} disabled={isLoading}>
              취소
            </CancelButton>
            <ConfirmButton onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "처리 중..." : confirmText}
            </ConfirmButton>
          </ConfirmButtonGroup>
        </ConfirmModalBody>
      </ConfirmModalBox>
    </Backdrop>
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

  // 날짜 포맷 함수
  const formatTimeRange = (date: string, start: string, end: string) => {
    const d = new Date(date);
    const dateStr = `${d.getFullYear()}년 ${
      d.getMonth() + 1
    }월 ${d.getDate()}일`;
    return `${dateStr} | ${start.substring(0, 5)} ~ ${end.substring(0, 5)}`;
  };

  // ===== Render =====
  return (
    <>
      <Backdrop onClick={onClose}>
        <ModalBox onClick={(e) => e.stopPropagation()}>
          <Header>
            <TitleArea>
              <Badges>
                <Badge $bg="#eff6ff" $color="#3b82f6">
                  {getTypeLabel(lectureDetail?.type || "")}
                </Badge>
                {lectureDetail && (
                  <Badge
                    $bg={
                      lectureDetail.status === "RECRUITING"
                        ? "#eff6ff"
                        : lectureDetail.status === "ALLOCATING"
                        ? "#FEF3C7"
                        : "#f3f4f6"
                    }
                    $color={
                      lectureDetail.status === "RECRUITING"
                        ? "#3b82f6"
                        : lectureDetail.status === "ALLOCATING"
                        ? "#92400E"
                        : "#4b5563"
                    }>
                    {getStatusLabel(lectureDetail.status)}
                  </Badge>
                )}
              </Badges>
              <h2>{lectureDetail?.title || "강의 정보"}</h2>
            </TitleArea>
            <CloseBtn onClick={onClose}>
              <CloseIcon />
            </CloseBtn>
          </Header>

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
                {/* 강사 액션 버튼 */}
                <Section>
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

                {/* 강의 일정 */}
                <Section>
                  <SectionLabel>
                    <ClockIcon /> 강의 일정
                  </SectionLabel>
                  <ScheduleList>
                    {lectureDetail.schedules.map((sch) => (
                      <ScheduleItem key={sch.id}>
                        {formatTimeRange(sch.date, sch.start_time, sch.end_time)}
                      </ScheduleItem>
                    ))}
                  </ScheduleList>
                </Section>

                {/* 장소 & 대상/정원 */}
                <GridRow>
                  <Section>
                    <SectionLabel>
                      <MapPinIcon /> 강의 장소
                    </SectionLabel>
                    <ContentBox>{lectureDetail.location}</ContentBox>
                  </Section>
                  <Section>
                    <SectionLabel>
                      <UsersIcon /> 대상 / 정원
                    </SectionLabel>
                    <ContentBox>
                      {lectureDetail.target} / {lectureDetail.capacity}
                    </ContentBox>
                  </Section>
                </GridRow>

                {/* 강의료 */}
                <Section>
                  <SectionLabel>
                    <DollarIcon /> 강의료
                  </SectionLabel>
                  <ContentBox style={{ fontWeight: 700 }}>
                    {lectureDetail.fee}
                  </ContentBox>
                </Section>

                {/* 모집 정보 */}
                <Section>
                  <SectionLabel>
                    <CalendarIcon /> 모집 정보
                  </SectionLabel>
                  <ContentBox>
                    모집 마감: {lectureDetail.end_date}
                    <br />
                    모집 인원: 메인 {lectureDetail.recruitment_main}명 / 보조{" "}
                    {lectureDetail.recruitment_assist}명
                  </ContentBox>
                </Section>

                {/* 강의 내용 */}
                {lectureDetail.content && (
                  <Section>
                    <SectionLabel>
                      <FileTextIcon /> 강의 내용
                    </SectionLabel>
                    <ContentBox>{lectureDetail.content}</ContentBox>
                  </Section>
                )}

                {/* 특이사항 */}
                {lectureDetail.note && (
                  <Section>
                    <SectionLabel>
                      <FileTextIcon /> 특이 사항
                    </SectionLabel>
                    <ContentBox>{lectureDetail.note}</ContentBox>
                  </Section>
                )}

                {/* 첨부파일 */}
                {lectureDetail.attachment_url && (
                  <Section>
                    <SectionLabel>
                      <LinkIcon /> 첨부 파일
                    </SectionLabel>
                    <ContentBox>
                      <LinkText
                        href={lectureDetail.attachment_url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {lectureDetail.attachment_url}
                      </LinkText>
                    </ContentBox>
                  </Section>
                )}

                {/* 확정 강사 */}
                {lectureDetail.confirmed_instructors.length > 0 && (
                  <Section>
                    <SectionLabel>
                      <UsersIcon /> 확정 강사
                    </SectionLabel>
                    <ContentBox>
                      {lectureDetail.confirmed_instructors.length}명 확정
                    </ContentBox>
                  </Section>
                )}
              </>
            )}
          </ModalBody>
        </ModalBox>
      </Backdrop>

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
const fadeIn = keyframes`
  from { opacity: 0; } to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  width: 500px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e5e5;
    border-radius: 3px;
  }
`;

const ConfirmModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  width: 400px;
  max-width: 90vw;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    color: #111;
    line-height: 1.3;
  }
`;

const Badges = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const Badge = styled.span<{ $bg: string; $color: string }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background-color: ${(props) => props.$bg};
  color: ${(props) => props.$color};
`;

const CloseBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    color: #111;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0;
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ConfirmModalBody = styled.div`
  padding: 24px;
`;

const ConfirmMessage = styled.p`
  margin: 0 0 24px 0;
  color: #374151;
  font-size: 15px;
  line-height: 1.6;
`;

const ConfirmButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  svg {
    color: #cbd5e1;
  }
`;

const ContentBox = styled.div`
  background: #fff;
  border: 1px solid #f1f5f9;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
`;

const GridRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const LinkText = styled.a`
  color: #2563eb;
  text-decoration: underline;
  word-break: break-all;
  
  &:hover {
    color: #1d4ed8;
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

export default InstructorEventDetailModal;