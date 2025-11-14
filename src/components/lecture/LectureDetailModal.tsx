// src/components/lecture/LectureDetailModal.tsx
"use client";

import React from "react";
import {
  Backdrop,
  Dialog,
  Header,
  Title,
  Body,
  Row,
  Label,
  Value,
  Footer,
  Button,
} from "./LectureDetailModal.styles";

import type { LectureEvent } from "@/components/calendar/CalendarDayCell";

export type LectureContext = "APPLY_CALENDAR" | "MY_CALENDAR";

type Props = {
  open: boolean;
  lecture: LectureEvent | null; // ✅ 페이지에서 넘기는 타입 그대로
  context: LectureContext;
  onClose: () => void;
  // id가 string | number 일 수 있으니 이렇게 통일
  onApply?: (id: string | number) => void;
  onCancelApply?: (id: string | number) => void;
  onConfirm?: (id: string | number) => void;
};

// ===== 버튼 렌더링 =====
type ActionButtonsProps = Pick<
  Props,
  "lecture" | "context" | "onApply" | "onCancelApply" | "onConfirm"
>;

const ActionButtons: React.FC<ActionButtonsProps> = ({
  lecture,
  context,
  onApply,
  onCancelApply,
  onConfirm,
}) => {
  if (!lecture) return null;

  // 👉 강의 신청 캘린더에서 사용할 때
  if (context === "APPLY_CALENDAR") {
    switch (lecture.status) {
      case "PENDING": // 모집중(신청 가능)이라고 가정
        return (
          <Button $variant="primary" onClick={() => onApply?.(lecture.id)}>
            신청하기
          </Button>
        );
      case "APPLIED":
        return (
          <Button $variant="danger" onClick={() => onCancelApply?.(lecture.id)}>
            신청 취소
          </Button>
        );
      default:
        return <Button $variant="disabled">신청 불가</Button>;
    }
  }

  // 👉 나의 강의 캘린더에서 사용할 때
  if (context === "MY_CALENDAR") {
    switch (lecture.status) {
      case "APPLIED":
        return <Button $variant="disabled">신청 완료</Button>;
      case "PENDING":
        return <Button $variant="disabled">확정 대기중</Button>;
      case "CONFIRMED":
        return (
          <Button $variant="primary" onClick={() => onConfirm?.(lecture.id)}>
            확정된 강의입니다
          </Button>
        );
      default:
        return null;
    }
  }

  return null;
};

// ===== 메인 모달 =====
const LectureDetailModal: React.FC<Props> = (props) => {
  const { open, lecture, onClose, context } = props;

  if (!open || !lecture) return null;

  return (
    <Backdrop onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{lecture.title}</Title>
          <Button $variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </Header>

        <Body>
          <Row>
            <Label>강의 일시</Label>
            <Value>
              {lecture.date} {lecture.timeLabel}
            </Value>
          </Row>

          <Row>
            <Label>상태</Label>
            <Value>{lecture.status}</Value>
          </Row>

          <Row>
            <Label>유형</Label>
            <Value>{lecture.type}</Value>
          </Row>

          {/* place, startTime, endTime 같은 필드는
              나중에 LectureEvent 타입에 추가되면 여기서 같이 보여주면 됨 */}
        </Body>

        <Footer>
          <Button $variant="ghost" onClick={onClose}>
            닫기
          </Button>
          <ActionButtons
            lecture={lecture}
            context={context}
            onApply={props.onApply}
            onCancelApply={props.onCancelApply}
            onConfirm={props.onConfirm}
          />
        </Footer>
      </Dialog>
    </Backdrop>
  );
};

export default LectureDetailModal;
