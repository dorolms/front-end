// src/app/instructor/lectures/ClientPage.tsx
"use client";

import { useEffect, useState } from "react";
import LectureTabs, { LectureTab } from "./components/LectureTabs";
import LectureListView from "./components/list/LectureListView";
import LectureCalendarView from "./components/calendar/LectureCalendarView";
// 💡 LectureDetail 타입으로 변경
import type { LectureDetail } from "./types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ClientPage() {
  const [tab, setTab] = useState<LectureTab>("list");
  // 💡 lectures 상태의 타입을 Lecture[]에서 LectureDetail[]로 변경
  const [lectures, setLectures] = useState<LectureDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔑 localStorage에서 토큰 꺼내기
        const accessToken =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : "";

        const res = await fetch(`${baseUrl}/api/lectures/lectures/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // 💥 핵심!
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`API 호출 실패 (status: ${res.status})`);
        }

        // 💡 응답 데이터의 타입을 LectureDetail[]로 캐스팅
        const data = (await res.json()) as LectureDetail[];
        setLectures(data);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "알 수 없는 에러");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div>
      <LectureTabs value={tab} onChange={setTab} />
      {tab === "list" ? (
        // 💡 lectures는 LectureDetail[] 타입으로 전달됨
        <LectureListView lectures={lectures} />
      ) : (
        // 💡 lectures는 LectureDetail[] 타입으로 전달됨
        <LectureCalendarView lectures={lectures} />
      )}
    </div>
  );
}
