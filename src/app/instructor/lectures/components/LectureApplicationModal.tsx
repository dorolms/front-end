// src/app/instructor/lectures/components/LectureApplicationModal.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import type { LectureDetail } from "../types";

interface LectureApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // role 하나씩 넘기면, 모달이 필요할 때 여러 번 호출해줌
  onSubmit: (appliedRole: "main" | "assist") => Promise<void>;
  lectureId: number | null;
}

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const LectureApplicationModal: React.FC<LectureApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lectureId,
}) => {
  // ─── State들 (항상 최상단에서 고정 순서로 호출) ─────────────────
  const [lectureDetail, setLectureDetail] = useState<LectureDetail | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [selectedMain, setSelectedMain] = useState(false);
  const [selectedAssist, setSelectedAssist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ─── 강의 상세 조회 ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !lectureId) return;

    const fetchDetail = async () => {
      try {
        setDetailLoading(true);
        setDetailError(null);

        const accessToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : "";

        const res = await fetch(
          `${baseUrl}/api/lectures/lectures/${lectureId}/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error(`강의 상세 조회 실패 (status: ${res.status})`);
        }

        const data = (await res.json()) as LectureDetail;
        setLectureDetail(data);
      } catch (e: any) {
        console.error(e);
        setDetailError(e?.message ?? "강의 정보를 불러오지 못했습니다.");
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [isOpen, lectureId]);

  // ─── 내부 상태 초기화 ───────────────────────────────────────────
  const resetState = () => {
    setSelectedMain(false);
    setSelectedAssist(false);
    setLectureDetail(null);
    setDetailError(null);
    setDetailLoading(false);
  };

  // ─── 신청 버튼 클릭 ─────────────────────────────────────────────
  const handleSubmit = async () => {
    const roles: ("main" | "assist")[] = [];
    if (selectedMain) roles.push("main");
    if (selectedAssist) roles.push("assist");

    if (roles.length === 0) return; // 아무것도 선택 안 되어 있으면 무시

    setIsSubmitting(true);
    try {
      // 선택된 역할들만 순서대로 POST
      for (const role of roles) {
        await onSubmit(role);
      }
      setShowSuccessModal(true);
    } catch (error) {
      console.error("신청 중 오류 발생:", error);
      alert("신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── 성공 모달 닫기 ─────────────────────────────────────────────
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    resetState();
    onClose();
  };

  // 🔒 isOpen=false & 성공 모달도 아닐 때는 렌더 X
  if (!isOpen && !showSuccessModal) {
    return null;
  }

  // ─── 신청 완료 모달 ─────────────────────────────────────────────
  if (showSuccessModal) {
    return (
      <ModalOverlay onClick={handleSuccessClose}>
        <SuccessModalContent onClick={(e) => e.stopPropagation()}>
          <SuccessTitle>✓</SuccessTitle>
          <SuccessMessage>강의 신청이 완료되었습니다.</SuccessMessage>
          <SuccessButton onClick={handleSuccessClose}>확인</SuccessButton>
        </SuccessModalContent>
      </ModalOverlay>
    );
  }

  // ─── 역할 선택 모달 ─────────────────────────────────────────────
  return (
    <ModalOverlay
      onClick={() => {
        resetState();
        onClose();
      }}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>강의 신청</ModalTitle>

        <LectureInfo>
          {detailLoading && <InfoText>강의 정보를 불러오는 중...</InfoText>}
          {detailError && (
            <InfoText style={{ color: "#DC2626" }}>{detailError}</InfoText>
          )}
        </LectureInfo>

        <SectionTitle>신청 분야(중복 신청 가능)</SectionTitle>

        <RoleOptions>
          <RoleOption
            selected={selectedMain}
            onClick={() => setSelectedMain((prev) => !prev)}>
            <Checkbox checked={selectedMain}>
              {selectedMain && <CheckIcon>✓</CheckIcon>}
            </Checkbox>
            <RoleLabel>주 도로 쌤</RoleLabel>
          </RoleOption>

          <RoleOption
            selected={selectedAssist}
            onClick={() => setSelectedAssist((prev) => !prev)}>
            <Checkbox checked={selectedAssist}>
              {selectedAssist && <CheckIcon>✓</CheckIcon>}
            </Checkbox>
            <RoleLabel>보조 도로 쌤</RoleLabel>
          </RoleOption>
        </RoleOptions>

        <SubmitButton
          onClick={handleSubmit}
          disabled={(!selectedMain && !selectedAssist) || isSubmitting}>
          {isSubmitting ? "신청 중..." : "신청하기"}
        </SubmitButton>
      </ModalContent>
    </ModalOverlay>
  );
};

// ─── Styled Components ─────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 24px;
  color: #1f2937;
`;

const LectureInfo = styled.div`
  margin-bottom: 20px;
`;

const InfoLabel = styled.div`
  font-size: 14px;
  color: #374151;
  margin-bottom: 8px;
  line-height: 1.5;
`;

const InfoText = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 12px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 24px 0;
`;

const SectionTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
`;

const RoleOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const RoleOption = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: ${(props) => (props.selected ? "#EFF6FF" : "transparent")};
  border: 2px solid ${(props) => (props.selected ? "#3B82F6" : "transparent")};

  &:hover {
    background-color: ${(props) => (props.selected ? "#EFF6FF" : "#F9FAFB")};
  }
`;

const Checkbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.checked ? "#3B82F6" : "#D1D5DB")};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.checked ? "#3B82F6" : "white")};
  transition: all 0.2s;
`;

const CheckIcon = styled.span`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const RoleLabel = styled.span`
  font-size: 15px;
  color: #374151;
`;

const NoteSection = styled.div`
  margin-bottom: 24px;
`;

const NoteTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
`;

const NoteText = styled.div`
  font-size: 14px;
  color: #6b7280;
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 14px;
  background-color: ${(props) => (props.disabled ? "#93C5FD" : "#10B981")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#93C5FD" : "#059669")};
  }
`;

// 성공 모달 스타일
const SuccessModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 48px 32px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const SuccessTitle = styled.div`
  font-size: 48px;
  color: #10b981;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 32px;
`;

const SuccessButton = styled.button`
  padding: 12px 48px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

export default LectureApplicationModal;
