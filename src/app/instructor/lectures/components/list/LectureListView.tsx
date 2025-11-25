// src/app/instructor/lectures/components/list/LectureListView.tsx
"use client";

import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import LectureListTable, { LectureListRow } from "./LectureListTable";
import { mockInstructorEvents } from "../../../dashboard/data/instructorMock";
import InstructorEventDetailModal from "./InstructorEventDetailModal"; // ✅ 모달 import
import type { InstructorEventItem } from "../../../dashboard/types";

const PAGE_SIZE = 10;

export default function LectureListView() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // ✅ 모달용 선택된 강의
  const [selectedEvent, setSelectedEvent] =
    useState<InstructorEventItem | null>(null);

  // id → 원본 이벤트 매핑
  const eventMap = useMemo(
    () =>
      new Map<string, InstructorEventItem>(
        mockInstructorEvents.map((e) => [e.id, e])
      ),
    []
  );

  // 🔹 mock 데이터 → 테이블용 형태로 변환
  const allRows: LectureListRow[] = mockInstructorEvents.map((e, idx) => ({
    id: e.id ?? "",
    no: idx + 1,
    type: convertCategoryToType(e.category ?? ""),
    division: extractDivision(e.location ?? ""),
    title: e.title ?? "",
    applicationPeriod: "~" + formatDate(e.start ?? ""),
    applicationLabel: convertApplyLabel(e.instructorStatus ?? ""),
    statusLabel: convertStatusLabel(e.status ?? ""),
  }));

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) => row.title.toLowerCase().includes(q));
  }, [allRows, keyword]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredRows.slice(start, end);
  }, [filteredRows, page]);

  const handleSearchSubmit = () => {
    setPage(1);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* ✅ 강의 리스트 테이블 */}
      <LectureListTable
        rows={pageRows}
        onClickTitle={(row) => {
          const event = eventMap.get(String(row.id));
          if (event) {
            setSelectedEvent(event); // 👉 모달 오픈
          }
        }}
        onClickApply={(row) => {
          console.log("신청 버튼 클릭", row);
        }}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* ✅ 모달 렌더 */}
      {selectedEvent && (
        <InstructorEventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  );
}

/* ---------------- Helper functions ---------------- */

function convertCategoryToType(category: string): string {
  switch (category) {
    case "GENERAL":
      return "일반";
    case "BOOTH":
      return "부스";
    case "DOROLAND":
      return "도로랜드";
    case "COMPETITION":
      return "대회";
    case "CAMP":
      return "캠프";
    case "ETC":
      return "기타";
    default:
      return "일반";
  }
}

function extractDivision(location: string): string {
  const parts = location.split(" ");
  if (parts.length <= 2) return location;
  return parts.slice(0, 2).join(" ");
}

function convertApplyLabel(instructorStatus: string): string {
  switch (instructorStatus) {
    case "APPLIED":
      return "신청됨";
    case "PENDING":
      return "확정대기";
    case "CONFIRMED":
      return "신청 완료";
    default:
      return "-";
  }
}

function convertStatusLabel(status: string): string {
  switch (status) {
    case "RECRUITING":
      return "모집 중";
    case "ALLOCATING":
      return "배정 중";
    case "CONFIRMED":
      return "배정 완료";
    default:
      return "상태 없음";
  }
}

function formatDate(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 10).replace(/-/g, "/");
}
