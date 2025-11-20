'use client';
/**
 * ModalPortal.tsx
 * - 모달을 document.body 하위 별도 DOM 노드로 렌더하기 위한 포털.
 * - 여러 페이지/모달에서 재사용 가능.
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

  // body에 붙일 전용 루트 엘리먼트 생성 (한 번만)
  const [el] = useState(() => {
    const div = document.createElement('div');
    div.setAttribute('id', rootId);
    return div;
  });

  useEffect(() => {
    document.body.appendChild(el);
    setMounted(true);
    return () => {
      document.body.removeChild(el);
    };
  }, [el]);

  return mounted ? createPortal(children, el) : null;
}
