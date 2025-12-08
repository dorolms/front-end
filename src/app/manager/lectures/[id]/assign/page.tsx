'use client';
import React, { useState, useRef, useCallback, useMemo, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getLectureDetail, patchApplications, updateLecture, deleteLecture, type LectureDetail, type Application, type LectureRole, type AssignmentStatus, type UserInfo, type patchData } from './api';
import { isTokenValid, getUserRole } from './jwt';
import {
  PageContainer, Header, PageTitle,  BackButton,
  // StatusBadge,
  ContentWrapper, SectionMenu, MenuItem, RightPanel, ScrollArea,
  Section, SectionTitle, DetailRow, DetailLabel, DetailValue,
  AttachmentLink, FilterTabs, FilterButton, TableContainer,
  Table, Thead, Tbody, RoleBadge, ApplicantName, ApplicantMeta,
  StatusSelect, FixedBottomBar, Button, LoadingState, SidebarToggleButton, TitleArea,
  EditButton, DeleteButton,
} from './styles';
import LectureForm from '../../components/form/LectureForm';

// --- 타입 정의 (UI 전용) ---
type UiAssignmentStatus = 'pending' | 'assigned_main' | 'assigned_assist' | 'rejected';
type SectionKey = 'info' | 'applications';

interface MergedApplication {
  main_app: Application | null;
  assist_app: Application | null;
  status: UiAssignmentStatus;
  applied_role: LectureRole[]
  
  user: UserInfo;
  created_at: string;
  ui_read_status_text: string;
};

