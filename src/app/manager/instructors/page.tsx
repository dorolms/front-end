'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getInstructors, type Instructor } from './api-mock';

// --- Styled Components ---

const PageContainer = styled.div`
  width: 100%;
  /* [유지] 상단 Nav 바 고려 패딩 (100px) */
  padding: 40px 40px 0 40px; 
  background-color: #f9fafb;
  /* [유지] 화면 전체 높이 고정 */
  height: calc(100vh - 80px); 
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden; 
`;

const Header = styled.div`
  flex-shrink: 0;
  h1 { font-size: 26px; font-weight: 800; color: #111; margin: 0; }
  p { font-size: 14px; color: #666; margin-top: 8px; }
`;

const TopFixedArea = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 10px;
`;

// 1. 검색 드롭다운 영역
const SearchSection = styled.div`
  position: relative; width: 100%; max-width: 500px;
`;

const SearchInput = styled.input`
  width: 100%; padding: 14px 16px; font-size: 15px; border: 1px solid #e5e7eb;
  border-radius: 10px; background-color: white;
  padding-right: 40px; /* 화살표 공간 */
  transition: all 0.2s;
  
  /* placeholder 색상 흐리게 */
  &::placeholder { color: #9ca3af; transition: color 0.2s; }

  &:focus { outline: none; border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1); }
`;

// [추가] 드롭다운 화살표 아이콘 (스타일만 추가)
const ArrowIcon = styled.div`
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  color: #9ca3af; pointer-events: none;
  display: flex; align-items: center;
`;

const DropdownList = styled.ul`
  position: absolute; top: 100%; left: 0; right: 0; margin-top: 8px;
  background: white; border: 1px solid #e5e7eb; border-radius: 10px;
  max-height: 300px; overflow-y: auto; z-index: 50;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
  list-style: none; padding: 4px 0;

  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; }
