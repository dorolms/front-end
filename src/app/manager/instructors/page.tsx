'use client';

import React, { useState, useEffect } from 'react';
import { getInstructors, type Instructor } from './api-mock';

import {
PageContainer,
  Header,
  TopFixedArea,
  SearchSection,
  SearchInput,
  ArrowIcon,
  DropdownList,
  DropdownItem,
  ProfileCard,
  ProfileImage,
  ProfileInfo,
  NameTag,
  ContactInfo,
  BioBox,
  PortfolioSection,
  PortfolioHeader,
  PortfolioScrollArea,
  SectionTitle,
  PortfolioContent,
  EmptyState
} from './styles';

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