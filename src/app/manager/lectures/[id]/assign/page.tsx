'use client';

import React, { useState, useRef, useCallback, useMemo, useEffect, use } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
// [수정] api-mock에서 Applicant 타입의 portfolio_snapshot을 사용합니다.
import { getLectureDetail, type LectureDetail, type Applicant, type LectureRole, type DbAssignmentStatus } from './api-mock';

// --- 타입 정의 (UI 전용) ---
type UiAssignmentStatus = 'pending' | 'assigned_main' | 'assigned_assist' | 'rejected';

// --- 1. Styled Components ---

const PageContainer = styled.div` width: 100%; padding: 30px 40px; background-color: #ffffff; height: calc(100vh - 80px); display: flex; flex-direction: column; overflow: hidden; `;
const Header = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; flex-shrink: 0; `;
const PageTitle = styled.h1` font-size: 26px; font-weight: 800; color: #111; margin: 0; display: flex; align-items: center; gap: 12px; `;
const StatusBadge = styled.span` font-size: 13px; font-weight: 700; color: #1e40af; background-color: #dbeafe; padding: 4px 10px; border-radius: 20px; `;
const BackButton = styled.button` background: #f8f9fa; border: 1px solid #e9ecef; padding: 8px 16px; border-radius: 6px; color: #666; font-size: 14px; font-weight: 500; cursor: pointer; &:hover { background-color: #e9ecef; color: #333; } `;
const ContentWrapper = styled.div` display: flex; gap: 40px; flex: 1; min-height: 0; `;
const SectionMenu = styled.nav` display: flex; flex-direction: column; gap: 8px; width: 220px; flex-shrink: 0; padding-top: 10px; `;
const MenuItem = styled.button<{ $isActive: boolean }>` width: 100%; padding: 14px 20px; font-size: 15px; font-weight: 600; border-radius: 10px; text-align: left; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; color: ${(props) => (props.$isActive ? '#4f46e5' : '#4b5563')}; background-color: ${(props) => (props.$isActive ? '#f5f3ff' : 'transparent')}; &:hover { background-color: ${(props) => (props.$isActive ? '#f5f3ff' : '#f9fafb')}; color: #4f46e5; } `;
const RightPanel = styled.div` flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100%; overflow: hidden; `;
const ScrollArea = styled.div` flex: 1; overflow-y: auto; padding-right: 20px; position: relative; `;
const Section = styled.section` padding-top: 10px; margin-bottom: 60px; &:last-of-type { margin-bottom: 20px; } `;
const SectionTitle = styled.h2` font-size: 20px; font-weight: 700; color: #111; margin-bottom: 24px; display: flex; align-items: center; &::before { content: ''; display: block; width: 4px; height: 20px; background-color: #4f46e5; margin-right: 12px; border-radius: 2px; } `;

// --- [수정] 폼 스타일 적용 (Grid 레이아웃) ---
const DetailRow = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr; /* 좌: 라벨 220px, 우: 컨텐츠 */
  align-items: stretch; /* 높이를 꽉 채움 */
  border-bottom: 1px solid #e5e7eb;

  &:first-of-type { 
    border-top: 1px solid #e5e7eb; 
  }
`;

// [수정] 폼 스타일 적용 (배경색, 패딩)
const DetailLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  background-color: #f9fafb; /* 좌측 라벨 배경 */
  padding: 24px; /* 내부 여백 */
  border-right: 1px solid #e5e7eb; /* 우측 구분선 */
`;

// [수정] 폼 스타일 적용 (패딩)
const DetailValue = styled.div`
  flex: 1;
  font-size: 15px;
  color: #111;
  line-height: 1.6;
  white-space: pre-wrap;
  font-weight: 500;
  &.highlight { color: #e11d48; font-weight: 700; }

  padding: 24px; /* 라벨과 동일한 내부 여백 */
`;

const AttachmentLink = styled.a` display: inline-flex; align-items: center; gap: 6px; color: #4f46e5; text-decoration: underline; cursor: pointer; &:hover { color: #3730a3; } `;
const FilterTabs = styled.div` display: flex; gap: 8px; margin-bottom: 16px; `;
const FilterButton = styled.button<{ $active: boolean }>` padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; border: none; cursor: pointer; background-color: ${({ $active }) => ($active ? '#111' : '#f3f4f6')}; color: ${({ $active }) => ($active ? '#fff' : '#6b7280')}; transition: all 0.2s; &:hover { background-color: ${({ $active }) => ($active ? '#111' : '#e5e7eb')}; } `;
const TableContainer = styled.div` height: calc(100vh - 450px); min-height: 400px; border: 1px solid #e5e7eb; border-radius: 12px; overflow-y: auto; background-color: white; position: relative; &::-webkit-scrollbar { width: 8px; height: 8px; } &::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; } &::-webkit-scrollbar-track { background-color: transparent; } `;
const Table = styled.table` width: 100%; border-collapse: separate; border-spacing: 0; text-align: left; `;
const Thead = styled.thead` th { padding: 16px; font-size: 13px; font-weight: 600; color: #6b7280; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; background-color: #f9fafb; box-shadow: 0 1px 0 #e5e7eb; } `;
const Tbody = styled.tbody` tr { background-color: #fff; &:hover { background-color: #f9fafb; } } td { padding: 16px; vertical-align: middle; border-bottom: 1px solid #e5e7eb; } `;
const RoleBadge = styled.span<{ $role: string }>` display: inline-block; font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 4px; margin-right: 4px; margin-bottom: 2px; background-color: ${({ $role }) => ($role === 'main' ? '#e0e7ff' : '#dcfce7')}; color: ${({ $role }) => ($role === 'main' ? '#3730a3' : '#166534')}; `;
const ApplicantName = styled.div` font-size: 15px; font-weight: 600; color: #111; margin-bottom: 4px; `;
const ApplicantMeta = styled.div` font-size: 13px; color: #6b7280; `;

