
"use client";

import Image from "next/image";
import styled from "styled-components";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Shell = styled.div`
  height: calc(100vh - 60px); /* Fill viewport minus approx header height */
  display: grid;
  grid-template-columns: 300px 1fr 280px;
  overflow: hidden; /* Prevent outer scroll */
`;

// --- Left Section (Preserved) ---
const Left = styled.section`
  background-color: #2c2c2c;
  color: #fff;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto; /* Allow scrolling if content is too tall */
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin: 4px 0 8px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: none;
  background: #fff;
  color: #111;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 6px;

  &:first-of-type {
    background-color: #3478f6;
    color: white;
  }

  &:last-of-type {
    background: none;
    color: #aaa;
  }

  &:last-of-type:hover {
    color: #fff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// --- Center Section (Preserved) ---
const Center = styled.section`
  position: relative;
  height: 100%;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 16px;
  text-align: center;

  h1 {
    font-size: 28px;
    margin: 0 0 8px;
  }
  p {
    opacity: 0.9;
  }
`;

// --- Right Section (Refined Design) ---
const Right = styled.section`
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eaeaea;
  height: 100%;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  padding: 32px 24px 24px; /* Fixed header padding */
  flex-shrink: 0;
  display: flex;
  align-items: center;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #222;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    /* Blue accent bar */
    &::before {
      content: '';
      display: block;
      width: 4px;
      height: 16px;
      background-color: #3478f6;
      border-radius: 2px;
    }
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 32px; /* Scrollable area padding */

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LectureCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  border: 1px solid transparent;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(52, 120, 246, 0.08);
    border-color: rgba(52, 120, 246, 0.15);
  }
`;

const DateBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: #f0f7ff;
  border-radius: 12px;
  color: #3478f6;
  flex-shrink: 0;
  margin-top: 2px;

  .month {
    font-size: 10px;
    font-weight: 700;
    color: #7aa5f9;
    text-transform: uppercase;
    line-height: 1;
    margin-bottom: 2px;
  }
  .day {
    font-size: 18px;
    font-weight: 800;
    line-height: 1;
  }
`;

const InfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
`;

const LectureTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  word-break: keep-all;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #888;
  font-weight: 500;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.6;
    flex-shrink: 0;
  }
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 13px;
  background: #fff;
  border-radius: 12px;
  border: 1px dashed #e0e0e0;
`;

// Simple Icons
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

