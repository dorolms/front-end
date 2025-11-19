// src/app/manager/notices/components/SuccessModal.tsx
'use client';

import styled, { keyframes } from 'styled-components';
import ModalPortal from './ModalPortal';

// --- Check Icon ---
const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const popIn = keyframes` from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } `;

const Bg = styled.div`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3);
  display: flex; justify-content: center; align-items: center;
  z-index: 30000;
`;

const Box = styled.div`
  background: #fff; padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  animation: ${popIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 320px;
`;

const Message = styled.p`
  font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 8px 0 16px;
`;

const Button = styled.button`
  padding: 10px 32px;
  background: #1e293b; color: white;
  border: none; border-radius: 8px; font-weight: 600;
  cursor: pointer; transition: transform 0.1s;

  &:hover { transform: translateY(-1px); background: #0f172a; }
`;

type Props = { message: string; onClose: () => void; };

export default function SuccessModal({ message, onClose }: Props) {
  return (
    <ModalPortal rootId="success-modal-root">
      <Bg onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()}>
          <CheckIcon />
          <Message>{message}</Message>
          <Button onClick={onClose}>확인</Button>
        </Box>
      </Bg>
    </ModalPortal>
  );
}