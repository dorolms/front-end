import styled, { keyframes } from "styled-components";

/* -------------------------------------------------------------------------- */
/*  Animations                                                                */
/* -------------------------------------------------------------------------- */

const popIn = keyframes`
  0% { opacity: 0; transform: translateY(12px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const popSuccess = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

/* -------------------------------------------------------------------------- */
/*  Root Container                                                            */
/* -------------------------------------------------------------------------- */

export const Container = styled.div`
  position: absolute;
  top: 54px;
  right: -10px;
  width: 380px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0,0,0,0.05);
  z-index: 100;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${popIn} 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  transform-origin: top right;

  @media (max-width: 480px) {
    width: 340px;
    right: -60px;
  }
`;

/* -------------------------------------------------------------------------- */
/*  Header                                                                    */
/* -------------------------------------------------------------------------- */

export const Header = styled.div`
  padding: 18px 20px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  flex-shrink: 0;
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const BackBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  padding: 8px 12px 8px 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: #0f172a;
  }
`;

/* -------------------------------------------------------------------------- */
/*  Filters / Controls                                                        */
/* -------------------------------------------------------------------------- */

export const FilterSection = styled.div`
  padding: 12px 20px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    pointer-events: none;
    width: 16px;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.85rem;
  color: #334155;

  &:focus {
    outline: none;
    background: #fff;
    border-color: #3b82f6;
  }
`;

export const Select = styled.select`
  flex: 1;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 0.8rem;
  color: #334155;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #3b82f6;
  }
`;

export const ToggleButton = styled.button<{ $isActive: boolean }>`
  background: ${(props) => (props.$isActive ? "#fef2f2" : "#fff")};
  border: 1px solid ${(props) => (props.$isActive ? "#fca5a5" : "#e2e8f0")};
  color: ${(props) => (props.$isActive ? "#dc2626" : "#64748b")};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$isActive ? "#fee2e2" : "#f8fafc")};
  }
`;

/* -------------------------------------------------------------------------- */
/*  List / Items                                                              */
/* -------------------------------------------------------------------------- */

export const List = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 400px;
  overflow-y: auto;
  background: #f8fafc;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

export const InstructorItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }
`;

export const Avatar = styled.div<{ $hasUnread: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(props) => (props.$hasUnread ? "#fee2e2" : "#e2e8f0")};
  color: ${(props) => (props.$hasUnread ? "#ef4444" : "#64748b")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${(props) => (props.$hasUnread ? "block" : "none")};
    position: absolute;
    top: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: #ef4444;
    border: 2px solid #fff;
    border-radius: 50%;
  }
`;

export const CountBadge = styled.span`
  background: #fff1f2;
  color: #e11d48;
  border: 1px solid #ffe4e6;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
`;

/* -------------------------------------------------------------------------- */
/*  Detail View (알림 카드 목록)                                              */
/* -------------------------------------------------------------------------- */

export const DetailWrapper = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const NotificationCard = styled.div<{ $isRead: boolean }>`
  background: #fff;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid ${(props) => (props.$isRead ? "#e2e8f0" : "#fca5a5")};
  border-left: ${(props) =>
    props.$isRead ? "1px solid #e2e8f0" : "4px solid #ef4444"};

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6px;

    .status {
      font-size: 0.7rem;
      font-weight: 800;
      color: ${(props) => (props.$isRead ? "#94a3b8" : "#ef4444")};
    }

    .time {
      font-size: 0.7rem;
      color: #94a3b8;
    }
  }

  .message {
    font-size: 0.85rem;
    color: #334155;
    line-height: 1.4;
  }

  .actions {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
`;

export const ActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
  }
`;

/* -------------------------------------------------------------------------- */
/*  Empty State                                                               */
/* -------------------------------------------------------------------------- */

export const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

/* -------------------------------------------------------------------------- */
/*  재전송 확인 모달                                                          */
/* -------------------------------------------------------------------------- */

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fade 0.2s ease-in-out;

  @keyframes fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalBox = styled.div`
  background: #fff;
  width: 320px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideUpModal {
    from { transform: translateY(20px) scale(0.95); opacity: 0; }
    to { transform: translateY(0) scale(1); opacity: 1; }
  }
`;

export const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f9ff;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ModalContent = styled.div`
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.1rem;
    font-weight: 700;
    color: #1e293b;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.5;
    word-break: keep-all;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 8px;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
`;

export const CancelButton = styled(BaseButton)`
  background: #f1f5f9;
  color: #64748b;

  &:hover {
    background: #e2e8f0;
    color: #334155;
  }
`;

export const ConfirmButton = styled(BaseButton)`
  background: #1e293b;
  color: #fff;

  &:hover {
    background: #0f172a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(47, 79, 117, 0.3);
  }
`;

/* -------------------------------------------------------------------------- */
/*  재전송 완료 모달                                                         */
/* -------------------------------------------------------------------------- */

export const SuccessOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 30000;
`;

export const SuccessBox = styled.div`
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: ${popSuccess} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 320px;
`;

export const SuccessMessage = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 8px 0 16px;
`;

export const SuccessButton = styled.button`
  padding: 10px 32px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;

  &:hover {
    transform: translateY(-1px);
    background: #0f172a;
  }
`;
