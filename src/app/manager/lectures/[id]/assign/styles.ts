// src/app/manager/lectures/[id]/styles.ts
'use client';

import styled from 'styled-components';
import { DbAssignmentStatus, LectureRole } from './api-mock';

// PageContainer
export const PageContainer = styled.div`
  width: 100%;
  padding: 30px 40px;
  background-color: #ffffff;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  flex-shrink: 0;
`;

export const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #111;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StatusBadge = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #1d4ed8;
  background-color: #dbeafe;
  padding: 4px 10px;
  border-radius: 20px;
`;

export const BackButton = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background-color: #e9ecef; color: #333; }
`;

export const ContentWrapper = styled.div`
  display: flex; gap: 40px; flex: 1; min-height: 0;
`;

export const SectionMenu = styled.nav`
  display: flex; flex-direction: column; gap: 8px; width: 220px; flex-shrink: 0; padding-top: 10px;
`;

export const MenuItem = styled.button<{ $isActive: boolean }>`
  width: 100%; padding: 14px 20px; font-size: 15px; font-weight: 600; border-radius: 10px; text-align: left; cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
  color: ${(props) => (props.$isActive ? '#3b82f6' : '#4b5563')};
  background-color: ${(props) => (props.$isActive ? '#eff6ff' : 'transparent')};
  &:hover { background-color: ${(props) => (props.$isActive ? '#eff6ff' : '#f9fafb')}; color: #3b82f6; }
`;

export const RightPanel = styled.div`
  flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100%; overflow: hidden;
`;

export const ScrollArea = styled.div`
  flex: 1; overflow-y: auto; padding-right: 20px; position: relative;
`;

export const Section = styled.section`
  padding-top: 10px; margin-bottom: 60px;
  &:last-of-type { margin-bottom: 20px; }
`;

export const SectionTitle = styled.h2`
  font-size: 20px; font-weight: 700; color: #111; margin-bottom: 24px; display: flex; align-items: center;
  &::before {
    content: ''; display: block; width: 4px; height: 20px; background-color: #3b82f6; margin-right: 12px; border-radius: 2px;
  }
`;

export const DetailRow = styled.div`
  display: grid; grid-template-columns: 220px 1fr; align-items: stretch; border-bottom: 1px solid #e5e7eb;
  &:first-of-type { border-top: 1px solid #e5e7eb; }
`;

export const DetailLabel = styled.div`
  font-size: 14px; font-weight: 600; color: #374151;
  background-color: #f9fafb; padding: 24px; border-right: 1px solid #e5e7eb;
`;

export const DetailValue = styled.div`
  flex: 1; font-size: 15px; color: #111; line-height: 1.6; white-space: pre-wrap; font-weight: 500;
  padding: 24px;
  &.highlight { color: #e11d48; font-weight: 700; }
`;

export const AttachmentLink = styled.a`
  display: inline-flex; align-items: center; gap: 6px; color: #3b82f6; text-decoration: underline; cursor: pointer;
  &:hover { color: #2563eb; }
`;

export const FilterTabs = styled.div` display: flex; gap: 8px; margin-bottom: 16px; `;

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; border: none; cursor: pointer;
  background-color: ${({ $active }) => ($active ? '#111' : '#f3f4f6')};
  color: ${({ $active }) => ($active ? '#fff' : '#6b7280')};
  transition: all 0.2s;
  &:hover { background-color: ${({ $active }) => ($active ? '#111' : '#e5e7eb')}; }
`;

export const TableContainer = styled.div`
  height: calc(100vh - 450px); min-height: 400px; border: 1px solid #e5e7eb; border-radius: 12px;
  overflow-y: auto; background-color: white; position: relative;
  &::-webkit-scrollbar { width: 8px; height: 8px; }
  &::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; }
  &::-webkit-scrollbar-track { background-color: transparent; }
`;

export const Table = styled.table` width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; `;
export const Thead = styled.thead`
  th {
    padding: 16px; font-size: 13px; font-weight: 600; color: #6b7280;
    border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10;
    background-color: #f9fafb; box-shadow: 0 1px 0 #e5e7eb;
  }
`;
export const Tbody = styled.tbody`
  tr { background-color: #fff; cursor: pointer; &:hover { background-color: #f9fafb; } }
  td { padding: 16px; vertical-align: middle; border-bottom: 1px solid #e5e7eb; }
`;

export const RoleBadge = styled.span<{ $role: string }>`
  display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; margin-right: 4px; margin-bottom: 2px;
  background-color: ${({ $role }) => ($role === 'main' ? '#dbeafe' : '#dcfce7')};
  color: ${({ $role }) => ($role === 'main' ? '#1d4ed8' : '#166534')};
`;

export const ApplicantName = styled.div` font-size: 15px; font-weight: 600; color: #111; margin-bottom: 4px; `;
export const ApplicantMeta = styled.div` font-size: 13px; color: #6b7280; `;

type UiAssignmentStatus = 'pending' | 'assigned_main' | 'assigned_assist' | 'rejected';
export const StatusSelect = styled.select<{ $status: UiAssignmentStatus; }>`
  padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;
  border: 1px solid transparent; outline: none; width: 140px;
  background-color: ${({ $status }) => {
    if ($status === 'assigned_main') return '#dbeafe';
    if ($status === 'assigned_assist') return '#dcfce7';
    if ($status === 'rejected') return '#fee2e2';
    return '#f3f4f6';
  }};
  color: ${({ $status }) => {
    if ($status === 'assigned_main') return '#1d4ed8';
    if ($status === 'assigned_assist') return '#166534';
    if ($status === 'rejected') return '#991b1b';
    return '#4b5563';
  }};
  &:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
`;

export const FixedBottomBar = styled.div` flex-shrink: 0; padding-top: 20px; margin-top: 10px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; align-items: center; gap: 12px; background-color: #fff; z-index: 10; `;

export const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 32px; font-size: 16px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: none;
  ${({ $variant }) => $variant === 'primary' ? `
    background-color: #3b82f6; color: white;
    &:hover { background-color: #2563eb; }
  ` : `
    background-color: white; color: #374151; border: 1px solid #d1d5db;
    &:hover { background-color: #f3f4f6; }
  `}
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const LoadingState = styled.div` display: flex; justify-content: center; align-items: center; height: 100%; font-size: 16px; color: #666; `;

// --- 팝업 모달 ---
export const ModalBackground = styled.div` position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; `;
export const ModalContainer = styled.div` width: 100%; max-width: 700px; background-color: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); display: flex; flex-direction: column; `;
export const ModalHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; h3 { font-size: 18px; font-weight: 700; color: #111; margin: 0; } `;
export const CloseButton = styled.button` background: none; border: none; font-size: 24px; color: #9ca3af; cursor: pointer; line-height: 1; &:hover { color: #111; } `;
export const ModalBody = styled.pre` padding: 24px; font-size: 15px; line-height: 1.7; color: #374151; max-height: 60vh; overflow-y: auto; white-space: pre-wrap; font-family: inherit; margin: 0; `;