type UpcomingLecture = {
  id: number;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  lecture_id: number;
  lecture_title: string;
  lecture_location: string;
  lecture_status: string;
  confirmed_instructors: string[];
};

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<"instructor" | "manager">("instructor");
  const [userId, setUserId] = useState(""); // username = 로그인용 ID
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [upcomingLectures, setUpcomingLectures] = useState<UpcomingLecture[]>(
    []
  );
  const [isUpcomingLoading, setIsUpcomingLoading] = useState(false);
  const [upcomingError, setUpcomingError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!userId || !password) {
      setErrorMessage("로그인 ID와 비밀번호를 입력해주세요.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${baseUrl}/api/accounts/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userId, // 로그인용 user_id
          password,
          role, // instructor / manager
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let message =
          (data && (data.detail as string)) ||
          "로그인에 실패했습니다. 입력 정보를 다시 확인해주세요.";

        if (data && typeof data === "object" && !data.detail) {
          const firstKey = Object.keys(data)[0];
          const firstValue = (data as any)[firstKey];

          if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
            message = firstValue[0];
          } else if (typeof firstValue === "string") {
            message = firstValue;
          }
        }

        throw new Error(message);
      }

      if (typeof window !== "undefined") {
        if (data?.access) {
          window.localStorage.setItem("accessToken", data.access);
        }
        if (data?.refresh) {
          window.localStorage.setItem("refreshToken", data.refresh);
        }
        if (data?.role) {
          window.localStorage.setItem("userRole", data.role);
        }
        if (data?.name) {
          window.localStorage.setItem("userName", data.name);
        }
      }

      const userRole = data?.role || role;

      if (userRole === "manager") {
        router.push("/manager/dashboard");
      } else {
        router.push("/instructor/dashboard");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.message ||
          "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 공개용 예정 강의 조회
  useEffect(() => {
    const fetchUpcomingLectures = async () => {
      setIsUpcomingLoading(true);
      setUpcomingError(null);

      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

        const response = await fetch(
          `${baseUrl}/api/lectures/schedules/public-upcoming/`
        );

        if (!response.ok) {
          throw new Error("예정 강의를 불러오지 못했습니다.");
        }

        const data: UpcomingLecture[] = await response.json();

        // 최대 10개만 사용
        setUpcomingLectures((data || []).slice(0, 10));
      } catch (err: any) {
        console.error(err);
        setUpcomingError(
          err?.message || "예정 강의 정보를 불러오는 중 오류가 발생했습니다."
        );
      } finally {
        setIsUpcomingLoading(false);
      }
    };

    fetchUpcomingLectures();
  }, []);

  const formatTimeRange = (start: string, end: string) => {
    // "HH:MM:SS" → "HH:MM"
    const s = start?.slice(0, 5) || "";
    const e = end?.slice(0, 5) || "";
    return `${s} ~ ${e}`;
  };

  const getMonthDay = (dateStr: string) => {
    if (!dateStr) return { month: "-", day: "-" };
    const [year, month, day] = dateStr.split("-");
    return { month: `${month}월`, day };
  };

  return (
    <>
      <Header isAuth={false} />
      <Shell>
        <Left>
          <Logo>DORO</Logo>
          <Title>LOGIN</Title>
          <Select
            value={role}
            onChange={(e) =>
              setRole(e.target.value === "manager" ? "manager" : "instructor")
            }>
            <option value="instructor">강사</option>
            <option value="manager">매니저</option>
          </Select>
          <Input
            type="text"
            placeholder="ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Input
            type="password"
            placeholder="PW"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && (
            <p
              style={{
                color: "#ff6b6b",
                fontSize: 12,
                marginTop: 4,
                marginBottom: 0,
              }}>
              {errorMessage}
            </p>
          )}
          <Button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "로그인 중..." : "Login"}
          </Button>
          <Button onClick={() => router.push("/auth/signup")}>회원가입</Button>
        </Left>

        <Center>
          <Image
            src="/robot-bg.jpg"
            alt="로봇 이미지"
            fill
            style={{ objectFit: "cover" }}
          />
          <Overlay>
            <h1>“알면 즐겁고, 모르면 두렵다.”</h1>
            <p>DORO</p>
          </Overlay>
        </Center>

        <Right>
          <SectionHeader>
            <h3>예정 강의</h3>
          </SectionHeader>

          <ScrollableContent>
            {isUpcomingLoading ? (
              <EmptyState>일정을 불러오는 중입니다...</EmptyState>
            ) : upcomingError ? (
              <EmptyState style={{ color: "#ff6b6b" }}>{upcomingError}</EmptyState>
            ) : upcomingLectures.length === 0 ? (
              <EmptyState>현재 예정된 강의가 없습니다.</EmptyState>
            ) : (
              <ListContainer>
                {upcomingLectures.map((item) => {
                  const { month, day } = getMonthDay(item.date);
                  return (
                    <LectureCard key={item.id}>
                      <DateBadge>
                        <span className="month">{month}</span>
                        <span className="day">{day}</span>
                      </DateBadge>
                      <InfoBox>
                        <LectureTitle>{item.lecture_title}</LectureTitle>
                        <MetaRow>
                          <MetaItem>
                            <ClockIcon />
                            {formatTimeRange(item.start_time, item.end_time)}
                          </MetaItem>
                          {item.lecture_location && (
                            <MetaItem>
                              <LocationIcon />
                              {item.lecture_location}
                            </MetaItem>
                          )}
                        </MetaRow>
                      </InfoBox>
                    </LectureCard>
                  );
                })}
              </ListContainer>
            )}
          </ScrollableContent>
        </Right>
      </Shell>
    </>
  );
}
