'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
// import { getInstructors, type Instructor } from './api-mock';
import { getInstructorList, getInstructorDetail, type InstructorBasic, type InstructorDetail } from './api';
import { isTokenValid, getUserRole } from './jwt';

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
  // ContactInfo,
  PortfolioSection,
  PortfolioHeader,
  PortfolioScrollArea,
  SectionTitle,
  PortfolioContent,
  EmptyState,
  MajorWrapper, MajorBadge
  , Title
} from './styles';

// --- Main Component ---

export default function InstructorLookupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  
      // 1. 토큰 유효성 검사 (존재 여부 + 만료 여부)
      if (!isTokenValid(token)) {
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        localStorage.removeItem('accessToken'); // 잘못된 토큰 삭제
        localStorage.removeItem('refreshToken'); // 잘못된 토큰 삭제
        localStorage.removeItem('userRole'); // 잘못된 토큰 삭제
        localStorage.removeItem('userName'); // 잘못된 토큰 삭제
        router.replace('/');
        return;
      }
  
      // 2. 권한(Role) 검사 (필요한 경우)
      const role = getUserRole(token!); // 위에서 valid 체크 했으므로 ! 사용 가능
      if (role !== 'manager') {
        alert('접근 권한이 없습니다.');
        router.replace('/instructor/dashboard');
        return;
      }
      
      // 통과! -> 데이터 로딩 시작...
      setIsAuthChecked(true);
  
    }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthChecked) return;

       try {
        setIsLoadingList(true);
        const data = await getInstructorList();
        setInstructors(data);

        // 2) [추가] URL에 'id' 파라미터가 있는지 확인
        const paramId = searchParams.get('id');
        if (paramId) {
          const targetId = Number(paramId);
          // 목록에서 해당 강사가 존재하는지 확인 (유효성 체크)
          const targetInstructor = data.find(inst => inst.id === targetId);

          if (targetInstructor) {
            setSearchTerm(targetInstructor.name); // 검색창 이름 채우기
            
            // 상세 정보 가져오기
            setIsLoadingDetail(true);
            try {
              const detailData = await getInstructorDetail(targetId);
              setSelectedInstructor(detailData);
            } catch (err) {
              console.error("상세 정보 로딩 실패", err);
              // 실패 시 URL 파라미터 제거하거나 에러 표시 (선택 사항)
            } finally {
              setIsLoadingDetail(false);
            }
          }
          else {
            router.push("?", { scroll: false });
          }
        }

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
    String(inst.major).includes(searchTerm)
  );


  const handleSelect = async (inst: InstructorBasic) =>  {
    setSearchTerm(inst.name);
    setShowDropdown(false);
    
    try {
      setIsLoadingDetail(true);
      // ID로 상세 정보 조회
      const detailData = await getInstructorDetail(inst.id);
      setSelectedInstructor(detailData);
      router.push(`?id=${inst.id}`, { scroll: false });
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
    <>
    <Title>{selectedInstructor ? '강사 상세 정보' : '강사 검색'}</Title>
    <PageContainer>
      <Header>
        {/* [수정] 강사 선택 여부에 따라 헤더 텍스트 변경 */}
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
              <MajorWrapper>
              <MajorBadge>
                {/* 학사모 아이콘 */}
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                {selectedInstructor.major}
              </MajorBadge>
              
              {/* 필요시 학교나 다른 태그도 여기에 추가 가능 */}
              {/* <MajorBadge>🏫 한양대학교</MajorBadge> */}
            </MajorWrapper>
              {/* <ContactInfo>
                <div>📧 {selectedInstructor.email  || "xxxxx@xxx.com"}</div>
              </ContactInfo> */}
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
    </>
  );
}