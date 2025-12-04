import React, { useState } from 'react';
import styled from 'styled-components';
import LectureApplicationModal from './LectureApplicationModal';

interface ActionButtonsProps {
  status: string | null | undefined;
  myApplicationStatus: string | null | undefined;
  isLoading?: boolean;
  onApply: (appliedRole: 'main' | 'assist') => Promise<void>;
  onCancel: () => void;
  onApplicationModalClose?: () => void; // ✅ 새로 추가!
  lectureTitle?: string;
}

const LectureActionButtons: React.FC<ActionButtonsProps> = ({
  status,
  myApplicationStatus,
  isLoading = false,
  onApply,
  onCancel,
  onApplicationModalClose,
  lectureTitle,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizedStatus = (() => {
    if (status == null) return null;
    return String(status).trim().toUpperCase();
  })();

  const normalizedMyStatus = (() => {
    if (myApplicationStatus == null) return null;
    return String(myApplicationStatus).trim().toLowerCase();
  })();

  const handleApplyClick = () => {
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (appliedRole: 'main' | 'assist') => {
    await onApply(appliedRole);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // ✅ 모달이 닫힐 때 부모에게 알림
    if (onApplicationModalClose) {
      onApplicationModalClose();
    }
  };

  // 0. status가 null/undefined
  if (normalizedStatus === null) {
    return (
      <ActionButtonsContainer>
        <StatusText disabled>강의 상태 확인 불가</StatusText>
      </ActionButtonsContainer>
    );
  }

  // 1. RECRUITING (모집 중)
  if (normalizedStatus === 'RECRUITING') {
    if (normalizedMyStatus === null) {
      return (
        <>
          <ActionButtonsContainer>
            <ActionButton $primary onClick={handleApplyClick} disabled={isLoading}>
              {isLoading ? '신청 중...' : '신청하기'}
            </ActionButton>
          </ActionButtonsContainer>
          <LectureApplicationModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
            lectureTitle={lectureTitle}
          />
        </>
      );
    }

    if (normalizedMyStatus === 'pending') {
      return (
        <ActionButtonsContainer>
          <ActionButton onClick={onCancel} disabled={isLoading}>
            {isLoading ? '취소 중...' : '취소하기'}
          </ActionButton>
        </ActionButtonsContainer>
      );
    }

    if (normalizedMyStatus === 'assigned') {
      return (
        <ActionButtonsContainer>
          <StatusText complete>배정됨</StatusText>
        </ActionButtonsContainer>
      );
    }

    if (normalizedMyStatus === 'rejected') {
      return (
        <ActionButtonsContainer>
          <StatusText rejected>거절됨</StatusText>
        </ActionButtonsContainer>
      );
    }
  }

  // 2. ALLOCATING / COMPLETED
  if (normalizedStatus === 'ALLOCATING' || normalizedStatus === 'COMPLETED') {
    if (normalizedMyStatus === null) {
      return (
        <ActionButtonsContainer>
          <StatusText disabled>마감</StatusText>
        </ActionButtonsContainer>
      );
    }

    if (normalizedMyStatus === 'pending') {
      return (
        <ActionButtonsContainer>
          <StatusText complete>신청 완료</StatusText>
        </ActionButtonsContainer>
      );
    }

    if (normalizedMyStatus === 'assigned') {
      return (
        <ActionButtonsContainer>
          <StatusText complete>배정됨</StatusText>
        </ActionButtonsContainer>
      );
    }

    if (normalizedMyStatus === 'rejected') {
      return (
        <ActionButtonsContainer>
          <StatusText rejected>거절됨</StatusText>
        </ActionButtonsContainer>
      );
    }
  }

  // 3. 그 외 이상한 값
  return (
    <ActionButtonsContainer>
      <StatusText disabled>상태 확인 불가</StatusText>
    </ActionButtonsContainer>
  );
};

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const ActionButton = styled.button<{ $primary?: boolean; disabled?: boolean }>`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.$primary
      ? `
    background-color: ${props.disabled ? '#93C5FD' : '#3B82F6'};
    color: white;
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
    &:hover { background-color: ${props.disabled ? '#93C5FD' : '#2563EB'}; }
  `
      : `
    background-color: ${props.disabled ? '#E5E7EB' : '#F3F4F6'};
    color: #4B5563;
    cursor: ${props.disabled ? 'not-allowed' : 'pointer'};
    &:hover { background-color: ${props.disabled ? '#E5E7EB' : '#E5E7EB'}; }
  `}
`;

const StatusText = styled.div<{
  complete?: boolean;
  disabled?: boolean;
  rejected?: boolean;
}>`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;

  ${(props) =>
    props.complete
      ? `
    background-color: #D1FAE5;
    color: #065F46;
  `
      : props.rejected
      ? `
    background-color: #FEE2E2;
    color: #991B1B;
  `
      : props.disabled
      ? `
    background-color: #F3F4F6;
    color: #6B7280;
  `
      : ''}
`;

export default LectureActionButtons;