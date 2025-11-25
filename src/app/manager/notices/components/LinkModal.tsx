'use client';

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (text: string, url: string) => void;
  initialText?: string;
};

export default function LinkModal({ isOpen, onClose, onConfirm, initialText = '' }: Props) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState(initialText);

  // 사용자가 문구를 직접 수정했는지 체크하는 상태
  const [isTextEdited, setIsTextEdited] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setText(initialText);
      // 초기 텍스트가 있으면 이미 수정된 것으로 간주(URL 따라가기 방지)
      setIsTextEdited(!!initialText);
    }
  }, [isOpen, initialText]);

  // URL 입력 시: 문구를 수정한 적 없으면 문구도 같이 바뀜
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    if (!isTextEdited) {
      setText(newUrl);
    }
  };

  // 문구 입력 시: 직접 수정했으므로 동기화 해제
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    setIsTextEdited(true);
  };

  const handleSubmit = () => {
    if (!url.trim()) {
      alert('URL을 입력해주세요.');
      return;
    }
    // 문구가 비어있으면 URL을 문구로 사용
    const finalContent = text.trim() === '' ? url : text;
    onConfirm(finalContent, url);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>링크 등록</h3>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Body>
          <Field>
            <label>문구</label>
            <Input
              placeholder="링크를 클릭했을 때 보일 텍스트"
              value={text}
              onChange={handleTextChange}
            />
          </Field>

          <Field>
            <label>URL 주소</label>
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={handleUrlChange}
              autoFocus
            />
          </Field>
        </Body>

        <Footer>
          <ConfirmButton onClick={handleSubmit}>링크 등록</ConfirmButton>
        </Footer>
      </Container>
    </Overlay>
  );
}

/* -------------------- 스타일 -------------------- */
const fadeIn = keyframes`from{opacity:0;} to{opacity:1;}`;
const slideUp = keyframes`from{transform:translateY(10px); opacity:0;} to{transform:translateY(0); opacity:1;}`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 21000; /* NoticeFormModal보다 위에 뜨도록 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s;
`;

const Container = styled.div`
  width: 440px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  overflow: hidden;
  animation: ${slideUp} 0.25s ease-out;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
    color: #1e293b;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  &:hover { color: #64748b; }
`;

const Body = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const Footer = styled.div`
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmButton = styled.button`
  background: #3b82f6;
  color: #fff;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;