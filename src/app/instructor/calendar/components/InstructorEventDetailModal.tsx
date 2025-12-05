// src/app/instructor/dashboard/components/InstructorEventDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import type { InstructorEventItem } from "../types";

// --- Icons ---
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MapPinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const FileTextIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

// --- Styled Components ---
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  width: 500px;
  max-width: 90vw;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    color: #111;
    line-height: 1.3;
  }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 6px;
  width: fit-content;
`;

const CloseBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #111;
  }
`;

const TimeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-weight: 600;
  font-size: 0.95rem;

  svg {
    color: #9ca3af;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg {
    color: #cbd5e1;
  }
`;

const ContentBox = styled.div`
  background: #fff;
  border: 1px solid #f1f5f9;
  padding: 14px;
  border-radius: 12px;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const InstructorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InstructorCard = styled.div<{ $isMain?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 10px;
  background: ${(props) => (props.$isMain ? "#eff6ff" : "#f8fafc")};
  border: 1px solid ${(props) => (props.$isMain ? "#dbeafe" : "#f1f5f9")};

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${(props) => (props.$isMain ? "#3b82f6" : "#cbd5e1")};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .info {
    display: flex;
    flex-direction: column;

    .name {
      font-weight: 700;
      color: ${(props) => (props.$isMain ? "#1e293b" : "#475569")};
      font-size: 0.95rem;
    }

    .role {
      font-size: 0.75rem;
      color: ${(props) => (props.$isMain ? "#3b82f6" : "#94a3b8")};
      font-weight: 600;
    }
  }

  .phone {
    font-size: 0.85rem;
    color: #64748b;
    font-weight: 500;
  }
`;

const EmptyMessage = styled(ContentBox)`
  text-align: center;
  color: #999;
`;

// --- Helper Functions ---
const formatDate = (date: Date) => {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const formatTime = (date: Date) => {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
};

// --- Component ---
type Props = {
  event: InstructorEventItem;
  onClose: () => void;
};

export default function InstructorEventDetailModal({ event, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const startDate = new Date(event.start);
  const endDate = new Date(event.end);

  const mainInstructor = event.instructors.find((i) => i.role === "MAIN");
  const assistInstructors = event.instructors.filter(
    (i) => i.role === "ASSISTANT"
  );

  const canShowInstructorInfo =
    event.instructorStatus === "PENDING" ||
    event.instructorStatus === "CONFIRMED";

  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <Header>
          <TitleArea>
            <Badge>{event.category || "강의"}</Badge>
            <h2>{event.title}</h2>
          </TitleArea>
          <CloseBtn onClick={onClose}>
            <CloseIcon />
          </CloseBtn>
        </Header>

        <TimeBadge>
          <ClockIcon />
          {formatDate(startDate)} &nbsp;|&nbsp; {formatTime(startDate)} ~{" "}
          {formatTime(endDate)}
        </TimeBadge>

        <InfoGrid>
          <Section>
            <SectionLabel>
              <MapPinIcon /> 강의 장소
            </SectionLabel>
            <ContentBox>{event.location || "장소 미정"}</ContentBox>
          </Section>

          <Section>
            <SectionLabel>
              <FileTextIcon /> 콘텐츠
            </SectionLabel>
            <ContentBox>{event.content || "-"}</ContentBox>
          </Section>
        </InfoGrid>

        <Section>
          <SectionLabel>
            <UsersIcon /> 담당 강사
          </SectionLabel>

          {canShowInstructorInfo ? (
            <InstructorList>
              {mainInstructor ? (
                <InstructorCard $isMain>
                  <div className="left">
                    <div className="avatar">{mainInstructor.name[0]}</div>
                    <div className="info">
                      <span className="name">{mainInstructor.name} 강사님</span>
                      <span className="role">주 도로쌤</span>
                    </div>
                  </div>
                  <div className="phone">{mainInstructor.phone}</div>
                </InstructorCard>
              ) : (
                <EmptyMessage>주강사 배정 전</EmptyMessage>
              )}

              {assistInstructors.map((assist, index) => (
                <InstructorCard key={index}>
                  <div className="left">
                    <div className="avatar">{assist.name[0]}</div>
                    <div className="info">
                      <span className="name">{assist.name} 강사님</span>
                      <span className="role">보조 도로쌤</span>
                    </div>
                  </div>
                  <div className="phone">{assist.phone}</div>
                </InstructorCard>
              ))}
            </InstructorList>
          ) : (
            <EmptyMessage>
              담당 강사는 배정이 완료된 후 확인할 수 있습니다.
            </EmptyMessage>
          )}
        </Section>
      </ModalBox>
    </Backdrop>,
    document.body
  );
}
