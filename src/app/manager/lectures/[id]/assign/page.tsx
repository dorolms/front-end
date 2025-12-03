'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
// import { getLectureDetail, type LectureDetail, type Applicant, type LectureRole, type DbAssignmentStatus } from './api-mock';
import { getLectureDetail, patchApplications, type LectureDetail, type Application, type LectureRole, type AssignmentStatus, type patchData } from './api';

import { isTokenValid, getUserRole } from './jwt';

import {
  PageContainer, Header, PageTitle, StatusBadge, BackButton,
  ContentWrapper, SectionMenu, MenuItem, RightPanel, ScrollArea,
  Section, SectionTitle, DetailRow, DetailLabel, DetailValue,
  AttachmentLink, FilterTabs, FilterButton, TableContainer,
  Table, Thead, Tbody, RoleBadge, ApplicantName, ApplicantMeta,
  StatusSelect, FixedBottomBar, Button, LoadingState,
} from './styles';

// --- 타입 정의 (UI 전용) ---
type UiAssignmentStatus = 'pending' | 'assigned_main' | 'assigned_assist' | 'rejected';
type SectionKey = 'info' | 'applications';

export default function LectureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();

  const { id } = use(params);
  const [lecture, setLecture] = useState<LectureDetail | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [initapplications, setInitApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionKey>('info');
  const [activeFilter, setActiveFilter] = useState<'all' | 'main' | 'assist'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    info: useRef<HTMLElement>(null),
    applications: useRef<HTMLElement>(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getLectureDetail(parseInt(id));
        setLecture(data);
        setApplications(data.applications);
        setInitApplications(JSON.parse(JSON.stringify(data.applications)));
      } catch (error) {
        console.error("Failed to load data", error);
        alert("데이터 로딩 실패");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return applications;
    return applications.filter(app => app.applied_role === activeFilter);
  }, [applications, activeFilter]);

  const stats = useMemo(() => ({
    total: applications.length,
    main: applications.filter(a => a.applied_role === 'main').length,
    assist: applications.filter(a => a.applied_role === 'assist').length
  }), [applications]);

  const handleScroll = useCallback(() => {
    const container = scrollAreaRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      setActiveSection('applications');
      return;
    }
    const appTop = sectionRefs.applications.current?.offsetTop || 0;
    const detectLine = scrollTop + 100;
    setActiveSection(detectLine >= appTop ? 'applications' : 'info');
  }, []);

  const scrollToSection = (key: SectionKey) => {
    const container = scrollAreaRef.current;
    const section = sectionRefs[key].current;
    if (container && section) {
      container.scrollTo({ top: section.offsetTop - 20, behavior: 'smooth' });
    }
  };

  const getUiStatusValue = (status: AssignmentStatus, role: LectureRole | null): UiAssignmentStatus => {
    if (status === 'assigned') {
      return role === 'main' ? 'assigned_main' : 'assigned_assist';
    }
    return status === 'rejected' ? 'rejected' : 'pending';
  };

  const handleStatusChange = (id: number, uiValue: UiAssignmentStatus) => {
    let newStatus: AssignmentStatus = 'pending';

    if (uiValue === 'assigned_main') {
      newStatus = 'assigned';
    } else if (uiValue === 'assigned_assist') {
      newStatus = 'assigned';
    } else if (uiValue === 'rejected') {
      newStatus = 'rejected';
    }

    setApplications((prev: Application[]) => prev.map((app: Application) => 
      app.id === id 
        ? { ...app, assignment_status: newStatus } 
        : app
    ));
  };

  // [수정] 저장 버튼 핸들러: 변경된 것만 필터링
  const handleSaveChanges = async () => { // async 추가
    // 1. 변경된 항목 찾기 (Dirty Checking)
    const changedItems = applications.filter(curApp => {
      // 원본에서 동일한 ID를 가진 지원을 찾음
      const originalApp = initapplications.find(init => init.id === curApp.id);
      
      if (!originalApp) return false; // 원본에 없으면(그럴 일은 없겠지만) 패스

      // 상태나 배정된 역할이 하나라도 다르면 '변경된 데이터'로 간주
      return (
        curApp.assignment_status !== originalApp.assignment_status ||
        curApp.applied_role !== originalApp.applied_role
      );
    });

    // 2. 변경사항이 없으면 알림 후 중단
    if (changedItems.length === 0) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    if (!confirm(`총 ${changedItems.length}건의 변경사항을 저장하시겠습니까?`)) return;
    
    setIsSubmitting(true);
    
    // 3. 변경된 항목만 Payload 구성
    const payload = changedItems.map((app: Application) => ({ 
      id: app.id, // API 스펙에 맞춘 ID
      lecture: app.lecture,
      assignment_status: app.assignment_status,
      applied_role: app.applied_role
    }));
    
    console.log('🚀 [API Payload - Changed Only]', payload);

    try {
      // TODO: 실제 API 호출 (예: await axios.patch('/api/lectures/applications/bulk', payload))
      
      payload.forEach(patchApplications);
      
      alert('저장되었습니다.');
      
      // [중요] 저장이 성공했으므로, 현재 상태를 다시 '원본'으로 갱신 (기준점 재설정)
      setInitApplications(JSON.parse(JSON.stringify(applications)));
      
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !lecture || !isAuthChecked) {
    return <PageContainer><LoadingState>로딩중...</LoadingState></PageContainer>;
  }

  return (
    <PageContainer>
      <Header>
        <PageTitle>강의 상세 및 배정<StatusBadge>모집중</StatusBadge></PageTitle>
        <BackButton onClick={() => router.back()}>목록으로</BackButton>
      </Header>

      <ContentWrapper>
        <SectionMenu>
          <MenuItem $isActive={activeSection === 'info'} onClick={() => scrollToSection('info')}>강의 상세 정보</MenuItem>
          <MenuItem $isActive={activeSection === 'applications'} onClick={() => scrollToSection('applications')}>지원자 관리 ({applications.length})</MenuItem>
        </SectionMenu>

        <RightPanel>
          <ScrollArea ref={scrollAreaRef} onScroll={handleScroll}>
            
            {/* 1. 강의 상세 정보 */}
            <Section ref={sectionRefs.info}>
              <SectionTitle>강의 상세 정보</SectionTitle>
              <DetailRow><DetailLabel>강의 제목</DetailLabel><DetailValue style={{ fontSize: '18px', fontWeight: 700 }}>{lecture.title}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의 유형</DetailLabel><DetailValue>{lecture.type} / {lecture.category}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>교육 대상</DetailLabel><DetailValue>{lecture.target}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>인원</DetailLabel><DetailValue>{lecture.capacity}</DetailValue></DetailRow>
              {/* <DetailRow><DetailLabel>일시</DetailLabel><DetailValue>{lecture.period_start} ~ {lecture.period_end}</DetailValue></DetailRow> */}
              <DetailRow><DetailLabel>장소</DetailLabel><DetailValue>{lecture.location}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>담당자</DetailLabel><DetailValue>{lecture.manager_name} ({lecture.manager_phone})</DetailValue></DetailRow>
              <DetailRow><DetailLabel>콘텐츠</DetailLabel><DetailValue>{lecture.content}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>첨부파일</DetailLabel><DetailValue>{lecture.attachment_url ? <AttachmentLink href="#">📎 {lecture.attachment_url}</AttachmentLink> : <span style={{color:'#999'}}>없음</span>}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>모집</DetailLabel><DetailValue>주 {lecture.recruitment_main}명 / 보조 {lecture.recruitment_assist}명</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의료</DetailLabel><DetailValue>{lecture.fee}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>마감일</DetailLabel><DetailValue className="highlight">{lecture.end_date} 까지</DetailValue></DetailRow>
              <DetailRow><DetailLabel>특이사항</DetailLabel><DetailValue className="highlight">{lecture.note}</DetailValue></DetailRow>
            </Section>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }} />

            {/* 2. 지원자 관리 */}
            <Section ref={sectionRefs.applications}>
              <SectionTitle>지원자 관리</SectionTitle>
              <FilterTabs>
                <FilterButton $active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>전체 ({stats.total})</FilterButton>
                <FilterButton $active={activeFilter === 'main'} onClick={() => setActiveFilter('main')}>주도로쌤 ({stats.main})</FilterButton>
                <FilterButton $active={activeFilter === 'assist'} onClick={() => setActiveFilter('assist')}>보조도로쌤 ({stats.assist})</FilterButton>
              </FilterTabs>

              <TableContainer>
                <Table>
                  <Thead>
                    <tr>
                      <th style={{ width: '20%' }}>이름</th>
                      <th style={{ width: '15%' }}>지원 분야</th>
                      <th style={{ width: '15%' }}>지원일</th>
                      <th style={{ width: '25%' }}>배정 상태</th>
                      <th style={{ width: '25%' }}>읽음 상태</th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {filteredList.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <ApplicantName>{app.user.name}</ApplicantName>
                          <ApplicantMeta>{app.user.major}</ApplicantMeta>
                        </td>
                        <td>
                          <RoleBadge key={app.applied_role} $role={app.applied_role}>
                            {app.applied_role === 'main' ? '주강사' : '보조'}
                          </RoleBadge>
                        </td>
                        <td><ApplicantMeta>{app.created_at}</ApplicantMeta></td>
                        <td>
                          <StatusSelect 
                            value={getUiStatusValue(app.assignment_status, app.applied_role)}
                            $status={app.assignment_status}
                            $assignedRole={app.applied_role}
                            onChange={(e) => handleStatusChange(app.id, e.target.value as UiAssignmentStatus)}
                            >
                            <option value="pending">대기중</option>
                            <option value="assigned_main">주도로쌤 배정</option>
                            <option value="assigned_assist">보조도로쌤 배정</option>
                            <option value="rejected">반려</option>
                          </StatusSelect>
                        </td>
                        <td>
                        </td>
                      </tr>
                    ))}
                    {filteredList.length === 0 && (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>해당 조건의 지원자가 없습니다.</td></tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Section>

          </ScrollArea>

          <FixedBottomBar>
            <Button type="button" onClick={() => router.back()} $variant="secondary">취소</Button>
            <Button type="button" onClick={handleSaveChanges} $variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '변경사항 저장'}
            </Button>
          </FixedBottomBar>
        </RightPanel>
      </ContentWrapper>

    </PageContainer>
  );
}