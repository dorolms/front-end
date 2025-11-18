'use client';
/**
 * NoticeModal.tsx
 * 디자인 업그레이드: 제목 강조, 메타 데이터 정리
 */

import styled from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

// --- Styled-Components ---
const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
`;

const Box = styled.div`
  background: #fff;
  width: 90%;
  max-width: 640px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  animation: popUp 0.3s ease-out;

  @keyframes popUp {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const Header = styled.div`
  padding: 40px 40px 24px;
  border-bottom: 1px solid #f0f0f0;

  h3 {
    font-size: 1.6rem; /* 제목을 아주 크게 */
    font-weight: 700;
    line-height: 1.4;
    color: #111;
    margin: 0 0 16px 0;
    word-break: keep-all;
  }
`;

const Meta = styled.div`
  display: flex;
  gap: 12px;
  font-size: 0.9rem;
  color: #888;
  align-items: center;

  span {
    display: flex;
    align-items: center;
  }

  /* 구분선(|) 추가 */
  span:not(:last-child)::after {
    content: '';
    display: block;
    width: 1px;
    height: 10px;
    background: #ddd;
    margin-left: 12px;
  }
`;

const Content = styled.div`
  padding: 32px 40px;
  font-size: 1.05rem;
  line-height: 1.75;
  color: #333;
  white-space: pre-wrap; /* 줄바꿈 유지 */
  overflow-y: auto;
  flex: 1; /* 남은 공간 채우기 */

  /* 스크롤바 예쁘게 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #e0e0e0;
    border-radius: 4px;
  }
`;

const Footer = styled.div`
  padding: 20px 40px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  background-color: #fff; /* 스크롤 돼도 버튼은 보이게 */
`;

const EditButton = styled.button`
  padding: 10px 24px;
  background-color: #f1f3f5;
  color: #333;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #e9ecef;
  }
`;

type Props = {
  notice: Notice;
  onClose: () => void;
  onEdit: () => void;
};

export default function NoticeModal({ notice, onClose, onEdit }: Props) {
  const formattedDate = new Date(notice.createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <ModalPortal>
      <Bg onClick={onClose}>
        <Box onClick={(e) => e.stopPropagation()}>
          <Header>
            <h3>{notice.title}</h3>
            <Meta>
              <span>{notice.author}</span>
              <span>{formattedDate}</span>
            </Meta>
          </Header>

          <Content>
            {notice.content}
          </Content>

          <Footer>
            <EditButton onClick={onEdit}>수정하기</EditButton>
          </Footer>
        </Box>
      </Bg>
    </ModalPortal>
  );
}