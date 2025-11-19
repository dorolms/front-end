// src/app/manager/notices/components/NoticeFormModal.tsx
'use client';

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;
const slideUp = keyframes` from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } `;

const Bg = styled.div`
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 20000; animation: ${fadeIn} 0.2s;
`;

const Box = styled.div`
  background: #fff; width: 580px; max-width: 90vw;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex; flex-direction: column;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Form = styled.form`
  display: flex; flex-direction: column; height: 100%;
`;

const FormBody = styled.div`
  padding: 32px; display: flex; flex-direction: column; gap: 24px;

  h2 {
    margin: 0 0 8px 0; font-size: 1.3rem; font-weight: 800; color: #1e293b;
  }
`;

const Label = styled.label`
  font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 8px; display: block;
`;

const StyledInput = styled.input`
  width: 100%; padding: 14px;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 1rem; color: #334155; transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    outline: none; background: #fff; border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%; padding: 14px; min-height: 200px;
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 1rem; color: #334155; line-height: 1.6; transition: all 0.2s;
  resize: none; box-sizing: border-box;

  &:focus {
    outline: none; background: #fff; border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Footer = styled.div`
  padding: 24px 32px;
  border-top: 1px solid #f1f5f9;
  display: flex; justify-content: space-between;
  background: #ffffff; border-radius: 0 0 20px 20px;
`;

const DeleteBtn = styled.button`
  padding: 12px 20px; border-radius: 8px; border: none;
  background: #fef2f2; color: #ef4444; font-weight: 600; cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #fee2e2; }
`;

const SubmitBtn = styled.button`
  padding: 12px 32px; border-radius: 8px; border: none;
  background: #3b82f6; color: white; font-weight: 600; cursor: pointer;
  margin-left: auto; box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);
  transition: all 0.2s;

  &:hover:not(:disabled) { background: #2563eb; transform: translateY(-1px); }
  &:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
`;

// ... Props 및 로직은 동일 ...
export type NoticePayload = { title: string; content: string };
type Props = {
  initialData: Notice | null;
  onSubmit: (data: NoticePayload) => void;
  onClose: () => void;
  onDelete?: (id: number) => void;
  isSubmitting: boolean;
};

export default function NoticeFormModal({ initialData, onSubmit, onClose, onDelete, isSubmitting }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const isEditMode = !!initialData;

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  return (
    <ModalPortal rootId="form-modal-root">
      <Bg onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()}>
          <Form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, content }); }}>
            <FormBody>
              <h2>{isEditMode ? '공지 수정' : '새 공지 작성'}</h2>
              <div>
                <Label>제목</Label>
                <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" required />
              </div>
              <div>
                <Label>내용</Label>
                <StyledTextarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" required />
              </div>
            </FormBody>
            <Footer>
              {isEditMode && <DeleteBtn type="button" onClick={() => onDelete?.(initialData.id)}>삭제</DeleteBtn>}
              <SubmitBtn type="submit" disabled={isSubmitting}>{isEditMode ? '수정 완료' : '등록하기'}</SubmitBtn>
            </Footer>
          </Form>
        </Box>
      </Bg>
    </ModalPortal>
  );
}