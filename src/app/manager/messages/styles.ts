'use client';

import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes` from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } `;
const popBadge = keyframes` 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } `;

export const Wrap = styled.div`
  /* Pretendard 폰트 */
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;

  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  height: calc(100vh - 40px);
  min-height: 700px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px;
`;

export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.03);
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) { flex-direction: column; }
`;

/* --- 왼쪽 사이드바 --- */
export const Sidebar = styled.div`
  width: 320px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
`;

export const SidebarHeader = styled.div`
  padding: 24px 20px;
  h2 { margin: 0; font-size: 1.1rem; font-weight: 700; color: #0f172a; }
`;

export const UserList = styled.ul`
  list-style: none; padding: 12px; margin: 0; overflow-y: auto; flex: 1;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
`;

export const UserItem = styled.li<{ $active: boolean }>`
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 12px;
  margin-bottom: 6px;
  background: ${(p) => (p.$active ? '#fff' : 'transparent')};
  box-shadow: ${(p) => (p.$active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none')};
  transition: all 0.2s ease;
  display: flex; align-items: center; gap: 14px;

  &:hover { background: #fff; transform: translateX(2px); }

  .avatar {
    width: 44px; height: 44px; border-radius: 14px;
    background: ${(p) => (p.$active ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#e2e8f0')};
    color: ${(p) => (p.$active ? '#fff' : '#64748b')};
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 1.1rem; flex-shrink: 0;
    box-shadow: ${(p) => (p.$active ? '0 4px 8px rgba(59, 130, 246, 0.3)' : 'none')};
    overflow: hidden;

    img { width: 100%; height: 100%; object-fit: cover; }
  }

  .info {
    flex: 1; overflow: hidden;
    .name { font-size: 0.95rem; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
    .sub {
      font-size: 0.8rem; color: #94a3b8;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
  }
`;

export const UnreadBadge = styled.span`
  background: #ef4444; color: white; font-size: 0.7rem; font-weight: 700;
  min-width: 20px; height: 20px; padding: 0 6px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  animation: ${popBadge} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
`;

/* --- 오른쪽 채팅창 --- */
export const ChatArea = styled.div`
  flex: 1; display: flex; flex-direction: column; background: #fff; min-width: 0;
`;

export const ChatHeader = styled.div`
  padding: 20px 28px; border-bottom: 1px solid #f1f5f9;
  background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
  display: flex; justify-content: space-between; align-items: center;
  position: sticky; top: 0; z-index: 10;

  .title-group {
    display: flex; flex-direction: column;
    .name { font-size: 1.1rem; font-weight: 700; color: #1e293b; }
    .status-text {
      font-size: 0.8rem; color: #94a3b8; margin-top: 2px;
      display: flex; align-items: center; gap: 6px;
    }
  }
  .status-indicator {
    width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1;
    &.active { background: #22c55e; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.2); }
  }
`;

export const MessageList = styled.div`
  flex: 1; padding: 20px 28px; background: #fff; overflow-y: auto;
  display: flex; flex-direction: column; gap: 8px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 3px; }
`;

export const DateDivider = styled.div`
  text-align: center; margin: 24px 0 16px;
  font-size: 0.75rem; color: #94a3b8; font-weight: 500;
  position: relative;
  &::before, &::after {
    content: ''; position: absolute; top: 50%; width: 30%; height: 1px; background: #f1f5f9;
  }
  &::before { left: 0; } &::after { right: 0; }
`;

export const BubbleWrapper = styled.div<{ $isMine: boolean }>`
  display: flex; flex-direction: column;
  align-items: ${(p) => (p.$isMine ? 'flex-end' : 'flex-start')};
  margin-bottom: 12px;
`;

export const Bubble = styled.div<{ $isMine: boolean }>`
  max-width: 70%; padding: 12px 16px; border-radius: 18px;
  font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap; word-break: break-word;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03); transition: transform 0.1s;

  ${(p) => p.$isMine
    ? css`background: linear-gradient(135deg, #3b82f6, #2563eb); color: #fff; border-bottom-right-radius: 4px;`
    : css`background: #f1f5f9; color: #1e293b; border-bottom-left-radius: 4px;`
  }
`;

export const MessageMeta = styled.div<{ $isMine: boolean }>`
  display: flex; align-items: center; gap: 6px; margin-top: 4px;
  font-size: 0.7rem; color: #94a3b8;
  padding: 0 4px;

  .read-status {
    color: #f59e0b; /* 1 (읽지 않음) */
    font-weight: 700;
    &.read { color: #3b82f6; } /* 읽음 */
  }
`;

export const InputArea = styled.div`
  padding: 20px 28px; background: #fff;
`;

export const InputWrapper = styled.div`
  display: flex; align-items: flex-end; background: #f8fafc;
  border: 1px solid #e2e8f0; border-radius: 24px; padding: 6px;
  transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:focus-within {
    background: #fff; border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  }
`;

export const StyledTextarea = styled.textarea`
  flex: 1; border: none; background: transparent; resize: none;
  height: 44px; max-height: 100px; padding: 12px 16px;
  font-size: 0.95rem; outline: none; color: #1e293b;
  &::placeholder { color: #cbd5e1; }
`;

export const SendButton = styled.button`
  width: 40px; height: 40px; border-radius: 50%; border: none;
  background: #3b82f6; color: #fff; display: flex;
  align-items: center; justify-content: center; cursor: pointer;
  transition: all 0.2s; flex-shrink: 0; margin-bottom: 2px; margin-right: 2px;

  &:hover { background: #2563eb; transform: scale(1.05); }
  &:active { transform: scale(0.95); }
  &:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
`;

export const EmptyState = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; color: #94a3b8; font-size: 0.95rem; gap: 16px; opacity: 0.8;
  svg { width: 64px; height: 64px; color: #e2e8f0; }
`;