// src/app/page.tsx
"use client";
import Image from "next/image";
import styled from "styled-components";
import Header from "@/components/common/Header";
import { useRouter } from "next/navigation";

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

  return (
    <>
      <Header isAuth={false} />
      <Shell>
        <Left>
          <Logo>DORO</Logo>
          <Title>LOGIN</Title>
          <Select>
            <option>강사</option>
            <option>매니저</option>
          </Select>
          <Input type="text" placeholder="ID" />
          <Input type="password" placeholder="PW" />
          <Button>Login</Button>
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
