"use client";
import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import LectureListTable, { LectureListRow } from "./LectureListTable";
import InstructorEventDetailModal from "../InstructorEventDetailModal";
// 💡 LectureDetail 타입과 사용되는 다른 타입들을 임포트하도록 수정
import type { LectureDetail, LectureType, LectureApiStatus } from "../../types";

const PAGE_SIZE = 10;

type Props = {
  // 💡 props의 lectures 타입을 Lecture[]에서 LectureDetail[]로 변경
  lectures: LectureDetail[];
};

export default function LectureListView({ lectures }: Props) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // 🔹 모달 상태: 이제 id만 관리
  const [selectedLectureId, setSelectedLectureId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API 데이터 → 테이블 UI용으로 변환
  // 💡 e의 타입이 LectureDetail로 추론되므로, 코드 본문 수정은 필요 없음
  const allRows: LectureListRow[] = lectures.map((e, idx) => ({
    id: e.id,
    no: idx + 1,
    type: convertType(e.type), // e.type은 LectureDetail.type (LectureType)
    division: e.category ?? "", // e.category는 LectureDetail.category
    title: e.title ?? "", // e.title은 LectureDetail.title
    applicationPeriod: "~ " + formatDate(e.end_date), // e.end_date는 LectureDetail.end_date
    applicationLabel: convertApplicationStatus(e.my_application_status ?? null),
    statusLabel: convertStatus(e.status), // e.status는 LectureDetail.status (LectureApiStatus)
  }));

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) => row.title.toLowerCase().includes(q));
  }, [allRows, keyword]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 행 클릭 핸들러 → 선택된 강의 id만 저장
  const handleRowClick = (row: LectureListRow) => {
    setSelectedLectureId(row.id);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLectureId(null);
  };

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => setPage(1)}
        />
      </div>

      <LectureListTable rows={pageRows} onRowClick={handleRowClick} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* 🔹 모달: lectureId만 넘김 (디테일은 모달 내부에서 fetch) */}
      <InstructorEventDetailModal
        lectureId={selectedLectureId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

/* -------- 변환 함수 -------- */
// 💡 type 인자의 타입을 Lecture["type"]에서 LectureType으로 변경
function convertType(type: LectureType) {
  const map: Record<LectureType, string> = {
    general: "일반",
    competition: "대회",
    camp: "캠프",
    doroland: "도로랜드",
    booth: "부스",
    etc: "기타",
  };
  return map[type] ?? "기타";
}

function convertStatus(status: LectureApiStatus) {
  const map: Partial<Record<LectureApiStatus, string>> = {
    RECRUITING: "모집 중",
    ALLOCATING: "배정 중",
    COMPLETED: "배정 완료",
    COMPETITION: "배정 완료",
  };
  return map[status] ?? "상태 없음";
}

function convertApplicationStatus(status: string | null): string {
  if (status === null) return "신청 전";
  if (status === "rejected") return "거절됨";
  if (status === "assigned") return "배정됨";
  if (status === "pending") return "배정 대기";
  return "-";
}

function formatDate(date: string | null | undefined) {
  if (!date) return "";
  return date.slice(0, 10).replace(/-/g, "/");
}
