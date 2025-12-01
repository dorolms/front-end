// src/app/instructor/lectures/components/list/LectureListView.tsx

"use client";

import { useMemo, useState } from "react";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import LectureListTable, { LectureListRow } from "./LectureListTable";
import type { Lecture, LectureApiStatus } from "../../types"; // types.ts 수정한 거 기준

const PAGE_SIZE = 10;

type Props = {
  lectures: Lecture[];
};

export default function LectureListView({ lectures }: Props) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // ⭐ API 데이터 → 테이블 UI용으로 변환
  const allRows: LectureListRow[] = lectures.map((e, idx) => ({
    id: e.id,
    no: idx + 1,
    type: convertType(e.type),
    division: e.category ?? "",
    title: e.title ?? "",
    // 🔥 end_date 사용해서 "신청기간" 표시
    applicationPeriod: "~ " + formatDate(e.end_date),
    applicationLabel: "-", // (나중에 my_application_status로 바꿀 수 있음)
    statusLabel: convertStatus(e.status),
  }));

  const filteredRows = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((row) => row.title.toLowerCase().includes(q));
  }, [allRows, keyword]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => setPage(1)}
        />
      </div>

      <LectureListTable rows={pageRows} />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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
    COMPETITION: "배정 완료", // 지금은 이렇게 매핑
  };
  return map[status] ?? "상태 없음";
}

function formatDate(date: string | null | undefined) {
  if (!date) return "";
  return date.slice(0, 10).replace(/-/g, "/");
}
