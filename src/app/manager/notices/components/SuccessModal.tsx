'use client';
/**
 * SuccessModal.tsx (완료 알림 모달)
 * - 공지 등록/수정 완료 시 띄우는 간단한 확인 모달.
 * - 부모로부터 message를 받아 표시하고, '완료' 클릭 시 onClose 호출.
 * - Pretendard 폰트 및 세련된 디자인 적용.
 */

import styled from 'styled-components';
import ModalPortal from './ModalPortal';

// --- Styled-Components ---
const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30000;
`;

const Box = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 40px 50px;
  min-width: 400px;
  text-align: center;
  border-radius: 4px;
  font-family: 'Pretendard', sans-serif;

  p {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 24px 0;
  }

  button {
    padding: 10px 32px;
    font-size: 1rem;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: inherit;
    font-weight: 500;

    &:hover { background: #e0e0e0; }
  }
`;
// --- (End) Styled-Components ---

type Props = {
  /** 모달에 표시될 메시지 (e.g., "공지가 수정되었습니다.") */
  message: string;
  /** '완료' 버튼 또는 배경 클릭 시 호출될 함수 */
  onClose: () => void;
};

export default function SuccessModal({ message, onClose }: Props) {
  return (
    <ModalPortal rootId="success-modal-root">
      <Bg onClick={onClose} role="alertdialog" aria-modal="true">
        <Box onClick={(e) => e.stopPropagation()}>
          <p>{message}</p>
          <button onClick={onClose}>완료</button>
        </Box>
      </Bg>
    </ModalPortal>
  );
}