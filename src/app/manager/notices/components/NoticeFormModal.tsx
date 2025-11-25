'use client';

import { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ModalPortal from './ModalPortal';
import LinkModal from './LinkModal'; // 위에서 만든 모달 import
import type { Notice } from '../types';

export type NoticePayload = {
  title: string;
  content: string;
};

type Props = {
  initialData: Notice | null;
  onSubmit: (payload: NoticePayload) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
  isSubmitting: boolean;
};

/* -------------------- 아이콘 -------------------- */
const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

/* -------------------- 메인 컴포넌트 -------------------- */
export default function NoticeFormModal({
  initialData,
  onSubmit,
  onDelete,
  onClose,
  isSubmitting,
}: Props) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 링크 모달 관련 상태
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{start: number, end: number} | null>(null);

  // '링크 추가' 버튼 클릭 핸들러
  const handleOpenLinkModal = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // 드래그한 텍스트와 커서 위치 저장
      setSelectedText(textarea.value.slice(start, end));
      setSelectionRange({ start, end });
    }
    setIsLinkModalOpen(true);
  };

  // 링크 모달에서 '등록' 눌렀을 때 실행
  const handleInsertLinkConfirm = (linkText: string, linkUrl: string) => {
    if (!selectionRange) return;
    const { start, end } = selectionRange;

    // [문구](URL) 형태로 변환
    const markdownLink = `[${linkText}](${linkUrl})`;

    // 본문 중간에 삽입
    const newContent = content.slice(0, start) + markdownLink + content.slice(end);
    setContent(newContent);

    // 삽입 후 커서 위치 조정 및 포커스
    requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.focus();
            const newCursorPos = start + markdownLink.length;
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        }
    });
  };

  const handleSubmit = () => {
    if(!title.trim()) {
        alert('제목을 입력해주세요.');
        return;
    }
    onSubmit({ title, content });
  };

  return (
    <ModalPortal>
      <Bg onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()}>
          <Header>
            <h2>{initialData ? '공지사항 수정' : '새 공지사항 작성'}</h2>
          </Header>

          <Body>
            {/* 제목 입력 (Notion 스타일) */}
            <div>
              <TitleInput
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                autoFocus={!initialData}
              />
            </div>

            {/* 에디터 영역 */}
            <EditorContainer>
              <Toolbar>
                <ToolbarButton type="button" onClick={handleOpenLinkModal} title="링크 삽입">
                  <LinkIcon /> 링크 추가
                </ToolbarButton>
              </Toolbar>
              <ContentTextarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="여기에 공지 내용을 작성하세요..."
              />
            </EditorContainer>
          </Body>

          <Footer>
            <div style={{minWidth: '80px'}}>
              {initialData && (
                <DeleteButton onClick={() => {
                   if(confirm('정말 삭제하시겠습니까?')) onDelete(initialData.id);
                }}>
                  삭제하기
                </DeleteButton>
              )}
            </div>

            <ButtonGroup>
              <CancelButton onClick={onClose}>취소</CancelButton>
              <SaveButton onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? '저장 중...' : '완료'}
              </SaveButton>
            </ButtonGroup>
          </Footer>
        </Box>
      </Bg>

      {/* 링크 입력 모달 연결 */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onConfirm={handleInsertLinkConfirm}
        initialText={selectedText}
      />
    </ModalPortal>
  );
}

/* -------------------- 스타일 정의 -------------------- */
const fadeIn = keyframes`from{opacity:0;} to{opacity:1;}`;
const slideUp = keyframes`from{transform:translateY(15px) scale(0.98); opacity:0;} to{transform:translateY(0) scale(1); opacity:1;}`;

const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s ease-out;
  z-index: 20000;
`;

const Box = styled.div`
  width: 640px;
  max-width: 92vw;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  padding: 24px 32px 20px;
  border-bottom: 1px solid #f1f5f9;
  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }
`;

const Body = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  overflow-y: auto;
  max-height: 70vh;
`;

const TitleInput = styled.input`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  border: none;
  outline: none;
  background: transparent;
  &::placeholder { color: #cbd5e1; }
`;

const EditorContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s;
  overflow: hidden;
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Toolbar = styled.div`
  padding: 8px 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 8px;
`;

const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

const ContentTextarea = styled.textarea`
  width: 100%;
  min-height: 240px;
  padding: 16px;
  border: none;
  outline: none;
  font-size: 1rem;
  line-height: 1.6;
  color: #334155;
  resize: vertical;
  background: #fff;
  &::placeholder { color: #94a3b8; }
`;

const Footer = styled.div`
  padding: 20px 32px;
  border-top: 1px solid #f1f5f9;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const BaseButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const SaveButton = styled(BaseButton)`
  background: #3b82f6;
  color: white;
  border: none;
  &:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }
`;

const CancelButton = styled(BaseButton)`
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  &:hover:not(:disabled) {
    background: #f8fafc;
    color: #475569;
  }
`;

const DeleteButton = styled(BaseButton)`
  background: transparent;
  color: #ef4444;
  border: 1px solid transparent;
  padding: 10px 12px;

  &:hover {
    background: #fef2f2;
    color: #dc2626;
  }
`;