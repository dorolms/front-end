import styled, { keyframes, css } from "styled-components";

// --- Animations ---
export const slideUp = keyframes`
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---

export const Container = styled.div`
  position: absolute;
  top: 50px;
  right: -10px;
  width: 400px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(0,0,0,0.05);

  @media (max-width: 480px) {
    width: 320px;
    right: -50px;
  }
`;

export const Header = styled.div`
  padding: 24px 24px 0 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: #111;
  }
  span {
    font-size: 0.8rem;
    color: #94a3b8;
    font-weight: 600;
  }
`;

export const MarkAllBtn = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

export const FilterTabs = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #f1f5f9;
`;

export const TabBtn = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  padding: 0 0 10px 0;
  font-size: 0.9rem;
  font-weight: ${(props) => (props.$active ? '700' : '500')};
  color: ${(props) => (props.$active ? '#2f4f75' : '#94a3b8')};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: ${(props) => (props.$active ? '#2f4f75' : '#64748b')};
  }

  ${(props) =>
    props.$active &&
    css`
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #2f4f75;
        border-radius: 2px 2px 0 0;
      }
    `}
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 24px 24px 24px;
  max-height: 400px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;
  }
`;

export const NotificationCard = styled.div<{ $isRead: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  background: ${(props) => (props.$isRead ? '#f8fafc' : '#eff6ff')};
  border: 1px solid ${(props) => (props.$isRead ? '#f1f5f9' : '#dbeafe')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  .top-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 8px;
  }

  .icon-box {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => (props.$isRead ? '#e2e8f0' : '#3b82f6')};
    color: ${(props) => (props.$isRead ? '#94a3b8' : '#fff')};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .content-area {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .badge {
    display: inline-block;
    width: fit-content;
    padding: 2px 6px;
    margin-bottom: 4px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    background: ${(props) => (props.$isRead ? '#e2e8f0' : '#dbeafe')};
    color: ${(props) => (props.$isRead ? '#64748b' : '#3b82f6')};
  }

  .message {
    font-size: 0.95rem;
    font-weight: ${(props) => (props.$isRead ? '500' : '700')};
    color: ${(props) => (props.$isRead ? '#475569' : '#1e293b')};
    line-height: 1.4;
    word-break: keep-all;
  }

  .time {
    font-size: 0.8rem;
    color: #94a3b8;
    margin-top: 4px;
    text-align: right;
    font-weight: 500;
  }

  ${(props) =>
    !props.$isRead &&
    css`
      &::after {
        content: '';
        position: absolute;
        top: 16px;
        right: 16px;
        width: 6px;
        height: 6px;
        background: #3b82f6;
        border-radius: 50%;
      }
    `}
`;

export const EmptyState = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
`;