'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getLectureDetail, type LectureDetail, type Applicant, type LectureRole, type DbAssignmentStatus } from './api-mock';

import {
  PageContainer, Header, PageTitle, StatusBadge, BackButton,
  ContentWrapper, SectionMenu, MenuItem, RightPanel, ScrollArea,
  Section, SectionTitle, DetailRow, DetailLabel, DetailValue,
  AttachmentLink, FilterTabs, FilterButton, TableContainer,
  Table, Thead, Tbody, RoleBadge, ApplicantName, ApplicantMeta,
  PortfolioButton, StatusSelect, FixedBottomBar, Button, LoadingState,
  ModalBackground, ModalContainer, ModalHeader, CloseButton, ModalBody
} from './styles';

// --- 타입 정의 (UI 전용) ---
type UiAssignmentStatus = 'pending' | 'assigned_main' | 'assigned_assist' | 'rejected';
type SectionKey = 'info' | 'applicants';

export default function LectureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [lecture, setLecture] = useState<LectureDetail | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionKey>('info');
  const [activeFilter, setActiveFilter] = useState<'all' | 'main' | 'assist'>('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPortfolio, setViewingPortfolio] = useState<{ name: string; content: string | null }>({ name: '', content: '' });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    info: useRef<HTMLElement>(null),
    applicants: useRef<HTMLElement>(null),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getLectureDetail(id);
        setLecture(data.lecture);
        setApplicants(data.applicants);
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
    if (activeFilter === 'all') return applicants;
    return applicants.filter(app => app.applied_role === activeFilter);
  }, [applicants, activeFilter]);

  const stats = useMemo(() => ({
    total: applicants.length,
    main: applicants.filter(a => a.applied_role === 'main').length,
    assist: applicants.filter(a => a.applied_role === 'assist').length
  }), [applicants]);

  const handleScroll = useCallback(() => {
    const container = scrollAreaRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      setActiveSection('applicants');
      return;
    }
    const appTop = sectionRefs.applicants.current?.offsetTop || 0;
    const detectLine = scrollTop + 100;
    setActiveSection(detectLine >= appTop ? 'applicants' : 'info');
  }, []);

  const scrollToSection = (key: SectionKey) => {
    const container = scrollAreaRef.current;
    const section = sectionRefs[key].current;
    if (container && section) {
      container.scrollTo({ top: section.offsetTop - 20, behavior: 'smooth' });
    }
  };

  const getUiStatusValue = (status: DbAssignmentStatus, role: LectureRole | null): UiAssignmentStatus => {
    if (status === 'assigned') {
      return role === 'main' ? 'assigned_main' : 'assigned_assist';
    }
    return status === 'rejected' ? 'rejected' : 'pending';
  };

  const handleStatusChange = (id: number, uiValue: UiAssignmentStatus) => {
    let newStatus: DbAssignmentStatus = 'pending';
    let newAssignedRole: LectureRole | null = null;

    if (uiValue === 'assigned_main') {
      newStatus = 'assigned';
      newAssignedRole = 'main';
    } else if (uiValue === 'assigned_assist') {
      newStatus = 'assigned';
      newAssignedRole = 'assist';
    } else if (uiValue === 'rejected') {
      newStatus = 'rejected';
      newAssignedRole = null;
    }

    setApplicants(prev => prev.map(app => 
      app.application_id === id 
        ? { ...app, assignment_status: newStatus, assigned_role: newAssignedRole } 
        : app
    ));
  };

  const handleSaveChanges = () => {
    if (!confirm('저장하시겠습니까?')) return;
    setIsSubmitting(true);
    const payload = applicants.map(app => ({ 
      application_id: app.application_id, 
      assignment_status: app.assignment_status,
      assigned_role: app.assigned_role
    }));
    console.log('🚀 [API Payload]', payload);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('저장되었습니다.');
    }, 1000);
  };

  const openPortfolioModal = (app: Applicant) => {
    setViewingPortfolio({
      name: app.name,
      content: app.portfolio_snapshot || '등록된 포트폴리오 스냅샷이 없습니다.'
    });
    setIsModalOpen(true);
  };
  const closePortfolioModal = () => setIsModalOpen(false);

  if (isLoading || !lecture) {
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
          <MenuItem $isActive={activeSection === 'applicants'} onClick={() => scrollToSection('applicants')}>지원자 관리 ({applicants.length})</MenuItem>
        </SectionMenu>

        <RightPanel>
          <ScrollArea ref={scrollAreaRef} onScroll={handleScroll}>
            
            {/* 1. 강의 상세 정보 */}
            <Section ref={sectionRefs.info}>
              <SectionTitle>강의 상세 정보</SectionTitle>
              <DetailRow><DetailLabel>강의 제목</DetailLabel><DetailValue style={{ fontSize: '18px', fontWeight: 700 }}>{lecture.title}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의 유형</DetailLabel><DetailValue>{lecture.type} / {lecture.category}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>교육 대상</DetailLabel><DetailValue>{lecture.target_audience}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>일시</DetailLabel><DetailValue>{lecture.period_start} ~ {lecture.period_end}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>장소</DetailLabel><DetailValue>{lecture.location}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>담당자</DetailLabel><DetailValue>{lecture.manager_name} ({lecture.manager_phone})</DetailValue></DetailRow>
              <DetailRow><DetailLabel>모집</DetailLabel><DetailValue>주 {lecture.recruitment_main_needed}명 / 보조 {lecture.recruitment_assist_needed}명</DetailValue></DetailRow>
              <DetailRow><DetailLabel>마감일</DetailLabel><DetailValue className="highlight">{lecture.recruitment_deadline} 까지</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의료</DetailLabel><DetailValue>주 {lecture.fee_main.toLocaleString()}원 / 보조 {lecture.fee_assist.toLocaleString()}원</DetailValue></DetailRow>
              <DetailRow><DetailLabel>상세 내용</DetailLabel><DetailValue>{lecture.content_description}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>첨부파일</DetailLabel><DetailValue>{lecture.attachment_url ? <AttachmentLink href="#">📎 {lecture.attachment_url}</AttachmentLink> : <span style={{color:'#999'}}>없음</span>}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>특이사항</DetailLabel><DetailValue className="highlight">{lecture.special_notes}</DetailValue></DetailRow>
            </Section>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }} />

            {/* 2. 지원자 관리 */}
            <Section ref={sectionRefs.applicants}>
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
                      <th style={{ width: '25%' }}>포트폴리오</th>
                      <th style={{ width: '15%' }}>지원일</th>
                      <th style={{ width: '25%' }}>상태 관리</th>
                      {/*(미구현 : th 읽음 현황)*/}
                    </tr>
                  </Thead>
                  <Tbody>
                    {filteredList.map((app) => (
                      <tr key={app.application_id}>
                        <td>
                          <ApplicantName>{app.name}</ApplicantName>
                          <ApplicantMeta>{app.phone_number}</ApplicantMeta>
                        </td>
                        <td>
                          <RoleBadge key={app.applied_role} $role={app.applied_role}>
                            {app.applied_role === 'main' ? '주강사' : '보조'}
                          </RoleBadge>
                        </td>
                        <td>
                          <PortfolioButton onClick={() => openPortfolioModal(app)}>
                            📄 지원서 보기
                          </PortfolioButton>
                        </td>
                        <td><ApplicantMeta>{app.applied_at}</ApplicantMeta></td>
                        <td>
                          <StatusSelect 
                            value={getUiStatusValue(app.assignment_status, app.assigned_role)}
                            $status={app.assignment_status}
                            $assignedRole={app.assigned_role}
                            onChange={(e) => handleStatusChange(app.application_id, e.target.value as UiAssignmentStatus)}
                          >
                            <option value="pending">대기중</option>
                            <option value="assigned_main">주도로쌤 배정</option>
                            <option value="assigned_assist">보조도로쌤 배정</option>
                            <option value="rejected">반려</option>
                          </StatusSelect>
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

      {isModalOpen && (
        <ModalBackground onClick={closePortfolioModal}>
          <ModalContainer onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>{viewingPortfolio.name}님의 지원서 (스냅샷)</h3>
              <CloseButton onClick={closePortfolioModal}>&times;</CloseButton>
            </ModalHeader>
            <ModalBody>
              {viewingPortfolio.content}
            </ModalBody>
          </ModalContainer>
        </ModalBackground>
      )}

    </PageContainer>
  );
}