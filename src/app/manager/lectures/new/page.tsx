'use client';

import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

// --- Styled Components ---

const PageContainer = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 30px 40px;
  background-color: #ffffff;
  
  /* ★ 핵심 수정: 상단 헤더 높이만큼 뺍니다 (예: 80px) ★ */
  height: calc(100vh - 80px); 
  
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #111;
  margin: 0;
`;

const BackLink = styled.button`
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  padding: 8px 16px;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e9ecef;
    color: #333;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 40px;
  flex: 1;
  min-height: 0;
`;

/* 폼 좌측 네비게이션 메뉴 */
const SectionMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 220px;
  flex-shrink: 0;
  padding-top: 10px;
`;

const MenuItem = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  color: ${(props) => (props.$isActive ? '#4f46e5' : '#4b5563')};
  background-color: ${(props) => (props.$isActive ? '#f5f3ff' : 'transparent')};
  border-color: ${(props) => (props.$isActive ? '#c7d2fe' : 'transparent')};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$isActive ? '#f5f3ff' : '#f9fafb')};
    color: #4f46e5;
  }
`;

/* 우측 패널 (폼 영역 + 하단 버튼) */
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
`;

/* 실제 스크롤되는 폼 영역 */
const FormScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 20px;
  position: relative;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-bottom: 40px; /* 하단 여백 확보 */
`;

/* 하단 고정 버튼 바 */
const FixedBottomBar = styled.div`
  flex-shrink: 0;
  padding-top: 20px;
  margin-top: 10px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: #fff;
  z-index: 10;
`;

const Section = styled.section`
  padding-top: 10px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111;
  margin-bottom: 24px;
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 20px;
    background-color: #4f46e5;
    margin-right: 12px;
    border-radius: 2px;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 30px;
  align-items: flex-start;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
  }
`;

const FormGroup = styled.div<{ $flex?: number }>`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: ${({ $flex }) => $flex || 1};
  width: 100%;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  span.required {
    color: #e11d48;
    margin-left: 4px;
  }
`;

const Input = styled.input`
  padding: 14px 16px;
  font-size: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
  width: 100%;
  background-color: #fdfdfd;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

const Select = styled.select`
  padding: 14px 16px;
  font-size: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: #fdfdfd;
  width: 100%;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 10px;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 14px 16px;
  font-size: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
  background-color: #fdfdfd;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  .unit {
    position: absolute;
    right: 16px;
    color: #6b7280;
    font-size: 14px;
    font-weight: 500;
  }
  input[data-has-unit="true"] {
    padding-right: 40px;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #e5e7eb;
  }
`;

const RangeSeparator = styled.span`
  align-self: center;
  color: #9ca3af;
  font-weight: bold;
  padding-top: 30px;
  flex-shrink: 0;
`;

const FileInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9fafb;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;

  &:hover {
    background-color: #f3f4f6;
    border-color: #4f46e5;
    color: #4f46e5;
  }
  .icon {
    font-size: 32px;
    margin-bottom: 12px;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ $variant }) =>
    $variant === 'primary'
      ? `
      background-color: #4f46e5; color: white; border: none;
      &:hover:not(:disabled) { background-color: #4338ca; }
    `
      : `
      background-color: white; color: #374151; border: 1px solid #d1d5db;
      &:hover:not(:disabled) { background-color: #f3f4f6; }
    `}
`;

// [수정] Input 바로 아래에 예쁘게 붙도록 스타일 조정
const SearchResultList = styled.ul`
  position: absolute;
  top: calc(100% + 6px); /* 입력창 바로 아래에서 6px 띄움 */
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-height: 220px;
  overflow-y: auto;
  z-index: 50; /* 다른 요소보다 위에 뜨도록 */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 4px 0;
  margin: 0;
`;

const SearchResultItem = styled.li`
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.1s;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f3f4f6;
    color: #4f46e5;
  }
  
  .email {
    color: #9ca3af;
    font-size: 13px;
    margin-left: 6px;
    font-weight: 400;
  }
