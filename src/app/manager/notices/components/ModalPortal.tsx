'use client';
/**
 * ModalPortal.tsx
 * - 모달을 document.body 하위 별도 DOM 노드로 렌더하기 위한 포털.
 * - z-index, overflow 문제 등에서 자유롭게 모달을 띄우기 위해 사용.
 * - 마운트 시 body에 div를 append, 언마운트 시 제거.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ModalPortal({
  children,
  rootId = 'notice-modal-root',
}: {
  children: React.ReactNode;
  rootId?: string;
}) {
  const [mounted, setMounted] = useState(false);

  // body에 붙일 전용 루트 엘리먼트 (최초 1회만 생성)
  // (서버 사이드 렌더링 시 document가 없으므로 useState 초기화 함수 + useEffect 사용)
  const [el] = useState(() => {
    if (typeof document === 'undefined') {
      return null;
    }
    const div = document.createElement('div');
    div.setAttribute('id', rootId);
    return div;
  });

  // 클라이언트에서 마운트되었을 때 body에 el을 붙이고, 언마운트 시 제거
  useEffect(() => {
    if (!el) return;

    document.body.appendChild(el);
    setMounted(true);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  // 마운트가 완료된 클라이언트 환경에서만 createPortal 실행
  return mounted && el ? createPortal(children, el) : null;
}