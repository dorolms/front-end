"use client";

import { useEffect } from "react";
import { api } from "@/apis/axios";

export default function TestApiPage() {
  useEffect(() => {
    api
      .get("/lectures")
      .then((res) => {
        console.log("🟢 API 성공:", res.data);
      })
      .catch((err) => {
        console.log("🔴 API 실패:", err);
      });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>API 테스트 페이지</h1>
      <p>콘솔을 확인하세요!</p>
    </div>
  );
}
