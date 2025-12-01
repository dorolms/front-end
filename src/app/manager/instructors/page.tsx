'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { getInstructors, type Instructor } from './api-mock';
import { getInstructorList, getInstructorDetail, type InstructorBasic, type InstructorDetail } from './api';

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

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// --- Main Component ---

export default function InstructorLookupPage() {
  const router = useRouter();
  const [instructors, setInstructors] = useState<InstructorBasic[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<InstructorDetail | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(true); // 목록 로딩 상태
  const [isLoadingDetail, setIsLoadingDetail] = useState(false); // 상세 정보 로딩 상태
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    // 1) 토큰 자체가 없으면 -> 로그인으로
    if (!token) {
      alert('로그인이 필요한 페이지입니다.');
      router.replace('/');
      return;
    }

    const decoded = parseJwt(token);
    // 2) [추가] 토큰 형식이 잘못되어 파싱 실패 (null) -> 로그인으로
    if (!decoded) {
      alert('인증 정보가 올바르지 않습니다. 다시 로그인해주세요.');
      localStorage.removeItem('accessToken'); // 잘못된 토큰 삭제
      localStorage.removeItem('refreshToken'); // 잘못된 토큰 삭제
      localStorage.removeItem('userRole'); // 잘못된 토큰 삭제
      localStorage.removeItem('userName'); // 잘못된 토큰 삭제
      router.replace('/'); // 또는 '/login'
      return;
    }
    
    // 2) [핵심] 토큰은 있는데, 역할이 'manager'가 아니면 -> 튕겨내기
    // (주의: 백엔드 토큰 구조에 따라 decoded.role 또는 decoded.payload.role 일 수 있습니다)
    if (decoded?.role !== 'manager') { 
      alert('관리자만 접근할 수 있는 페이지입니다.');
      router.replace('/instructor/dashboard'); // 강사 대시보드(또는 홈)로 이동
      return;
    }

    setIsAuthChecked(true);
    
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthChecked) return;

       try {
        setIsLoadingList(true);
        const data = await getInstructorList();
        setInstructors(data);
      } catch (error: any) { 
        console.error(error);
        
        // 401 Unauthorized 에러 처리
        if (axios.isAxiosError(error) && error.response?.status === 401) {
           alert('세션이 만료되었습니다. 다시 로그인해주세요.');
           router.replace('/');
           return;
        }
        
        // 그 외 에러는 콘솔에만 로그 (사용자에게는 빈 목록 보여줌)
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchData();
  }, [router, isAuthChecked]);

  const filtered = instructors.filter(inst => 
    inst.name.includes(searchTerm) || 
    // inst.email.includes(searchTerm) || 
    inst.major.includes(searchTerm)
  );

  const handleSelect = async (inst: InstructorBasic) =>  {
    setSearchTerm(inst.name);
    setShowDropdown(false);
    
    try {
      setIsLoadingDetail(true);
      // ID로 상세 정보 조회
      const detailData = await getInstructorDetail(inst.id);
      setSelectedInstructor(detailData);
    } catch (error) {
      console.error("상세 정보 로딩 실패", error);
      alert("강사 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  if (!isAuthChecked) {
    return null;
  }

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
            placeholder={isSearchFocused ? "이름, 전공으로 검색..." : "강사 선택"}
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
            disabled={isLoadingList} // 로딩 중엔 입력 방지
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
                <DropdownItem key={inst.id} onMouseDown={() => handleSelect(inst)}>
                  <div className="name">{inst.name}</div>
                  <div className="meta">
                    {inst.major}
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
              </NameTag>
              
              <ContactInfo>
                <div>📞 {selectedInstructor.phone_number ? selectedInstructor.phone_number : "xxx-xxxx-xxxx"}</div>
                <div>📧 {selectedInstructor.email ? selectedInstructor.email : "xxxxx@xxx.com"}</div>
              </ContactInfo>

              <BioBox>{selectedInstructor.major}</BioBox>
            </ProfileInfo>
          </ProfileCard>
        )}
      </TopFixedArea>

      {/* 3. 포트폴리오 상세 내용 */}
      {isLoadingDetail ? (
        <EmptyState>상세 정보를 불러오는 중입니다... ⏳</EmptyState>
      ) : selectedInstructor ? (
        <PortfolioSection>
          <PortfolioHeader>
            <SectionTitle>포트폴리오</SectionTitle>
          </PortfolioHeader>
          
          <PortfolioScrollArea>
            <PortfolioContent>
              {selectedInstructor.portfolio || '등록된 포트폴리오 내용이 없습니다.'}
            </PortfolioContent>
          </PortfolioScrollArea>
        </PortfolioSection>
      ) : (
        <EmptyState>
          강사를 선택하여 상세 정보를 확인하세요.
        </EmptyState>
      )}
    </PageContainer>
  );
}