`;

const DropdownItem = styled.li`
  padding: 12px 16px; cursor: pointer; display: flex; flex-direction: column; gap: 2px;
  border-bottom: 1px solid #f3f4f6;
  &:last-child { border-bottom: none; }
  &:hover { background-color: #f3f4f6; }
  
  .name { font-weight: 600; color: #111; font-size: 15px; }
  .meta { font-size: 12px; color: #888; }
`;

// 2. 명함 스타일 프로필
const ProfileCard = styled.div`
  background: white; border-radius: 16px; padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;
  display: flex; align-items: flex-start; gap: 30px;
`;

const ProfileImage = styled.div`
  width: 100px; height: 100px; border-radius: 50%; flex-shrink: 0;
  background-color: #e0e7ff; color: #4f46e5;
  display: flex; justify-content: center; align-items: center;
  font-size: 36px; font-weight: 700;
  border: 4px solid #f5f3ff;
`;

const ProfileInfo = styled.div`
  flex: 1; display: flex; flex-direction: column; gap: 10px;
`;

const NameTag = styled.div`
  display: flex; align-items: center; gap: 10px;
  h2 { font-size: 22px; font-weight: 800; color: #111; margin: 0; }
  span { background: #f3f4f6; color: #4b5563; font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 500; }
`;

const ContactInfo = styled.div`
  display: flex; gap: 16px;
  font-size: 14px; color: #4b5563;
  div { display: flex; align-items: center; gap: 6px; }
`;

const BioBox = styled.div`
  padding: 12px 16px; background-color: #f9fafb; border-radius: 8px;
  font-size: 14px; color: #374151; line-height: 1.5; white-space: pre-wrap;
  border: 1px solid #f3f4f6;
`;

// 3. 포트폴리오 상세 (구조 변경)

// [유지] 카드 형태로 디자인 변경
const PortfolioSection = styled.div`
  flex: 1;
  min-height: 0; /* Flex 자식 스크롤 필수 */
  background: white; 
  
  /* [유지] 전체 둥글게 */
  border-radius: 16px;
  
  /* [유지] 하단 여백 추가 (바닥에서 띄우기) */
  margin-bottom: 40px;
  
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb; /* 테두리 복구 */
  
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내부 스크롤이 둥근 모서리 침범 방지 */
`;

// 고정된 헤더 영역
const PortfolioHeader = styled.div`
  flex-shrink: 0;
  padding: 30px 40px 20px;
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  z-index: 10;
`;

// 실제 스크롤되는 내용 영역
const PortfolioScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 30px 40px 60px;

  &::-webkit-scrollbar { width: 10px; }
  &::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 5px; border: 2px solid #fff; }
  &::-webkit-scrollbar-track { background-color: transparent; }
`;

const SectionTitle = styled.h3`
  font-size: 18px; font-weight: 700; color: #111; margin: 0;
`;

const PortfolioContent = styled.div`
  font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-wrap;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  color: #9ca3af; font-size: 16px; 
  background: white; border-radius: 16px; border: 1px dashed #e5e7eb;
  margin-bottom: 40px; /* 하단 여백 */
`;

// --- Main Component ---

export default function InstructorLookupPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  
  // [추가] 검색창 포커스 상태 관리
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    getInstructors().then(setInstructors);
  }, []);

  const filtered = instructors.filter(inst => 
    inst.name.includes(searchTerm) || 
    inst.email.includes(searchTerm) || 
    (inst.bio && inst.bio.includes(searchTerm))
  );

  const handleSelect = (inst: Instructor) => {
    setSelectedInstructor(inst);
    setSearchTerm(inst.name);
    setShowDropdown(false);
  };

  return (
    <PageContainer>
      <Header>
        {/* [수정] 강사 선택 여부에 따라 헤더 텍스트 변경 */}
        <h1>{selectedInstructor ? '강사 상세 정보' : '강사 검색'}</h1>
        <p>
          {selectedInstructor 
            ? `${selectedInstructor.name} 강사의 프로필과 포트폴리오입니다.` 
            : '등록된 강사의 프로필과 포트폴리오를 검색하고 조회합니다.'}
        </p>
      </Header>

      <TopFixedArea>
        {/* 1. 검색 영역 */}
        <SearchSection>
          <SearchInput 
            // [수정] 포커스 여부에 따른 placeholder 변경
            placeholder={isSearchFocused ? "이름, 이메일, 이력으로 검색..." : "강사 선택"}
            value={searchTerm}
            onChange={(e) => { 
              setSearchTerm(e.target.value); 
              setShowDropdown(true); 
            }}
            // [수정] 포커스 시 상태 업데이트 & 입력값 비우기
            onFocus={() => {
              setIsSearchFocused(true);
              setSearchTerm(''); 
              setShowDropdown(true);
            }}
            // [수정] 포커스 해제 시 상태 복구 & 드롭다운 닫기 (지연)
            onBlur={() => {
              setIsSearchFocused(false);
              setTimeout(() => setShowDropdown(false), 200);
            }}
          />
          
          {/* [추가] 화살표 아이콘 */}
          <ArrowIcon>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </ArrowIcon>
          
          {showDropdown && (
            <DropdownList>
              {filtered.map(inst => (
                <DropdownItem key={inst.user_id} onMouseDown={() => handleSelect(inst)}>
                  <div className="name">{inst.name}</div>
                  <div className="meta">
                    {inst.bio ? inst.bio.split('\n')[0] : inst.email}
                  </div>
                </DropdownItem>
              ))}
              {filtered.length === 0 && (
                <li style={{padding:'12px', color:'#999', textAlign:'center'}}>검색 결과 없음</li>
              )}
            </DropdownList>
          )}
        </SearchSection>

        {/* 2. 명함 스타일 프로필 */}
        {selectedInstructor && (
          <ProfileCard>
            <ProfileImage>
              {selectedInstructor.profile_photo_url 
                ? <img src={selectedInstructor.profile_photo_url} alt="profile" style={{width:'100%', height:'100%', borderRadius:'50%'}} />
                : selectedInstructor.name[0]}
            </ProfileImage>
            
            <ProfileInfo>
              <NameTag>
                <h2>{selectedInstructor.name}</h2>
                <span>{selectedInstructor.role === 'instructor' ? '강사' : '매니저'}</span>
              </NameTag>
              
              <ContactInfo>
                <div>📞 {selectedInstructor.phone_number}</div>
                <div>📧 {selectedInstructor.email}</div>
              </ContactInfo>

              {selectedInstructor.bio && (
                <BioBox>{selectedInstructor.bio}</BioBox>
              )}
            </ProfileInfo>
          </ProfileCard>
        )}
      </TopFixedArea>

      {/* 3. 포트폴리오 상세 내용 */}
      {selectedInstructor ? (
        <PortfolioSection>
          {/* 고정 헤더 */}
          <PortfolioHeader>
            <SectionTitle>포트폴리오 및 상세 소개</SectionTitle>
          </PortfolioHeader>
          
          {/* 스크롤 본문 */}
          <PortfolioScrollArea>
            <PortfolioContent>
              {selectedInstructor.portfolio_content || '등록된 포트폴리오 내용이 없습니다.'}
            </PortfolioContent>
          </PortfolioScrollArea>
        </PortfolioSection>
      ) : (
        <EmptyState>
          강사를 검색하여 상세 정보를 확인하세요.
        </EmptyState>
      )}
    </PageContainer>
  );
}