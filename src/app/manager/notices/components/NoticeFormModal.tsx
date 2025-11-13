'use client';
/**
 * NoticeFormModal.tsx (작성/수정 폼 모달)
 * - 매니저가 공지를 '생성'하거나 '수정'할 때 사용되는 폼 모달.
 * - initialData prop 유무에 따라 '생성'/'수정' 모드가 결정됨.
 * - 폼 제출(onSubmit) 시 폼 데이터를 상위(ClientPage)로 전달.
 * - Pretendard 폰트 및 세련된 폼 디자인 적용.
 */

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

/** 폼 제출 시 부모로 전달될 데이터 타입 */
export type NoticePayload = {
  title: string;
  content: string;
};

// --- Styled-Components ---
const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
`;

const Box = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 90%;
  max-width: 750px;
  padding: 32px 40px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const FormBody = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;

  label {
    display: block;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  input,
  textarea {
    width: 100%;
    padding: 10px 4px;
    border: none;
    border-bottom: 2px solid #ddd;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: inherit;
    font-size: 1.1rem;
    color: #555;

    &::placeholder { color: #aaa; }
    &:focus {
      outline: none;
      border-bottom-color: #555;
    }
  }

  textarea {
    font-size: 1rem;
    line-height: 1.6;
    min-height: 350px;
    resize: vertical;
  }
`;

const Ftr = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 10px 24px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: inherit;
    font-weight: 500;
    background: #f0f0f0;
    color: #333;

    &:hover { background: #e0e0e0; }
  }
`;
// --- (End) Styled-Components ---

type Props = {
  /** '수정' 모드일 때 폼을 채울 초기 데이터. '생성' 모드일 때는 null. */
  initialData: Notice | null;
  /** API 호출 중인지 여부 (버튼 비활성화용) */
  isSubmitting: boolean;
  /** '등록'/'수정' 버튼 클릭 시 { title, content }를 전달할 콜백 함수 */
  onSubmit: (payload: NoticePayload) => void;
  /** '취소' 또는 배경 클릭 시 호출될 함수 */
  onClose: () => void;
};

export default function NoticeFormModal({
  initialData,
  isSubmitting,
  onSubmit,
  onClose,
}: Props) {
  // 1. 폼 입력을 위한 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 2. 모드 확인
  const isEditMode = !!initialData;

  // 3. Effect: '수정' 모드로 열릴 때 폼을 채움
  useEffect(() => {
    if (isEditMode) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData, isEditMode]);

  // 4. 핸들러: 폼 제출 시
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !title || !content) return;
    onSubmit({ title, content });
  };

  return (
    <ModalPortal rootId="form-modal-root">
      <Bg onClick={onClose} role="dialog" aria-modal="true">
        <Box onClick={(e) => e.stopPropagation()}>
          <Form onSubmit={handleSubmit}>
            <FormBody>
              <FormGroup>
                <label htmlFor="notice-title">제목을 입력하세요.</label>
                <input
                  id="notice-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력해 주세요."
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="notice-content">내용을 입력하세요.</label>
                <textarea
                  id="notice-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="공지 내용을 입력해 주세요."
                  required
                />
              </FormGroup>
            </FormBody>

            <Ftr>
              <button type="button" className="cancel" onClick={onClose}>
                취소
              </button>
              <button type="submit" className="submit" disabled={isSubmitting}>
                {isEditMode ? '수정' : '등록'}
              </button>
            </Ftr>
          </Form>
        </Box>
      </Bg>
    </ModalPortal>
  );
}