// src/app/instructor/lectures/components/list/LectureListView.tsx
"use client";
import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import LectureListTable, { LectureListRow } from "./LectureListTable";
import InstructorEventDetailModal from "../InstructorEventDetailModal";
import type { Lecture, LectureApiStatus } from "../../types";

const PAGE_SIZE = 10;

type Props = {
  lectures: Lecture[];
};

export default function LectureListView({ lectures }: Props) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  
  // 모달 상태 관리
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // API 데이터 → 테이블 UI용으로 변환
  const allRows: LectureListRow[] = lectures.map((e, idx) => ({
    id: e.id,
    no: idx + 1,
    type: convertType(e.type),
    division: e.category ?? "",
    title: e.title ?? "",
    applicationPeriod: "~ " + formatDate(e.end_date),
    applicationLabel: "-",
    statusLabel: convertStatus(e.status),
  }));

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) => row.title.toLowerCase().includes(q));
  }, [allRows, keyword]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // 행 클릭 핸들러
  const handleRowClick = (row: LectureListRow) => {
    const lecture = lectures.find((l) => l.id === row.id);
    if (lecture) {
      setSelectedLecture(lecture);
      setIsModalOpen(true);
    }
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecture(null);
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
      
      <LectureListTable 
        rows={pageRows} 
        onRowClick={handleRowClick}
      />
      
      <Pagination 
        page={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      {/* 모달 */}
      <InstructorEventDetailModal
        lecture={selectedLecture}
        schedule={null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

/* -------- 변환 함수 -------- */
function convertType(type: Lecture["type"]) {
  const map: Record<Lecture["type"], string> = {
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

function formatDate(date: string | null | undefined) {
  if (!date) return "";
  return date.slice(0, 10).replace(/-/g, "/");
}