const getWeekday = (dateString: string) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateString);
  return days[date.getDay()];
};
const getLecType = (type: string) => {
  const map: Record<string, string> = {
    "general": "일반",
    "doroland": "도로랜드",
    "booth": "부스",
    "competition": "대회",
    "camp": "캠프"
  }
  return map[type];
}
const getLecStatus = (type: string) => {
  const map: Record<string, string> = {
    'RECRUITING': "모집 중",
    'ALLOCATING': "배정 중",
    'COMPLETED': "배정 완료",
  }
  return map[type];
}

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
      
      setIsAuthChecked(true);
  
    }, [router]);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    info: useRef<HTMLElement>(null),
    applications: useRef<HTMLElement>(null),
  };

  // [신규] 데이터 로딩 함수 (재사용 가능)
  // silent: true면 전체 화면 로딩(LoadingState)을 띄우지 않고 조용히 데이터만 갱신
  const loadData = useCallback(async (silent = false) => {
    if (!id) return;

    try {
      if (!silent) setIsLoading(true); // 초기 진입 시에만 로딩 표시
      
      const data = await getLectureDetail(parseInt(id));
      
      setLecture(data);
      setApplications(data.applications);
      setInitApplications(JSON.parse(JSON.stringify(data.applications)));
      
    } catch (error) {
      console.error("데이터 로딩 실패", error);
      alert("데이터를 불러오는 데 실패했습니다.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [id]);

   useEffect(() => {
    if (isAuthChecked) {
      loadData(false);
    }
  }, [isAuthChecked, loadData]);

  const mergedList = useMemo(() => {
    const readStatusMap = new Map<number, string>();
    
    // 원본 데이터를 순회하며 '배정됨(assigned)' 상태인 건만 체크
    initapplications.forEach(app => {
      if (app.assignment_status === 'assigned') {
        // 배정된 상태라면 읽음 여부에 따라 텍스트 결정
        readStatusMap.set(app.user.id, app.is_notification_read ? '읽음' : '대기');
      }
    });
    
    const map = new Map<number, MergedApplication>();
    applications.forEach(app => {
      const uid = app.user.id;
      const readText = readStatusMap.get(uid) || '-';
      
      if (!map.has(uid)) {
        map.set(uid, {
          main_app: null,
          assist_app: null,
          user: app.user,
          created_at: app.created_at,
          status: 'pending',
          applied_role: [],
          ui_read_status_text: readText
        });
      }

      const merged = map.get(uid)!;
      merged.applied_role.push(app.applied_role);

      if (app.applied_role === 'main') merged.main_app = app;
      else if (app.applied_role === 'assist') merged.assist_app = app;

      if (app.assignment_status === 'assigned') {
        merged.status = app.applied_role === 'main' ? 'assigned_main' : 'assigned_assist';
      } 
      else if (app.assignment_status === 'rejected' && merged.status === 'pending') {
        merged.status = 'rejected';
      }
    });
    
    return Array.from(map.values());
  }, [applications, initapplications]);

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return mergedList;
    return mergedList.filter(app => app.applied_role.includes(activeFilter));
  }, [mergedList, activeFilter]);

  const stats = useMemo(() => ({
    total: mergedList.length,
    main: mergedList.filter(a => a.applied_role.includes('main')).length,
    assist: mergedList.filter(a => a.applied_role.includes('assist')).length
  }), [mergedList]);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStatusChange = (mrg: MergedApplication, uiValue: UiAssignmentStatus) => {
    let mainStatus: AssignmentStatus = 'pending';
    let assistStatus: AssignmentStatus = 'pending';

    if (uiValue === 'assigned_main') {
      mainStatus = 'assigned';
      assistStatus = 'rejected';
    } else if (uiValue === 'assigned_assist') {
      mainStatus = 'rejected';
      assistStatus = 'assigned';
    } else if (uiValue === 'rejected') {
      mainStatus = assistStatus = 'rejected';
    }

    setApplications((prev) => 
      prev.map((app) => {
        // 주강사 지원 내역 업데이트
        if (mrg.main_app && app.id === mrg.main_app.id) {
          return { ...app, assignment_status: mainStatus };
        }
        // 보조강사 지원 내역 업데이트
        if (mrg.assist_app && app.id === mrg.assist_app.id) {
          return { ...app, assignment_status: assistStatus };
        }
        return app;
      })
    );
  };

  // [수정] 저장 버튼 핸들러: 변경된 것만 필터링
  const handleSaveChanges = async () => { // async 추가
    const changedItems = applications.filter(curApp => {
      // 원본에서 동일한 ID를 가진 지원을 찾음
      const originalApp = initapplications.find(init => init.id === curApp.id);
      
      if (!originalApp) return false; // 원본에 없으면(그럴 일은 없겠지만) 패스

      // 상태나 배정된 역할이 하나라도 다르면 '변경된 데이터'로 간주
      return (
        curApp.assignment_status !== originalApp.assignment_status
      );
    });

    // 2. 변경사항이 없으면 알림 후 중단
    if (changedItems.length === 0) {
      alert('강사 배정 변경사항이 없습니다.');
      return;
    }

    if (!confirm(`강사 배정 변경사항을 저장하시겠습니까?`)) return;
    
    setIsSubmitting(true);
    
    // 3. 변경된 항목만 Payload 구성
    const appPayload = changedItems.map((app: Application) => ({ 
      id: app.id, // API 스펙에 맞춘 ID
      lecture: app.lecture,
      assignment_status: app.assignment_status,
      applied_role: app.applied_role,
      _user_name: app.user.name
    }));
    
    console.log('🚀 [API Payload - Changed Only]', appPayload);

    try {
      
      const results = await Promise.allSettled(appPayload.map(item => patchApplications(item)));
      
      const successfulIds: number[] = [];
      const failedMessages: string[] = [];
      results.forEach((result, index) => {
        const targetItem = appPayload[index];

        if (result.status === 'fulfilled') {
          // 성공한 경우 ID 수집
          successfulIds.push(targetItem.id);
        } else {
          // 실패한 경우 에러 메시지 추출
          const reason = result.reason; // 에러 객체
          const errData = reason.response?.data;
          let msg = `[${targetItem._user_name}]: 저장 실패`;

          if (errData?.assignment_status) {
             // 중복 배정 등 백엔드 커스텀 에러
             msg = Array.isArray(errData.assignment_status) 
               ? errData.assignment_status.join(' ') 
               : errData.assignment_status;
          } else if (errData?.detail) {
             msg = `[${targetItem._user_name}]: ${errData.detail}`;
          }
          
          failedMessages.push(msg);
        }
      });

      await loadData(true); 
      // 5. 결과 알림
      if (failedMessages.length === 0) {
        alert('모든 변경사항이 성공적으로 저장되었습니다.');
      } else {
        // 일부 또는 전체 실패 시
        const successCount = successfulIds.length;
        const failCount = failedMessages.length;
        
        alert(
          `처리 결과: 성공 ${successCount}건 / 실패 ${failCount}건\n\n` +
          `[실패 사유]\n${failedMessages.join('\n')}`
        );
      }

    } catch (error) {
      console.error('치명적인 오류:', error); 
      alert('저장 프로세스 중 알 수 없는 치명적인 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 강의를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.')) return;

    try {
      setIsSubmitting(true);
      await deleteLecture(parseInt(id)); // API 호출
      alert('강의가 삭제되었습니다.');
      router.replace('/manager/lectures'); // 목록으로 이동
    } catch (error) {
      console.error(error);
      alert('삭제 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: any) => {
      // e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      
      try {
        const payload = {
          id: parseInt(id),
          title: formData.title,
          type: formData.type,
          category: formData.category,
          status: formData.status,
          end_date: formData.end_date,
          capacity: formData.capacity,
          
          recruitment_main: parseInt(formData.recruitment_main) || 0,
          recruitment_assist: parseInt(formData.recruitment_assist) || 0,
          
          schedules: formData.schedules,
  
          location: formData.location,
          target: formData.target,
          content: formData.content,
          note: formData.note,
          
          fee: formData.fee,
          attachment_url: formData.attachment_url,
        };
  
        console.log('🚀 [Sending Payload]', payload);
  
        await updateLecture(payload);
  
        // 성공 시
        alert('저장되었습니다.');
        await loadData(true); // 최신 정보로 갱신
        setIsEditing(false);  // 뷰 모드로 전환

  
      } catch (error: any) {
        // 실패 시
        console.error('강의 수정 실패:', error);
        const errorMessage = error.response?.data?.detail || '정보 전송 중 오류가 발생했습니다.';
        alert(errorMessage);
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
        <TitleArea>
          {/* [신규] 토글 버튼 추가 (패널 아이콘) */}
          <SidebarToggleButton onClick={toggleSidebar} title="사이드바 토글">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </SidebarToggleButton>
          <PageTitle>강의 상세 및 배정{/* <StatusBadge>모집중</StatusBadge> */}</PageTitle>
        </TitleArea>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isEditing && (
              <EditButton onClick={() => setIsEditing(true)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                강의 정보 수정
              </EditButton>
            )}
            <BackButton onClick={() => router.push('/manager/lectures')}>목록으로</BackButton>
          </div>
      </Header>

      <ContentWrapper>
        <SectionMenu $isOpen={isSidebarOpen}>
          <MenuItem $isActive={activeSection === 'info'} onClick={() => scrollToSection('info')}>강의 상세 정보</MenuItem>
          <MenuItem $isActive={activeSection === 'applications'} onClick={() => scrollToSection('applications')}>지원자 관리 ({stats.total})</MenuItem>
        </SectionMenu>

        <RightPanel>
          <ScrollArea ref={scrollAreaRef} onScroll={handleScroll}>
            
            {/* 1. 강의 상세 정보 */}
            <Section ref={sectionRefs.info}>
              <SectionTitle>
                강의 상세 정보
                
              </SectionTitle>
              
              {isEditing ? <LectureForm
                where='edit'
                initialData={lecture}
                onSubmit={handleSubmit}
              /> : <><DetailRow><DetailLabel>강의 제목</DetailLabel><DetailValue style={{ fontSize: '18px', fontWeight: 700 }}>{lecture.title}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의 유형</DetailLabel><DetailValue>{getLecType(lecture.type)}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의 구분</DetailLabel><DetailValue>{lecture.category}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>상태</DetailLabel><DetailValue>{getLecStatus(lecture.status)}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>일시</DetailLabel><DetailValue>
                {lecture.schedules && lecture.schedules.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {lecture.schedules.map((sch, idx) => (
                        <div key={idx}>
                          •  {sch.date}({getWeekday(sch.date)}) {sch.start_time.slice(0, 5)} ~ {sch.end_time.slice(0, 5)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: '#999' }}>일정 정보 없음</span>
                  )}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>장소</DetailLabel><DetailValue>{lecture.location}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>담당자</DetailLabel><DetailValue>{lecture.manager_name} ({lecture.manager_phone})</DetailValue></DetailRow>
              <DetailRow><DetailLabel>교육 대상</DetailLabel><DetailValue>{lecture.target}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>인원</DetailLabel><DetailValue>{lecture.capacity}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>콘텐츠</DetailLabel><DetailValue>{lecture.content || <span style={{ color: '#999' }}>상세 정보 없음</span>}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>첨부파일</DetailLabel><DetailValue>{lecture.attachment_url ? <AttachmentLink href={lecture.attachment_url} target="_blank">📎 {lecture.attachment_url}</AttachmentLink> : <span style={{color:'#999'}}>없음</span>}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>모집 인원</DetailLabel><DetailValue>주 {lecture.recruitment_main}명 / 보조 {lecture.recruitment_assist}명</DetailValue></DetailRow>
              <DetailRow><DetailLabel>강의료</DetailLabel><DetailValue>{lecture.fee}</DetailValue></DetailRow>
              <DetailRow><DetailLabel>모집 마감일</DetailLabel><DetailValue className="highlight">{lecture.end_date} 까지</DetailValue></DetailRow>
              <DetailRow><DetailLabel>특이사항</DetailLabel><DetailValue className="highlight">{lecture.note || <span style={{ color: '#999' }}>특이 사항 없음</span>}</DetailValue></DetailRow></>
              }
            </Section>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '40px 0' }} />

            {/* 2. 지원자 관리 */}
            {/* [수정] style 속성을 추가하여 수정 모드일 때 흐리게(Opacity) + 클릭 방지(pointer-events) 처리 */}
            <Section 
              ref={sectionRefs.applications}
              style={{
                opacity: isEditing ? 0.4 : 1,             // 수정 중이면 40% 불투명도로 흐리게
                pointerEvents: isEditing ? 'none' : 'auto', // 수정 중이면 클릭 아예 안 되게 막음
                // filter: isEditing ? 'blur(1px)' : 'none',   // (선택) 살짝 블러 처리해서 더 비활성화 느낌 내기
                transition: 'all 0.3s ease',              // 부드럽게 전환
                userSelect: isEditing ? 'none' : 'auto'     // 텍스트 드래그도 방지
              }}
            >
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
                      <th style={{ width: '20%' }}>지원 분야</th>
                      <th style={{ width: '20%' }}>지원일</th>
                      <th style={{ width: '20%' }}>배정 상태</th>
                      <th style={{ width: '20%' }}>읽음 상태</th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {filteredList.map((app) => (
                      <tr
                        key={app.user.id}
                        onClick={() => window.open(`/manager/instructors?id=${app.user.id}`, '_blank')}
                      >
                        <td>
                          <ApplicantName>{app.user.name}</ApplicantName>
                          <ApplicantMeta>{app.user.major}</ApplicantMeta>
                        </td>
                        <td>
                          {app.applied_role.includes("main") ? <RoleBadge key={'main'} $role={'main'}>주강사</RoleBadge> : null}
                          {app.applied_role.includes("assist") ? <RoleBadge key={'assist'} $role={'assist'}>보조</RoleBadge> : null}
                        </td>
                        <td><ApplicantMeta>{new Date(app.created_at).toLocaleDateString()}</ApplicantMeta></td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <StatusSelect 
                            value={app.status}
                            $status={app.status}
                            disabled={isEditing}
                            onChange={(e) => handleStatusChange(app, e.target.value as UiAssignmentStatus)}
                            >
                            <option value="pending">대기중</option>
                            {app.applied_role.includes("main") ? <option value="assigned_main">주도로쌤 배정</option> : null}
                            {app.applied_role.includes("assist") ? <option value="assigned_assist">보조도로쌤 배정</option> : null}
                            <option value="rejected">반려</option>
                          </StatusSelect>
                        </td>
                        <td>
                          <ApplicantMeta>{app.ui_read_status_text}</ApplicantMeta>
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
          
          {isEditing ?
          <FixedBottomBar style={{ justifyContent: 'space-between' }}>
            <DeleteButton type="button" onClick={handleDelete} disabled={isSubmitting}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                강의 삭제
              </DeleteButton>
              
            <div style={{ display: 'flex', gap: '12px' }}><Button type="button" onClick={() => setIsEditing(false)} $variant="secondary" disabled={isSubmitting}>수정 취소</Button>
            <Button type="submit" form='lecture-form' $variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '강의 수정사항 저장'}
            </Button></div>
          </FixedBottomBar>
          :
            <FixedBottomBar>
            <Button type="button" onClick={() => router.push('/manager/lectures')} $variant="secondary" disabled={isSubmitting}>취소</Button>
            <Button type="button" onClick={handleSaveChanges} $variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '배정 변경사항 저장'}
            </Button>
          </FixedBottomBar>
          }
        </RightPanel>
      </ContentWrapper>

    </PageContainer>
  );
}