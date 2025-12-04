import React, { useState } from 'react';
import styled from 'styled-components';

interface LectureApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appliedRole: 'main' | 'assist') => Promise<void>;
  lectureTitle?: string;
}

const LectureApplicationModal: React.FC<LectureApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lectureTitle,
}) => {
  const [selectedRole, setSelectedRole] = useState<'main' | 'assist' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (!isOpen && !showSuccessModal) return null;

  const handleSubmit = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);
    try {
      await onSubmit(selectedRole);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('신청 중 오류 발생:', error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSelectedRole(null);
    onClose();
  };

  // 신청 완료 모달
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

  // 역할 선택 모달
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitle>강의 신청</ModalTitle>

        <LectureInfo>
          {lectureTitle && (
            <>
              <InfoLabel>강의명</InfoLabel>
              <InfoText>{lectureTitle}</InfoText>
            </>
          )}
          <InfoLabel>강의명 슬기초등학교 대학생 멘토와 함께하는 AI로봇 토요 캠프</InfoLabel>
          <InfoText>일시 9월 13일, 20일(토요일) (2달 운영, 총 7h)</InfoText>
        </LectureInfo>

        <Divider />

        <SectionTitle>신청 분야(중복 신청 가능)</SectionTitle>

        <RoleOptions>
          <RoleOption
            selected={selectedRole === 'main'}
            onClick={() => setSelectedRole('main')}
          >
            <Checkbox checked={selectedRole === 'main'}>
              {selectedRole === 'main' && <CheckIcon>✓</CheckIcon>}
            </Checkbox>
            <RoleLabel>주 도로 쌤</RoleLabel>
          </RoleOption>

          <RoleOption
            selected={selectedRole === 'assist'}
            onClick={() => setSelectedRole('assist')}
          >
            <Checkbox checked={selectedRole === 'assist'}>
              {selectedRole === 'assist' && <CheckIcon>✓</CheckIcon>}
            </Checkbox>
            <RoleLabel>보조 도로 쌤</RoleLabel>
          </RoleOption>
        </RoleOptions>

        <NoteSection>
          <NoteTitle>비고</NoteTitle>
          <NoteText>문의: DORO 운영팀 (010-1234-5678)</NoteText>
        </NoteSection>

        <Divider />

        <SubmitButton
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
        >
          {isSubmitting ? '신청 중...' : '신청하기'}
        </SubmitButton>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
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
  z-index: 1100;  /* ✅ 1000 → 1100으로 변경! */
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
  background-color: ${(props) => (props.selected ? '#EFF6FF' : 'transparent')};
  border: 2px solid ${(props) => (props.selected ? '#3B82F6' : 'transparent')};

  &:hover {
    background-color: ${(props) => (props.selected ? '#EFF6FF' : '#F9FAFB')};
  }
`;

const Checkbox = styled.div<{ checked: boolean }>`
  width: 20px;
  height: 20px;
  border: 2px solid ${(props) => (props.checked ? '#3B82F6' : '#D1D5DB')};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.checked ? '#3B82F6' : 'white')};
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
  background-color: ${(props) => (props.disabled ? '#93C5FD' : '#10B981')};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.disabled ? '#93C5FD' : '#059669')};
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