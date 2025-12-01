// src/app/page.tsx
"use client";

import Image from "next/image";
import styled from "styled-components";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Shell = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 300px 1fr 280px;
`;

const Left = styled.section`
  background-color: #2c2c2c;
  color: #fff;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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

const Center = styled.section`
  position: relative;
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

const Right = styled.section`
  background-color: #f8f8f8;
  padding: 24px;
`;

export default function LoginPage() {
  const router = useRouter();

  const [role, setRole] = useState<"instructor" | "manager">("instructor");
  const [userId, setUserId] = useState(""); // username = 로그인용 ID
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!userId || !password) {
      setErrorMessage("로그인 ID와 비밀번호를 입력해주세요.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

      const response = await fetch(`${baseUrl}/accounts/auth/login`, {
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
            }
          >
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
              }}
            >
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
          <h3>예정 강의</h3>
          <ul>
            <li>[11:00~13:00] 데이터베이스 - 홍철용 교수</li>
            <li>[13:00~15:00] 알고리즘 - 김지수 교수</li>
          </ul>
        </Right>
      </Shell>
    </>
  );
}