// [수정] 포트폴리오 '보기' 버튼
const PortfolioButton = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px; border: 1px solid #e5e7eb; border-radius: 6px;
  font-size: 13px; font-weight: 500; color: #374151; background: white; cursor: pointer;
  &:hover { background: #f3f4f6; color: #4f46e5; border-color: #c7d2fe; }
`;

const StatusSelect = styled.select<{ $status: DbAssignmentStatus; $assignedRole: LectureRole | null }>`
  padding: 8px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer;
  border: 1px solid transparent; outline: none; width: 140px;
  background-color: ${({ $status, $assignedRole }) => {
    if ($status === 'assigned' && $assignedRole === 'main') return '#e0e7ff'; 
    if ($status === 'assigned' && $assignedRole === 'assist') return '#dcfce7';
    if ($status === 'rejected') return '#fee2e2';
    return '#f3f4f6';
  }};
  color: ${({ $status, $assignedRole }) => {
    if ($status === 'assigned' && $assignedRole === 'main') return '#3730a3';
    if ($status === 'assigned' && $assignedRole === 'assist') return '#166534';
    if ($status === 'rejected') return '#991b1b';
    return '#4b5563';
  }};
  &:focus { box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1); }
`;
const FixedBottomBar = styled.div` flex-shrink: 0; padding-top: 20px; margin-top: 10px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; align-items: center; gap: 12px; background-color: #fff; z-index: 10; `;
const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>` padding: 14px 32px; font-size: 16px; font-weight: 600; border-radius: 8px; cursor: pointer; transition: all 0.2s; border: none; ${({ $variant }) => $variant === 'primary' ? ` background-color: #4f46e5; color: white; &:hover { background-color: #4338ca; } ` : ` background-color: white; color: #374151; border: 1px solid #d1d5db; &:hover { background-color: #f3f4f6; } `} &:disabled { opacity: 0.5; cursor: not-allowed; } `;
const LoadingState = styled.div` display: flex; justify-content: center; align-items: center; height: 100%; font-size: 16px; color: #666; `;

// --- [신규] 팝업 모달 스타일 ---
const ModalBackground = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;
const ModalContainer = styled.div`
  width: 100%; max-width: 700px;
  background-color: white; border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  display: flex; flex-direction: column;
`;
const ModalHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px; border-bottom: 1px solid #e5e7eb;
  h3 { font-size: 18px; font-weight: 700; color: #111; margin: 0; }
`;
const CloseButton = styled.button`
  background: none; border: none; font-size: 24px; color: #9ca3af;
  cursor: pointer; line-height: 1;
  &:hover { color: #111; }
`;
const ModalBody = styled.pre` /* pre 태그로 \n 줄바꿈 유지 */
  padding: 24px;
  font-size: 15px; line-height: 1.7; color: #374151;
  max-height: 60vh; overflow-y: auto;
  white-space: pre-wrap; /* 줄바꿈 + 자동 줄바꿈 */
  font-family: inherit;
  margin: 0;
`;


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

  // [신규] 모달 상태 관리
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

  // [수정] 필터 로직 (applied_role 단일값)
  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return applicants;
    return applicants.filter(app => app.applied_role === activeFilter);
  }, [applicants, activeFilter]);

  // [수정] 통계 로직 (applied_role 단일값)
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
    if (uiValue === 'assigned_main') { newStatus = 'assigned'; newAssignedRole = 'main'; }
    else if (uiValue === 'assigned_assist') { newStatus = 'assigned'; newAssignedRole = 'assist'; }
    else if (uiValue === 'rejected') { newStatus = 'rejected'; }
    
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

  // [신규] 모달 열기 핸들러
  const openPortfolioModal = (app: Applicant) => {
    setViewingPortfolio({
      name: app.name,
      content: app.portfolio_snapshot || '등록된 포트폴리오 스냅샷이 없습니다.'
    });
    setIsModalOpen(true);
  };

  // [신규] 모달 닫기 핸들러
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
            
            {/* 1. 강의 상세 정보 (설정 페이지 스타일 적용) */}
            <Section ref={sectionRefs.info}>
              <SectionTitle>강의 상세 정보</SectionTitle>
              
              <DetailRow><DetailLabel>강의 제목</DetailLabel><DetailValue style={{ fontSize: '18px', fontWeight: 700 }}>{lecture.title}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의 유형/구분</DetailLabel><DetailValue>{lecture.type} / {lecture.category}</DetailValue></DetailRow>
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
                          <RoleBadge $role={app.applied_role}>
                            {app.applied_role === 'main' ? '주강사' : '보조'}
                          </RoleBadge>
                        </td>
                        <td>
                          {/* [수정] 텍스트 스냅샷 보기 버튼 */}
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

      {/* [신규] 포트폴리오 뷰어 모달 */}
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