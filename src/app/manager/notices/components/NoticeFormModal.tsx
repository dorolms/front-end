'use client';
/**
 * NoticeFormModal.tsx
 * 디자인 업그레이드: 더 부드러운 입력창, 명확한 버튼 계층 구조
 */

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

export type NoticePayload = {
  title: string;
  content: string;
};

// --- Styled-Components (Design Upgrade) ---
const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5); /* 배경을 조금 더 진하게 */
  backdrop-filter: blur(2px); /* 뒤쪽 배경을 살짝 흐리게 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
`;

const Box = styled.div`
  background: #fff;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 90%;
  max-width: 560px;
  border-radius: 16px; /* 모서리를 더 둥글게 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: popUp 0.3s ease-out;

  @keyframes popUp {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const FormBody = styled.div`
  padding: 40px 32px 32px; /* 상단 여백 확보 */
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-size: 0.85rem;
    font-weight: 700;
    color: #666;
    margin-left: 4px; /* 라벨 살짝 들여쓰기 */
  }

  /* 입력창 스타일 모던하게 변경 */
  input,
  textarea {
    padding: 16px;
    background-color: #f8f9fa; /* 연한 회색 배경 */
    border: 1px solid transparent; /* 평소엔 테두리 없음 */
    border-radius: 12px;
    font-size: 1rem;
    font-family: inherit;
    color: #333;
    transition: all 0.2s;

    &::placeholder {
      color: #aaa;
    }

    &:focus {
      outline: none;
      background-color: #fff;
      border-color: #333; /* 포커스 시 진한 테두리 */
      box-shadow: 0 0 0 3px rgba(0,0,0,0.05); /* 부드러운 그림자 */
    }
  }
  textarea {
    min-height: 240px;
    resize: none; /* 사용자 크기 조절 막기 (깔끔하게) */
    line-height: 1.6;
  }
`;

const Ftr = styled.div`
  padding: 24px 32px;
  /* background: #f9f9f9;  <- 하단 배경색 제거하고 깔끔하게 흰색으로 */
  border-top: 1px solid #f1f1f1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    padding: 12px 28px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  /* 삭제 버튼: 텍스트만 있는 것보다 은은한 빨간색이 더 안전해 보임 */
  button.delete {
    background-color: #fff0f0;
    color: #d32f2f;
    border: none;
    &:hover {
      background-color: #ffe0e0;
    }
  }

  /* 등록 버튼: 검정색 유지하되 쉐도우 추가 */
  button.submit {
    background-color: #222;
    color: #fff;
    border: none;
    margin-left: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);

    &:hover:not(:disabled) {
      background-color: #000;
      transform: translateY(-1px);
    }
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
`;

// --- (Logic은 그대로) ---
type Props = {
  initialData: Notice | null;
  onSubmit: (data: NoticePayload) => void;
  onClose: () => void;
  onDelete?: (id: number) => void;
  isSubmitting: boolean;
};

export default function NoticeFormModal({
  initialData,
  onSubmit,
  onClose,
  onDelete,
  isSubmitting,
}: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    onSubmit({ title, content });
  };

  const handleDeleteClick = () => {
    if (!initialData || !onDelete) return;
    const isConfirmed = window.confirm('정말로 이 공지를 삭제하시겠습니까?');
    if (isConfirmed) {
      onDelete(initialData.id);
    }
  };

  return (
    <ModalPortal rootId="form-modal-root">
      <Bg onClick={onClose} role="dialog" aria-modal="true">
        <Box onClick={(e) => e.stopPropagation()}>
          <Form onSubmit={handleSubmit}>
            <FormBody>
              {/* 상단 헤더 느낌으로 제목 배치 */}
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: 700 }}>
                {isEditMode ? '공지 수정하기' : '새 공지 작성하기'}
              </h2>

              <FormGroup>
                <label htmlFor="notice-title">제목</label>
                <input
                  id="notice-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="공지 제목을 입력해주세요"
                  autoComplete="off"
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="notice-content">내용</label>
                <textarea
                  id="notice-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="공지 내용을 상세히 입력해주세요"
                  required
                />
              </FormGroup>
            </FormBody>

            <Ftr>
              {isEditMode && (
                <button type="button" className="delete" onClick={handleDeleteClick}>
                  삭제하기
                </button>
              )}
              <button type="submit" className="submit" disabled={isSubmitting}>
                {isEditMode ? '수정 완료' : '등록하기'}
              </button>
            </Ftr>
          </Form>
        </Box>
      </Bg>
    </ModalPortal>
  );
}