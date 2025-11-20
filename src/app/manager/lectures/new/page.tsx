'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// [수정] 스타일 파일에서 import
import {
  PageContainer, Header, PageTitle, BackButton,
  ScrollArea, FormLayout, FormRow, FormLabel, InputArea,
  Input, TextArea, Select, Row, InputWrapper, FileLabel,
  SearchButton, SearchResultList, SearchResultItem,
  FixedBottomBar, Button
} from './styles';

// --- Main Component ---

export default function InstructorLectureNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [유지] 원본의 폼 상태
  const [formData, setFormData] = useState({
    title: '', type: 'general', category: '',
    startDate: '', endDate: '', startTime: '', endTime: '',
    location: '', target_audience: '',
    content_description: '',
    special_notes: '',
    manager_id: 0,
    file: null as File | null,
    recruitmentDeadline: '',
    recruitment_main_needed: '', recruitment_assist_needed: '',
    fee_main: '', fee_assist: '',
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

  // [유지] 원본의 매니저 검색 로직
  const MOCK_MANAGERS = [
    { id: 1, name: '김범수', email: 'bumsoo@doro.com', phone: '010-1234-5678' },
    { id: 2, name: '이매니저', email: 'lee@doro.com', phone: '010-1111-2222' },
    { id: 3, name: '박관리', email: 'park@doro.com', phone: '010-3333-4444' },
  ];
  const [managerSearch, setManagerSearch] = useState('');
  const [showManagerList, setShowManagerList] = useState(false);
  const [selectedManager, setSelectedManager] = useState<{ id: number, name: string, phone: string } | null>(null);

  const selectManager = (manager: { id: number, name: string, email: string, phone: string }) => {
    setSelectedManager(manager);
    setManagerSearch(manager.name);
    setShowManagerList(false);
    setFormData(prev => ({ ...prev, manager_id: manager.id }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // ... (데이터 가공 로직 - 원본과 동일) ...
    const mainNeeded = parseInt(formData.recruitment_main_needed) || 0;
    const assistNeeded = parseInt(formData.recruitment_assist_needed) || 0;
    const totalParticipants = mainNeeded + assistNeeded;
    const lectureData = {
      title: formData.title, type: formData.type, category: formData.category,
      status: 'recruiting',
      lecture_start_datetime: `${formData.startDate}T${formData.startTime}:00`,
      lecture_end_datetime: `${formData.endDate}T${formData.endTime}:00`,
      location: formData.location, manager_id: formData.manager_id,
      target_audience: formData.target_audience,
      content_description: formData.content_description,
      special_notes: formData.special_notes,
      attachment_url: formData.file ? formData.file.name : null, 
    };
    const recruitmentData = {
      application_start_date: new Date().toISOString().split('T')[0],
      application_end_date: formData.recruitmentDeadline,
      max_participants: totalParticipants,
      recruitment_main_needed: mainNeeded,
      recruitment_assist_needed: assistNeeded,
      fee_main: parseInt(formData.fee_main) || 0,
      fee_assist: parseInt(formData.fee_assist) || 0,
    };
    console.log('Lectures Data:', lectureData);
    console.log('Recruitment Data:', recruitmentData);

    setTimeout(() => {
      setIsSubmitting(false);
      alert('강의가 성공적으로 등록되었습니다.');
      router.push('/manager/lectures');
    }, 1500);
  };

  return (
    <PageContainer>
      <Header>
        {/* [유지] 원본의 "새 강의 등록" 워딩 */}
        <PageTitle>새 강의 등록</PageTitle>
        <BackButton onClick={() => router.back()}>목록으로</BackButton>
      </Header>

      {/* 스크롤 영역 */}
      <ScrollArea>
        {/* [수정] 폼 레이아웃만 변경 */}
        <FormLayout id="lecture-form" onSubmit={handleSubmit}>
          
          {/* Row 1: 강의 제목 */}
          <FormRow>
            <FormLabel>
              강의 제목 <span className="required">*</span>
              <p>공고에 표시될 메인 제목입니다.</p>
            </FormLabel>
            <InputArea>
              <Input
                type="text" name="title"
                placeholder="예: [2025-1학기] 도로초등학교 4학년 AI 기초 교육"
                value={formData.title} onChange={handleChange} required
                style={{ fontSize: '16px', fontWeight: '600' }}
              />
            </InputArea>
          </FormRow>

          {/* Row 2: 분류 */}
          <FormRow>
            <FormLabel>강의 유형 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <Select name="type" value={formData.type} onChange={handleChange}>
                  <option value="general">일반</option>
                  <option value="competition">대회</option>
                  <option value="camp">캠프</option>
                  <option value="totoland">도로랜드</option>
                  <option value="booth">부스</option>
                  <option value="etc">기타</option>
                </Select>
                <Input type="text" name="category" placeholder="강의 구분 (예: AI/SW)" value={formData.category} onChange={handleChange} required />
              </Row>
            </InputArea>
          </FormRow>
          
          {/* Row 3: 교육 대상 */}
          <FormRow>
            <FormLabel>교육 대상 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="text" name="target_audience" placeholder="예: 초등학교 4학년, 2개 학급(30명)" value={formData.target_audience} onChange={handleChange} required />
            </InputArea>
          </FormRow>

          {/* Row 4: 교육 기간 */}
          <FormRow>
            <FormLabel>교육 기간 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                <span>~</span>
                <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
              </Row>
            </InputArea>
          </FormRow>
          
          {/* Row 5: 강의 시간 */}
          <FormRow>
            <FormLabel>강의 시간 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <Input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                <span>~</span>
                <Input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
              </Row>
            </InputArea>
          </FormRow>

          {/* Row 6: 강의 장소 */}
          <FormRow>
            <FormLabel>강의 장소 <span className="required">*</span></FormLabel>
            <InputArea>
              <InputWrapper>
                <Input type="text" name="location" placeholder="도로명 주소 또는 학교명 검색" value={formData.location} onChange={handleChange} required style={{ paddingRight: '100px' }} />
                <SearchButton type="button">주소 검색</SearchButton>
              </InputWrapper>
            </InputArea>
          </FormRow>

          {/* Row 7: 담당자 정보 (검색 + 연락처) - [수정됨] */}
          <FormRow>
            <FormLabel>
              담당자 정보 <span className="required">*</span>
              <p>강의를 담당하는 매니저를 선택합니다.</p>
            </FormLabel>
            <InputArea>
              {/* [수정] 50/50 수평 분할을 위해 Row로 감쌈 */}
              <Row>
                
                {/* 1. 매니저 검색 (div로 감싸서 flex: 1 적용) */}
                <div>
                  <InputWrapper style={{ position: 'relative' }}>
                    <Input
                      type="text"
                      placeholder="매니저 검색..."
                      value={managerSearch}
                      onFocus={() => setShowManagerList(true)}
                      onBlur={() => setTimeout(() => setShowManagerList(false), 200)}
                      onChange={(e) => {
                        setManagerSearch(e.target.value);
                        setShowManagerList(true);
                        setSelectedManager(null);
                      }}
                      style={selectedManager ? { borderColor: '#3478F6', backgroundColor: '#EFF6FF' } : {}}
                    />
                    {showManagerList && (
                      <SearchResultList>
                        {(() => {
                          const filtered = managerSearch === ''
                            ? MOCK_MANAGERS.slice(0, 5)
                            : MOCK_MANAGERS.filter(m => m.name.includes(managerSearch) || m.email.includes(managerSearch));
                          
                          if (filtered.length === 0) return <li style={{ padding: '12px', color: '#999', textAlign: 'center' }}>검색 결과 없음</li>;
                          
                          return filtered.map((manager) => (
                            <SearchResultItem key={manager.id} onMouseDown={(e) => { e.preventDefault(); selectManager(manager); }}>
                              {manager.name} <span className="email">({manager.email})</span>
                            </SearchResultItem>
                          ));
                        })()}
                      </SearchResultList>
                    )}
                  </InputWrapper>
                </div>
                
                {/* 2. 담당자 연락처 (div로 감싸서 flex: 1 적용) */}
                <div>
                  <Input
                    readOnly
                    disabled
                    value={selectedManager ? selectedManager.phone : ''}
                    placeholder="담당자 연락처 (자동 입력)"
                    style={{ backgroundColor: '#f3f4f6', color: '#666' }}
                  />
                </div>
              </Row>
            </InputArea>
          </FormRow>

          {/* Row 8: 콘텐츠 */}
          <FormRow>
            <FormLabel>콘텐츠<p>강의 상세 내용, 커리큘럼 등</p></FormLabel>
            <InputArea>
              <TextArea name="content_description" placeholder="- 강의의 콘텐츠 정보." value={formData.content_description} onChange={handleChange} />
            </InputArea>
          </FormRow>

          {/* Row 9: 파일 첨부 */}
          <FormRow>
            <FormLabel>관련 파일 첨부</FormLabel>
            <InputArea>
              <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileChange} />
              <FileLabel htmlFor="file-upload">
                <div className="icon">📁</div>
                {formData.file ? (
                  <span style={{ color: '#111', fontWeight: 600 }}>{formData.file.name}</span>
                ) : (
                  <span>클릭하여 파일을 업로드하세요 (최대 ?MB)</span>
                )}
              </FileLabel>
            </InputArea>
          </FormRow>

          {/* Row 10: 주강사 */}
          <FormRow>
            {/* [유지] 원본 워딩 "필요 주 도로쌤 수" */}
            <FormLabel>필요 주 도로쌤 수 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="number" name="recruitment_main_needed" placeholder="0" min="0" value={formData.recruitment_main_needed} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">명</span>
                </InputWrapper>
                <InputWrapper>
                  <Input type="number" name="fee_main" placeholder="주 도로쌤 급여 (원)" min="0" value={formData.fee_main} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">원</span>
                </InputWrapper>
              </Row>
            </InputArea>
          </FormRow>

          {/* Row 11: 보조강사 */}
          <FormRow>
            {/* [유지] 원본 워딩 "필요 보조 도로쌤 수" */}
            <FormLabel>필요 보조 도로쌤 수 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="number" name="recruitment_assist_needed" placeholder="0" min="0" value={formData.recruitment_assist_needed} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">명</span>
                </InputWrapper>
                <InputWrapper>
                  <Input type="number" name="fee_assist" placeholder="보조 도로쌤 급여 (원)" min="0" value={formData.fee_assist} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">원</span>
                </InputWrapper>
              </Row>
            </InputArea>
          </FormRow>

          {/* Row 12: 마감일 */}
          <FormRow>
            <FormLabel>모집 마감일 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="date" name="recruitmentDeadline" value={formData.recruitmentDeadline} onChange={handleChange} required />
            </InputArea>
          </FormRow>

          {/* Row 13: 특이사항 */}
          <FormRow>
            <FormLabel>특이사항
              <p>강사 준비물, 유의사항 등</p>
            </FormLabel>
            <InputArea>
              <TextArea
                name="special_notes"
                placeholder="- 커리큘럼 정보&#13;&#10;- 강사 준비물 및 유의사항&#13;&#10;- 기타 참고사항을 자세히 입력해주세요."
                value={formData.special_notes}
                onChange={handleChange}
              />
            </InputArea>
          </FormRow>

        </FormLayout>
      </ScrollArea>

      <FixedBottomBar>
        <Button type="button" onClick={() => router.back()} $variant="secondary" disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" form="lecture-form" $variant="primary" disabled={isSubmitting}>
          {isSubmitting ? '등록 중...' : '강의 등록'}
        </Button>
      </FixedBottomBar>
    </PageContainer>
  );
}