// src/app/instructor/notices/components/NoticeModal.tsx
'use client';

import styled, { keyframes } from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

// --- Icons ---
const UserIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const ClockIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;
const slideUp = keyframes` from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } `;

const Bg = styled.div`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 20000; animation: ${fadeIn} 0.2s;
`;

const Box = styled.div`
  background: #fff; width: 600px; max-width: 90vw;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column;
  max-height: 85vh; overflow: hidden;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  padding: 32px 40px;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
  position: relative;

  h3 {
    font-size: 1.5rem; font-weight: 800; color: #1e293b;
    margin: 0 0 16px 0; line-height: 1.3;
    padding-right: 20px; /* 닫기 버튼 공간 확보 */
  }
`;

const CloseBtn = styled.button`
  position: absolute; top: 24px; right: 24px;
  background: #f8fafc; border: none; border-radius: 50%;
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  color: #64748b; cursor: pointer; transition: all 0.2s;

  &:hover { background: #e2e8f0; color: #1e293b; }
`;

const MetaRow = styled.div`
  display: flex; gap: 16px; font-size: 0.85rem; color: #64748b;

  div { display: flex; align-items: center; gap: 6px; }
  svg { color: #94a3b8; }
`;

const Content = styled.div`
  padding: 40px;
  font-size: 1rem; line-height: 1.7; color: #334155;
  white-space: pre-wrap; overflow-y: auto; flex: 1;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

const Footer = styled.div`
  padding: 20px 40px;
  border-top: 1px solid #f1f5f9;
  display: flex; justify-content: flex-end;
  background: #f8fafc;
`;

const ConfirmBtn = styled.button`
  padding: 10px 24px;
  background: #1e293b; color: white;
  border: none; border-radius: 8px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;

  &:hover { background: #0f172a; transform: translateY(-1px); }
`;

type Props = {
  notice: Notice;
  onClose: () => void;
};

export default function NoticeModal({ notice, onClose }: Props) {
  return (
    <ModalPortal>
      <Bg onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()}>
          <Header>
            <h3>{notice.title}</h3>
            <CloseBtn onClick={onClose}><CloseIcon /></CloseBtn>
            <MetaRow>
              <div><UserIcon /> {notice.author}</div>
              <div><ClockIcon /> {notice.createdAt}</div>
            </MetaRow>
          </Header>
          <Content>{notice.content}</Content>
          <Footer>
            <ConfirmBtn onClick={onClose}>닫기</ConfirmBtn>
          </Footer>
        </Box>
      </Bg>
    </ModalPortal>
  );
}