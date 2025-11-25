"use client";

import { useState } from "react";
import { Wrap, BreadCrumb, Title } from "./styles";

import LectureTabs, { LectureTab } from "./components/LectureTabs";
import LectureListView from "./components/list/LectureListView";
import LectureCalendarView from "./components/calendar/LectureCalendarView";

export default function ClientPage() {
  const [activeTab, setActiveTab] = useState<LectureTab>("CALENDAR");

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 강의 관리</BreadCrumb>
      <Title>강의 관리</Title>

      <LectureTabs activeTab={activeTab} onChangeTab={setActiveTab} />

      {activeTab === "LIST" ? <LectureListView /> : <LectureCalendarView />}
    </Wrap>
  );
}
