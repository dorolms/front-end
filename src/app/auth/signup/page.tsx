// src/app/auth/signup/page.tsx
"use client";

import Image from "next/image";
import styled from "styled-components";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Shell = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 380px 1fr;
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

const Subtitle = styled.p`
  font-size: 13px;
  color: #bbbbbb;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: none;
  background: #fff;
  color: #111;
  font-size: 14px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #cccccc;
  margin-top: 4px;
  margin-bottom: 4px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  min-height: 72px;
  border-radius: 4px;
  border: none;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 8px;
`;

const Button = styled.button<{ variant?: "primary" | "ghost" }>`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  border: none;

  background-color: ${({ variant }) =>
    variant === "ghost" ? "transparent" : "#3478f6"};
  color: ${({ variant }) => (variant === "ghost" ? "#aaa" : "#fff")};

  &:hover {
    ${({ variant }) =>
      variant === "ghost" ? "color: #fff;" : "background-color: #285fca;"}
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HelperRow = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #aaaaaa;
  text-align: center;

  button {
    background: none;
    border: none;
    color: #ffffff;
    font-size: 12px;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 4px;
    padding: 0;

    &:hover {
      color: #ffffff;
    }
  }
`;

const ErrorText = styled.p`
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
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
    font-size: 26px;
    margin: 0 0 8px;
  }
  p {
    opacity: 0.9;
    font-size: 14px;
  }
`;

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"instructor" | "manager">("instructor");

  const [userId, setUserId] = useState(""); // 로그인용 ID (username)
  const [name, setName] = useState(""); // 실제 이름
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 강사용
  const [major, setMajor] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");

  // 매니저용
  const [phoneNum, setPhoneNum] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const validateForm = () => {
    if (!userId || !name || !email || !password || !passwordConfirm) {
      return "로그인 ID, 이름, 이메일, 비밀번호를 모두 입력해주세요.";
    }

    if (password.length < 8) {
      return "비밀번호는 8자 이상이어야 합니다.";
    }

    if (password !== passwordConfirm) {
      return "비밀번호가 일치하지 않습니다.";
    }

    if (role === "instructor") {
      if (!major) return "강사 전공을 입력해주세요.";
      if (!portfolio) return "포트폴리오를 입력해주세요.";
    }

    if (role === "manager") {
      if (!phoneNum) return "매니저 전화번호를 입력해주세요.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setFieldError(errorMessage);
      return;
    }

    setFieldError(null);
    setIsLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

      const payload: any = {
        username: userId, // 로그인용 ID
        name, // 실제 이름
        email,
        password,
        role,
      };

      if (role === "instructor") {
        payload.major = major;
        payload.portfolio = portfolio;
        if (profilePhotoUrl) {
          payload.profile_photo_url = profilePhotoUrl;
        }
      } else if (role === "manager") {
        payload.phone_num = phoneNum;
      }

      const response = await fetch(`${baseUrl}/accounts/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let message =
          (data && (data.detail as string)) ||
          "회원가입에 실패했습니다. 입력 정보를 다시 확인해주세요.";

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

      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      router.push("/");
    } catch (error: any) {
      console.error(error);
      setFieldError(
        error?.message ||
          "회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
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
          <Title>SIGN UP</Title>
          <Subtitle>
            역할에 맞는 정보를 입력하고 DORO와 함께 시작해보세요.
          </Subtitle>

          <Label>역할</Label>
          <Select
            value={role}
            onChange={(e) =>
              setRole(e.target.value === "manager" ? "manager" : "instructor")
            }
          >
            <option value="instructor">강사</option>
            <option value="manager">매니저</option>
          </Select>

          <Label>로그인 ID</Label>
          <Input
            type="text"
            placeholder="로그인에 사용할 ID를 입력하세요"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <Label>이름</Label>
          <Input
            type="text"
            placeholder="실제 이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Label>이메일</Label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Label>비밀번호</Label>
          <Input
            type="password"
            placeholder="8자 이상 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Label>비밀번호 확인</Label>
          <Input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          {role === "instructor" && (
            <>
              <Label>전공</Label>
              <Input
                type="text"
                placeholder="예: 컴퓨터공학과"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />

              <Label>포트폴리오</Label>
              <TextArea
                placeholder="주요 강의 이력, 프로젝트 등을 간단히 적어주세요."
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />

              <Label>프로필 이미지 URL (선택)</Label>
              <Input
                type="text"
                placeholder="이미지 주소를 입력하세요"
                value={profilePhotoUrl}
                onChange={(e) => setProfilePhotoUrl(e.target.value)}
              />
            </>
          )}

          {role === "manager" && (
            <>
              <Label>전화번호</Label>
              <Input
                type="tel"
                placeholder="예: 010-1234-5678"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
              />
            </>
          )}

          {fieldError && <ErrorText>{fieldError}</ErrorText>}

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "가입 처리 중..." : "회원가입"}
          </Button>

          <HelperRow>
            이미 계정이 있으신가요?
            <button type="button" onClick={() => router.push("/")}>
              로그인 하기
            </button>
          </HelperRow>
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
      </Shell>
    </>
  );
}
