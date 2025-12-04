import React from 'react';
import styled from 'styled-components';

interface ActionButtonsProps {
  status: string;
  myApplicationStatus: string | null;
  onOpenApplyModal: () => void;
  onOpenCancelModal: () => void;
}

/**
 * 💡 강의 신청 상태에 따른 액션 버튼 컴포넌트
 * @param status 강의 모집 상태 (RECRUITING, ALLOCATING, COMPLETED 등)
 * @param myApplicationStatus 강사의 신청 상태 (null, pending 등)
 * @param onOpenApplyModal 신청 모달 열기 핸들러
 * @param onOpenCancelModal 취소 모달 열기 핸들러
 */
const LectureActionButtons: React.FC<ActionButtonsProps> = ({
  status,
  myApplicationStatus,
  onOpenApplyModal,
  onOpenCancelModal,
}) => {
  // 1. 모집 중 (RECRUITING)
  if (status === 'RECRUITING') {
    // 1-1. 신청 가능: my_application_status가 null
    if (myApplicationStatus === null) {
      return (
        <ActionButtonsContainer>
          <ActionButton primary onClick={onOpenApplyModal}>
            신청하기
          </ActionButton>
        </ActionButtonsContainer>
      );
    }
    // 1-2. 신청 대기: my_application_status가 pending
    if (myApplicationStatus === 'pending') {
      return (
        <ActionButtonsContainer>
          <ActionButton onClick={onOpenCancelModal}>
            취소하기
          </ActionButton>
        </ActionButtonsContainer>
      );
    }
  }

  // 2. 배정 중/완료 (ALLOCATING, COMPLETED)
  if (status === 'ALLOCATING' || status === 'COMPLETED' || status === 'COMPETITION') {
    // 2-1. 신청 완료: my_application_status가 null이 아님 (배정 완료 상태 포함)
    if (myApplicationStatus !== null) {
      return (
        <ActionButtonsContainer>
          <StatusText complete>신청 완료</StatusText>
        </ActionButtonsContainer>
      );
    }
    // 2-2. 마감: my_application_status가 null
    if (myApplicationStatus === null) {
      return (
        <ActionButtonsContainer>
          <StatusText disabled>마감</StatusText>
        </ActionButtonsContainer>
      );
    }
  }

  // 기본 상태 (모든 케이스에 해당하지 않을 경우)
  return (
    <ActionButtonsContainer>
      <StatusText disabled>상태 확인 불가</StatusText>
    </ActionButtonsContainer>
  );
};

// =========================================================================
// 💅 스타일 컴포넌트
// =========================================================================

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const ActionButton = styled.button<{ primary?: boolean }>`
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${(props) =>
    props.primary
      ? `
    background-color: #3B82F6;
    color: white;
    &:hover {
      background-color: #2563EB;
    }
  `
      : `
    background-color: #F3F4F6;
    color: #4B5563;
    &:hover {
      background-color: #E5E7EB;
    }
  `}
`;

const StatusText = styled.div<{ complete?: boolean; disabled?: boolean }>`
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;

  ${(props) =>
    props.complete
      ? `
    background-color: #D1FAE5; /* Green Light */
    color: #065F46; /* Green Dark */
  `
      : props.disabled
      ? `
    background-color: #F3F4F6; /* Gray Light */
    color: #6B7280; /* Gray Normal */
  `
      : ''}
`;

export default LectureActionButtons;