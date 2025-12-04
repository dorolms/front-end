"use client";

import styled from "styled-components";
import { useRouter } from "next/navigation";

export default function NewLectureButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/manager/lectures/new");
  };

  return (
    <Button onClick={handleClick}>
      <PlusIcon>＋</PlusIcon>
      새 강의
    </Button>
  );
}

// ---------------- Styled Components ---------------- //

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  background: #3b82f6;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;

  padding: 10px 16px;
  border-radius: 10px;
  border: none;

  cursor: pointer;
  transition: 0.15s ease;

  &:hover {
    background: #2563eb;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const PlusIcon = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
`;
