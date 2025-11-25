'use client';

import styled, { keyframes } from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

/* --- Markdown 링크 파싱 함수 --- */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseContent(text: string): string {
  let parsed = escapeHtml(text);

  // 1. Markdown 링크 변환: [텍스트](URL) -> <a href="URL">텍스트</a>
  parsed = parsed.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="link-highlight">$1</a>'
  );

  // 2. 일반 URL 텍스트도 링크로 변환 (Markdown 처리가 안 된 나머지)
  parsed = parsed.replace(
    /(?<!href="|">)(https?:\/\/[^\s\<]+)/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link-url">${url}</a>`
  );

  return parsed;
}

/* --- 아이콘 --- */
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

type Props = {
  notice: Notice;
  onClose: () => void;
  onEdit: () => void;
};

export default function NoticeModal({ notice, onClose, onEdit }: Props) {
  return (
    <ModalPortal>
      <Bg onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()}>
          <Header>
            <h3>{notice.title}</h3>
            <MetaRow>
              <div>
                <UserIcon /> {notice.author}
              </div>
              <div>
                <ClockIcon /> {notice.createdAt}
              </div>
            </MetaRow>
          </Header>

          {/* 링크 변환 적용된 내용 출력 */}
          <Content
            dangerouslySetInnerHTML={{ __html: parseContent(notice.content) }}
          />

          <Footer>
            <EditButton onClick={onEdit}>수정하기</EditButton>
          </Footer>
        </Box>
      </Bg>
    </ModalPortal>
  );
}

/* --- 스타일 --- */
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`
  from { transform: translateY(20px) scale(0.95); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
`;

const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
  animation: ${fadeIn} 0.25s ease-out;
`;

const Box = styled.div`
  background: #fff;
  width: 640px;
  max-width: 90vw;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  overflow: hidden;
  animation: ${slideUp} 0.35s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  padding: 40px 40px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f8fafc;

  h3 {
    font-size: 1.75rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 16px 0;
    line-height: 1.3;
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: #64748b;
  align-items: center;

  div {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #f1f5f9;
    padding: 4px 10px;
    border-radius: 20px;
    font-weight: 500;
  }
  svg { color: #94a3b8; }
`;

const Content = styled.div`
  padding: 40px;
  font-size: 1.05rem;
  line-height: 1.75;
  color: #334155;
  white-space: pre-wrap;
  overflow-y: auto;
  flex: 1;

  a {
    color: #2563eb;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    font-weight: 500;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: #2563eb;
    }

    &.link-url {
       color: #64748b;
       font-size: 0.9em;
       text-decoration: underline;
    }
  }
`;

const Footer = styled.div`
  padding: 24px 40px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  background: #f8fafc;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0f172a;
  font-size: 0.95rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05);
  transition: all 0.2s ease;

  &:hover {
    background: #ffffff;
    border-color: #3b82f6;
    color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
`;