`;

type SectionKey = 'basicInfo' | 'recruitment';

const sectionMenuItems: { key: SectionKey; label: string }[] = [
  { key: 'basicInfo', label: '강의 기본 정보' },
  { key: 'recruitment', label: '강사 모집 정보' },
];

// --- Main Component ---
export default function InstructorLectureNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('basicInfo');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    basicInfo: useRef<HTMLElement>(null),
    recruitment: useRef<HTMLElement>(null),
  };

  const [formData, setFormData] = useState({
    // [Lectures Table]
    title: '', type: 'general', category: '',
    startDate: '', endDate: '', startTime: '', endTime: '',
    location: '', target_audience: '',
    content_description: '',
    special_notes: '',       // 특이사항
    manager_id: 0,           // [핵심] 담당 매니저 ID (드롭다운 선택 시 업데이트됨)
    file: null as File | null,

    // [LectureRecruitment Table]
    recruitmentDeadline: '',
    recruitment_main_needed: '', recruitment_assist_needed: '',
    fee_main: '', fee_assist: '',
    // max_participants: '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
    }
  };

  // 1. 더미 데이터 (실제로는 API로 매니저 목록을 받아옵니다)
  const MOCK_MANAGERS = [
    { id: 1, name: '김범수', email: 'bumsoo@doro.com' },
    { id: 2, name: '이매니저', email: 'lee@doro.com' },
    { id: 3, name: '박관리', email: 'park@doro.com' },
  ];

  // 2. State 추가 (formData 외에 검색용 state 필요)
  const [managerSearch, setManagerSearch] = useState(''); // 검색어
  const [showManagerList, setShowManagerList] = useState(false); // 드롭다운 표시 여부
  const [selectedManager, setSelectedManager] = useState<{ id: number, name: string } | null>(null); // 선택된 담당자

  // 3. 핸들러
  const selectManager = (manager: { id: number, name: string, email: string }) => {
    setSelectedManager(manager);
    setManagerSearch(manager.name); // 입력창에 이름 표시
    setShowManagerList(false);

    // 실제 formData에도 ID 저장
    setFormData(prev => ({ ...prev, manager_id: manager.id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;


    setIsSubmitting(true);

    // 1. 인원수 자동 계산 (주강사 + 보조강사 = 총원)
    const mainNeeded = parseInt(formData.recruitment_main_needed) || 0;
    const assistNeeded = parseInt(formData.recruitment_assist_needed) || 0;
    const totalParticipants = mainNeeded + assistNeeded;

    // 2. Lectures 테이블용 데이터 구성
    const lectureData = {
      title: formData.title,
      type: formData.type,           // Enum (general, competition...)
      category: formData.category,
      status: 'recruiting',          // 초기 상태

      // 날짜와 시간을 합쳐서 timestamp 형식으로 변환 (ISO 8601)
      lecture_start_datetime: `${formData.startDate}T${formData.startTime}:00`,
      lecture_end_datetime: `${formData.endDate}T${formData.endTime}:00`,

      location: formData.location,
      manager_id: formData.manager_id,   // [핵심] 드롭다운에서 선택된 ID
      target_audience: formData.target_audience,

      content_description: formData.content_description, // 강의 상세 설명
      special_notes: formData.special_notes,             // 특이사항

      attachment_url: formData.file ? formData.file.name : null, // 실제 구현 시엔 파일 업로드 후 URL
    };

    // 3. LectureRecruitment 테이블용 데이터 구성
    const recruitmentData = {
      application_start_date: new Date().toISOString().split('T')[0],
      application_end_date: formData.recruitmentDeadline,

      max_participants: totalParticipants, // [자동 계산됨]
      recruitment_main_needed: mainNeeded,
      recruitment_assist_needed: assistNeeded,

      fee_main: parseInt(formData.fee_main) || 0,
      fee_assist: parseInt(formData.fee_assist) || 0,
    };

    // --- 콘솔 로그로 데이터 구조 확인 ---
    console.log('🚀 [API 전송 시뮬레이션]');
    console.log('1. Lectures Table Data:', lectureData);
    console.log('2. LectureRecruitment Table Data:', recruitmentData);

    // API 호출 지연 시뮬레이션
    setTimeout(() => {
      setIsSubmitting(false);
      alert('강의가 성공적으로 등록되었습니다.');
      router.push('/manager/lectures');
    }, 1500);
  };
  const handleMenuClick = (key: SectionKey) => {
    const container = scrollAreaRef.current;
    const section = sectionRefs[key].current;

    if (container && section) {
      container.scrollTo({
        top: section.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  };

  // [수정 2] 스크롤 스파이 로직 개선 (바닥 감지 추가)
  const handleScroll = useCallback(() => {
    const container = scrollAreaRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const detectLine = scrollTop + 100; // 상단 감지선

    // ★ 핵심 추가: 스크롤이 바닥에 거의 도달했는지 확인 (오차범위 5px)
    const isBottom = scrollHeight - scrollTop <= clientHeight + 5;

    if (isBottom) {
      // 바닥이면 무조건 리스트의 '마지막 메뉴'를 활성화
      const lastItemKey = sectionMenuItems[sectionMenuItems.length - 1].key;
      setActiveSection(lastItemKey);
      return;
    }

    // 기존 로직 (위에서부터 감지)
    let currentSection: SectionKey = sectionMenuItems[0].key; // 기본값 첫 번째

    for (const item of sectionMenuItems) {
      const sectionEl = sectionRefs[item.key].current;
      if (sectionEl) {
        if (sectionEl.offsetTop <= detectLine) {
          currentSection = item.key;
        }
      }
    }
    setActiveSection(currentSection);
  }, [sectionRefs]); // sectionMenuItems는 상수라 의존성 배열 제외 가능

  return (
    <PageContainer>
      <Header>
        <PageTitle>새 강의 등록</PageTitle>
        <BackLink onClick={() => router.back()}>목록으로</BackLink>
      </Header>

      <ContentWrapper>
        {/* 좌측 네비게이션 */}
        <SectionMenu>
          {sectionMenuItems.map((item) => (
            <MenuItem
              key={item.key}
              type="button"
              $isActive={activeSection === item.key}
              onClick={() => handleMenuClick(item.key)}
            >
              {item.label}
            </MenuItem>
          ))}
        </SectionMenu>

        {/* 우측 패널: 폼 스크롤 영역 + 하단 고정 버튼 */}
        <RightPanel>
          <FormScrollArea ref={scrollAreaRef} onScroll={handleScroll}>
            <Form id="lecture-form" onSubmit={handleSubmit}>
              {/* 1. 강의 기본 정보 */}
              <Section ref={sectionRefs.basicInfo}>
                <SectionTitle>강의 정보</SectionTitle>
                <FormGroup style={{ marginBottom: '30px' }}>
                  <Label>강의 제목 <span className="required">*</span></Label>
                  <Input
                    type="text"
                    name="title"
                    placeholder="예: [2025-1학기] 도로초등학교 4학년 AI 기초 교육 강사 모집"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    style={{ fontSize: '18px', fontWeight: '600' }}
                  />
                </FormGroup>
                <Row style={{ marginBottom: '20px' }}>
                  <FormGroup>
                    <Label>강의 유형 <span className="required">*</span></Label>
                    <Select name="type" value={formData.type} onChange={handleChange} required>
                      <option value="general">일반</option>
                      <option value="competition">대회</option>
                      <option value="camp">캠프</option>
                      <option value="totoland">도로랜드</option>
                      <option value="booth">부스</option>
                      <option value="etc">기타</option>
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>강의 구분 <span className="required">*</span></Label>
                    <Input
                      type="text"
                      name="category"
                      placeholder="예: AI, SW, 메이커"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>교육 대상 <span className="required">*</span></Label>
                    <Input
                      type="text"
                      name="target_audience"
                      placeholder="예: 초등학교 4학년, 2개 학급(30명)"
                      value={formData.target_audience}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Row>

                <Row style={{ marginBottom: '20px' }}>
                  <FormGroup>
                    <Label>교육 기간 (시작) <span className="required">*</span></Label>
                    <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                  </FormGroup>
                  <RangeSeparator>~</RangeSeparator>
                  <FormGroup>
                    <Label>교육 기간 (종료) <span className="required">*</span></Label>
                    <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                  </FormGroup>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
                  <FormGroup>
                    <Label>강의 시간 (시작) <span className="required">*</span></Label>
                    <Input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                  </FormGroup>
                  <RangeSeparator>~</RangeSeparator>
                  <FormGroup>
                    <Label>강의 시간 (종료) <span className="required">*</span></Label>
                    <Input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
                  </FormGroup>
                </Row>
                <Row style={{ marginBottom: '20px' }}>
                  <FormGroup>
                    <Label>강의 장소 <span className="required">*</span></Label>
                    <InputWrapper>
                      <Input
                        type="text"
                        name="location"
                        placeholder="도로명 주소 또는 학교명 검색"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        style={{ paddingRight: '100px' }}
                      />
                      <SearchButton type="button">주소 검색</SearchButton> {/* 동작 안함 */}
                    </InputWrapper>
                  </FormGroup>
                </Row>

                {/* --- 담당자 검색 기능 (수정본) --- */}
                <Row style={{ marginBottom: '20px' }}>
                  <FormGroup>
                    <Label>담당 매니저 <span className="required">*</span></Label>

                    {/* [중요] InputWrapper에 relative가 있어야 드롭다운이 바로 아래에 붙음 */}
                    <InputWrapper style={{ position: 'relative' }}>
                      <Input
                        type="text"
                        placeholder="담당 매니저 검색 (클릭 시 기본 목록)"
                        value={managerSearch}
                        // 1. 포커스 시 목록 열기
                        onFocus={() => setShowManagerList(true)}

                        // 2. [핵심 수정] 포커스 잃으면 목록 닫기 (지연 처리)
                        onBlur={() => {
                          setTimeout(() => {
                            setShowManagerList(false);
                          }, 200); // 0.2초 뒤에 닫아서 클릭 이벤트가 먼저 실행되게 함
                        }}

                        onChange={(e) => {
                          setManagerSearch(e.target.value);
                          setShowManagerList(true);
                          setSelectedManager(null);
                        }}
                        style={selectedManager ? { borderColor: '#4f46e5', backgroundColor: '#f5f3ff', color: '#4f46e5', fontWeight: 600 } : {}}
                      />
                      <SearchButton type="button">🔍</SearchButton>

                      {/* 드롭다운 목록 */}
                      {showManagerList && (
                        <SearchResultList>
                          {(() => {
                            // 미입력 시 기본 5명 표시
                            const filtered = managerSearch === ''
                              ? MOCK_MANAGERS.slice(0, 5)
                              : MOCK_MANAGERS.filter(m => m.name.includes(managerSearch) || m.email.includes(managerSearch));

                            if (filtered.length === 0) {
                              return <li style={{ padding: '12px', color: '#999', textAlign: 'center', fontSize: '13px' }}>검색 결과 없음</li>;
                            }

                            return filtered.map((manager) => (
                              <SearchResultItem
                                key={manager.id}
                                // onMouseDown은 포커스가 input에 있어도 동작함
                                onMouseDown={(e) => {
                                  e.preventDefault(); // 중요: 클릭 시 input의 blur가 즉시 발생하지 않도록 막음
                                  selectManager(manager);
                                }}
                              >
                                {manager.name} <span className="email">({manager.email})</span>
                              </SearchResultItem>
                            ));
                          })()}
                        </SearchResultList>
                      )}
                    </InputWrapper>
                  </FormGroup>

                  {/* (선택) 옆에 연락처 자동채움 등을 보여주고 싶다면 추가 */}
                  <FormGroup>
                    <Label>담당자 연락처</Label>
                    <Input
                      readOnly
                      disabled
                      value={selectedManager ? '010-1234-5678 (자동입력)' : ''}
                      placeholder="매니저 선택 시 자동 입력"
                      style={{ backgroundColor: '#f3f4f6', color: '#666' }}
                    />
                  </FormGroup>
                </Row>

                <Row style={{ marginTop: '10px' }}>
                  <FormGroup style={{ marginBottom: '30px' }}>
                    <Label>콘텐츠</Label>
                    <TextArea
                      name="content_description"
                      placeholder="- 강의의 콘텐츠 정보."
                      value={formData.content_description}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Row>
                <Row style={{ marginBottom: '0px' }}>
                  <FormGroup>
                    <Label>관련 파일 첨부</Label>
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <FileInputLabel htmlFor="file-upload">
                      <div className="icon">📁</div>
                      {formData.file ? (
                        <span style={{ color: '#111', fontWeight: 600 }}>{formData.file.name}</span>
                      ) : (
                        <>
                          <span style={{ fontWeight: 600, marginBottom: '4px' }}>클릭하여 파일을 업로드하세요</span>
                          <span style={{ fontSize: '13px', color: '#9ca3af' }}>(최대 ?MB)</span>
                        </>
                      )}
                    </FileInputLabel>
                  </FormGroup>
                </Row>
              </Section>

              {/* 3. 강사 모집 정보 */}
              <Section ref={sectionRefs.recruitment}>
                <SectionTitle>강사 모집 정보</SectionTitle>
                <Row>
                  <FormGroup $flex={1}>
                    <Label>필요 주 도로쌤 수 <span className="required">*</span></Label>
                    <InputWrapper>
                      <Input
                        type="number"
                        name="recruitment_main_needed"
                        placeholder="0"
                        min="0"
                        value={formData.recruitment_main_needed}
                        onChange={handleChange}
                        data-has-unit="true"
                        required
                      />
                      <span className="unit">명</span>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup $flex={1}>
                    <Label>주 도로쌤 급여 (선택)</Label>
                    <InputWrapper>
                      <Input
                        type="number"
                        name="fee_main"
                        placeholder="0"
                        min="0"
                        value={formData.fee_main}
                        onChange={handleChange}
                        data-has-unit="true"
                      />
                      <span className="unit">원</span>
                    </InputWrapper>
                  </FormGroup>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                  <FormGroup $flex={1}>
                    <Label>필요 보조 도로쌤 수 <span className="required">*</span></Label>
                    <InputWrapper>
                      <Input
                        type="number"
                        name="recruitment_assist_needed"
                        placeholder="0"
                        min="0"
                        value={formData.recruitment_assist_needed}
                        onChange={handleChange}
                        data-has-unit="true"
                        required
                      />
                      <span className="unit">명</span>
                    </InputWrapper>
                  </FormGroup>
                  <FormGroup $flex={1}>
                    <Label>보조 도로쌤 급여 (선택)</Label>
                    <InputWrapper>
                      <Input
                        type="number"
                        name="fee_assist"
                        placeholder="0"
                        min="0"
                        value={formData.fee_assist}
                        onChange={handleChange}
                        data-has-unit="true"
                      />
                      <span className="unit">원</span>
                    </InputWrapper>
                  </FormGroup>
                </Row>
                <Row style={{ marginTop: '10px' }}>

                  <FormGroup $flex={1}>
                    <Label>모집 마감일 <span className="required">*</span></Label>
                    <Input
                      type="date"
                      name="recruitmentDeadline"
                      value={formData.recruitmentDeadline}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Row>
                <Row style={{ marginTop: '10px' }}>
                  <FormGroup style={{ marginBottom: '50px' }}>
                    <Label>특이사항</Label>
                    <TextArea
                      name="special_notes"
                      placeholder="- 커리큘럼 정보&#13;&#10;- 강사 준비물 및 유의사항&#13;&#10;- 기타 참고사항을 자세히 입력해주세요."
                      value={formData.special_notes}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Row>
              </Section>

            </Form>
          </FormScrollArea>

          {/* 하단 고정 버튼 */}
          <FixedBottomBar>
            <Button
              type="button"
              onClick={() => router.back()}
              $variant="secondary"
              disabled={isSubmitting} // 로딩 중 취소 방지
            >
              취소
            </Button>

            <Button
              type="submit"
              form="lecture-form"
              $variant="primary"
              disabled={isSubmitting} // 1. 로딩 중 클릭 방지
            >
              {/* 2. 상태에 따라 텍스트 변경 */}
              {isSubmitting ? '등록 중...' : '강의 등록'}
            </Button>
          </FixedBottomBar>
        </RightPanel>
      </ContentWrapper>
    </PageContainer>
  );
}