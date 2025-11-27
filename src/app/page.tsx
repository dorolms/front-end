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
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
  if (!id || !password) {
    alert("아이디와 비밀번호를 입력해주세요.");
    return;
  }

  setIsLoading(true);
  try {
    // /api 까지 포함해서 기본 URL로
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

    const response = await fetch(`${baseUrl}/accounts/auth/login`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: id,
        password,
        role,
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        "로그인에 실패했습니다. 입력 정보를 다시 확인해주세요.";
      throw new Error(message);
    }

    if (typeof window !== "undefined") {
      if (data?.access) localStorage.setItem("accessToken", data.access);
      if (data?.refresh) localStorage.setItem("refreshToken", data.refresh);
      if (data?.role) localStorage.setItem("userRole", data.role);
      if (data?.name) localStorage.setItem("userName", data.name);
    }

    const userRole = data?.role || role;
    if (userRole === "manager") router.push("/manager/dashboard");
    else router.push("/instructor/dashboard");
  } catch (error: any) {
    console.error(error);
    alert(error?.message || "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Input
            type="password"
            placeholder="PW"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
