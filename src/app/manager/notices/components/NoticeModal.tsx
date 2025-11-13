'use client';
/**
 * NoticeModal.tsx (매니저용 상세 보기 모달)
 *
 * - 선택된 공지 1개의 상세 내용을 보여주는 모달.
 * - (강사) 버전과 달리 '수정' 버튼이 포함됨 (onEdit 콜백).
 * - 배경 클릭(onClose) 또는 수정 버튼(onEdit) 시 상위(ClientPage)로 이벤트 전달.
 * - Pretendard 폰트 및 image_0d158a.png 디자인 적용.
 */

import styled from 'styled-components';
import ModalPortal from './ModalPortal';
import type { Notice } from '../types';

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
  width: 90%;
  max-width: 700px;
  padding: 32px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: 'Pretendard', sans-serif; // 폰트 적용
`;

const Hdr = styled.div`
  margin-bottom: 16px;

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 12px 0;
  }

  div.meta {
    font-size: 0.95rem;
    color: #333;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e0e0e0; // 헤더-본문 구분선
  }
`;

const Body = styled.div`
  white-space: pre-line; // \n 줄바꿈 렌더링
  line-height: 1.7;
  font-size: 1rem;
  color: #333;
  min-height: 200px;
  margin-top: 24px;
`;

const Ftr = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 10px 24px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit; // 폰트 상속
  }

  .edit-btn { // '수정' 버튼
    background: #f0f0f0;
  }

  .close-btn { // '닫기' 버튼
    background: #e0e0e0;
  }
`;
// --- (End) Styled-Components ---

type Props = {
  /** 표시할 공지사항 데이터 객체 */
  notice: Notice;
  /** '닫기' 또는 배경 클릭 시 호출될 함수 */
  onClose: () => void;
  /** '수정' 버튼 클릭 시 호출될 함수 */
  onEdit: () => void;
};

export default function NoticeModal({ notice, onClose, onEdit }: Props) {
  // 날짜 포맷팅 (e.g., '2025-09-08 15:32')
  const formattedDate = new Date(notice.createdAt).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).replace(/\. /g, '-').replace('.', '');

  return (
    <ModalPortal>
      <Bg onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="notice-title">
        {/* 모달 컨텐츠 클릭 시 이벤트 전파(버블링) 방지 */}
        <Box onClick={(e) => e.stopPropagation()}>
          <Hdr>
            <h3 id="notice-title">{notice.title}</h3>
            <div className="meta">
              <span>작성자 | {notice.author}</span>
              <span>작성 일시 | {formattedDate}</span>
            </div>
          </Hdr>

          <Body>{notice.content}</Body>

          <Ftr>
            {/* '수정' 버튼 클릭 시 onEdit 콜백 */}
            <button className="edit-btn" onClick={onEdit}>
              수정
            </button>
            {/* '닫기' 버튼 클릭 시 onClose 콜백 */}
            <button className="close-btn" onClick={onClose}>
              닫기
            </button>
          </Ftr>
        </Box>
      </Bg>
    </ModalPortal>
  );
}