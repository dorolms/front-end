'use client';
/**
 * NoticeModal.tsx
 * - 선택된 공지의 상세 내용을 모달로 표시.
 * - 뒷배경 클릭 시 onClose 호출로 모달 닫힘.
 * - 키보드 ESC 핸들링, 포커스 트랩 등 접근성 개선은 추후 추가 가능.
 */

import styled from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

const Bg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20000;
`;

const Box = styled.div`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
  width: 90%;
  max-width: 600px;  /* 공지 특성상 약간 넓게 */
  padding: 32px;
  max-height: 80vh;  /* 너무 길면 스크롤 */
  overflow-y: auto;
`;

const Hdr = styled.div`
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 24px;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  p {
    font-size: .9rem;
    color: #777;
    margin: 0;
  }
`;

const Body = styled.div`
  /* 줄바꿈 문자(\n)를 실제 줄바꿈처럼 표시 */
  white-space: pre-line;
  line-height: 1.7;
`;

const Ftr = styled.div`
  margin-top: 32px;
  text-align: right;

  button {
    padding: 10px 24px;
    background: #555;
    color: #fff;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
  }
`;

type Props = {
  notice: Notice;
  onClose: () => void;
};

export default function NoticeModal({ notice, onClose }: Props) {
  return (
    <ModalPortal>
      {/* role="dialog" + aria 등 접근성 속성 부여 */}
      <Bg onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="notice-title">
        {/* 모달 내부 클릭은 이벤트 전파 중단(바깥 클릭으로 닫히지 않도록) */}
        <Box onClick={(e) => e.stopPropagation()}>
          <Hdr>
            <h3 id="notice-title">{notice.title}</h3>
            <p>작성자: {notice.author} | 작성일: {notice.createdAt}</p>
          </Hdr>

          <Body>{notice.content}</Body>

          <Ftr>
            <button onClick={onClose}>닫기</button>
          </Ftr>
        </Box>
      </Bg>
    </ModalPortal>
  );
}
