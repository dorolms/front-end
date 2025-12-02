'use client';

import axios from 'axios';
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { createLecture } from './api';

// [수정] 스타일 파일에서 import
import {
  PageContainer, Header, PageTitle, BackButton,
  ScrollArea, FormLayout, FormRow, FormLabel, InputArea,
  Input, TextArea, Select, Row, InputWrapper,
  // FileLabel,
  // SearchResultList, SearchResultItem,
  FixedBottomBar, Button,
  AddScheduleButton, ScheduleRow, DeleteButton
} from './styles';

// --- Main Component ---

export default function InstructorLectureNewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // [유지] 원본의 폼 상태
  const [formData, setFormData] = useState({
    title: '', type: 'general', category: '',
    location: '', target: '', capacity: '',
    content: '',
    note: '',
    // manager_id: 0,
    attachment_url: '',
    end_date: '',
    recruitment_main: '', recruitment_assist: '',
    fee: '',

    // [핵심] 다건 일정 관리
    schedules: [
      { date: '', start_time: '', end_time: '' } // 기본 1개 행
    ],
  });

  // [신규] 스케줄 개별 변경 핸들러
  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  // [신규] 스케줄 추가
  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { date: '', start_time: '', end_time: '' }]
    }));
  };

  // [신규] 스케줄 삭제
  const removeSchedule = (index: number) => {
    if (formData.schedules.length === 1) {
      alert('일정은 1개 이상이어야 합니다.');
      return;
    }
    const newSchedules = formData.schedules.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFormData((prev) => ({ ...prev, file: e.target.files![0] }));
  //   }
  // };

  // // [유지] 원본의 매니저 검색 로직
  // const MOCK_MANAGERS = [
  //   { id: 1, name: '김범수', email: 'bumsoo@doro.com', phone: '010-1234-5678' },
  //   { id: 2, name: '이매니저', email: 'lee@doro.com', phone: '010-1111-2222' },
  //   { id: 3, name: '박관리', email: 'park@doro.com', phone: '010-3333-4444' },
  // ];
  // const [managerSearch, setManagerSearch] = useState('');
  // const [showManagerList, setShowManagerList] = useState(false);
  // const [selectedManager, setSelectedManager] = useState<{ id: number, name: string, phone: string } | null>(null);

  // const selectManager = (manager: { id: number, name: string, email: string, phone: string }) => {
  //   setSelectedManager(manager);
  //   setManagerSearch(manager.name);
  //   setShowManagerList(false);
  //   setFormData(prev => ({ ...prev, manager_id: manager.id }));
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {

      // const attachmentUrl = formData.file ? `` : null;
      // 2. API Payload 구성
      const payload = {
        title: formData.title,
        type: formData.type,
        category: formData.category,
        status: 'RECRUITING',
        end_date: formData.end_date,
        
        recruitment_main: parseInt(formData.recruitment_main) || 0,
        recruitment_assist: parseInt(formData.recruitment_assist) || 0,
        
        schedules: formData.schedules,

        location: formData.location,
        // manager_id: formData.manager_id,
        target: formData.target,
        content: formData.content,
        note: formData.note,
        
        fee: formData.fee,
        attachment_url: "",
      };

      console.log('🚀 [Sending Payload]', payload);

      await createLecture(payload);

      // 성공 시
      alert('강의가 성공적으로 등록되었습니다.');
      router.push('/manager/lectures');

    } catch (error: any) {
      // 실패 시
      console.error('강의 등록 실패:', error);
      const errorMessage = error.response?.data?.detail || '등록 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>새 강의 등록</PageTitle>
        <BackButton onClick={() => router.back()}>목록으로</BackButton>
      </Header>

      <ScrollArea>
        <FormLayout id="lecture-form" onSubmit={handleSubmit}>
          
          {/* Row 1: 강의 제목 */}
          <FormRow>
            <FormLabel>
              강의 제목 <span className="required">*</span>
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
                  <option value="doroland">도로랜드</option>
                  <option value="booth">부스</option>
                </Select>
                <Input type="text" name="category" placeholder="강의 구분 (예: AI/SW)" value={formData.category} onChange={handleChange} required />
              </Row>
            </InputArea>
          </FormRow>
          
          {/* Row 3: 교육 대상 */}
          <FormRow>
            <FormLabel>교육 대상 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="text" name="target" placeholder="예: 초등학교 4학년" value={formData.target} onChange={handleChange} required />
            </InputArea>
          </FormRow>
          <FormRow>
            <FormLabel>인원 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="text" name="capacity" placeholder="예: 학급 당 30명, 2개 학급" value={formData.capacity} onChange={handleChange} required />
            </InputArea>
          </FormRow>

           {/* [수정] 강의 일정 (다건 입력) */}
          <FormRow>
            <FormLabel>
              강의 일정 <span className="required">*</span>
            </FormLabel>
            <InputArea>
              {formData.schedules.map((schedule, index) => (
                <ScheduleRow key={index}>
                  {/* 날짜 */}
                  <Input 
                    type="date" 
                    value={schedule.date} 
                    onChange={(e) => handleScheduleChange(index, 'date', e.target.value)} 
                    required 
                    style={{ flex: 1.2 }}
                  />
                  {/* 시작 시간 */}
                  <Input 
                    type="time" 
                    value={schedule.start_time} 
                    onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)} 
                    required 
                    style={{ flex: 1 }}
                  />
                  <span>~</span>
                  {/* 종료 시간 */}
                  <Input 
                    type="time" 
                    value={schedule.end_time} 
                    onChange={(e) => handleScheduleChange(index, 'end_time', e.target.value)} 
                    required 
                    style={{ flex: 1 }}
                  />
                  {/* 삭제 버튼 */}
                  <DeleteButton type="button" onClick={() => removeSchedule(index)} title="일정 삭제">
                    ✕
                  </DeleteButton>
                </ScheduleRow>
              ))}
              
              {/* 일정 추가 버튼 */}
              <AddScheduleButton type="button" onClick={addSchedule}>
                + 일정 추가하기
              </AddScheduleButton>
            </InputArea>
          </FormRow>
                

          {/* <FormRow>
            <FormLabel>교육 기간 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                <span>~</span>
                <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
              </Row>
            </InputArea>
          </FormRow>
          <FormRow>
            <FormLabel>강의 시간 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <Input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
                <span>~</span>
                <Input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
              </Row>
            </InputArea>
          </FormRow> */}

          {/* Row 6: 강의 장소 */}
          <FormRow>
            <FormLabel>강의 장소 <span className="required">*</span></FormLabel>
            <InputArea>
              <InputWrapper>
                <Input type="text" name="location" placeholder="주소 입력.." value={formData.location} onChange={handleChange} required />
              </InputWrapper>
            </InputArea>
          </FormRow>

          {/* Row 7: 담당자 정보 (검색 + 연락처) - [수정됨] */}
          {/* <FormRow>
            <FormLabel>
              담당자 정보 <span className="required">*</span>
              <p>강의를 담당하는 매니저를 선택합니다.</p>
            </FormLabel>
            <InputArea>
              <Row>
                
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
          </FormRow> */}

          {/* Row 8: 콘텐츠 */}
          <FormRow>
            <FormLabel>콘텐츠<p>강의 상세 내용, 커리큘럼 등</p></FormLabel>
            <InputArea>
              <TextArea name="content" placeholder="- 강의의 콘텐츠 정보." value={formData.content} onChange={handleChange} />
            </InputArea>
          </FormRow>

          {/* Row 9: 파일 첨부 */}
          {/* <FormRow>
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
          </FormRow> */}

          <FormRow>
            <FormLabel>필요 주도로쌤 수 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="number" name="recruitment_main" placeholder="0" min="0" value={formData.recruitment_main} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">명</span>
                </InputWrapper>
                {/* <InputWrapper>
                  <Input type="number" name="fee_main" placeholder="주 도로쌤 급여 (원)" min="0" value={formData.fee_main} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">원</span>
                </InputWrapper> */}
              </Row>
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>필요 보조도로쌤 수 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="number" name="recruitment_assist" placeholder="0" min="0" value={formData.recruitment_assist} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">명</span>
                </InputWrapper>
                {/* <InputWrapper>
                  <Input type="number" name="fee_assist" placeholder="보조 도로쌤 급여 (원)" min="0" value={formData.fee_assist} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">원</span>
                </InputWrapper> */}
              </Row>
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>급여 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="text" name="fee" placeholder="예: 주도로쌤 회차당 000원 / 보조도로쌤 회차당 000원" value={formData.fee} onChange={handleChange} required />
                </InputWrapper>
                {/* <InputWrapper>
                  <Input type="number" name="fee_assist" placeholder="보조 도로쌤 급여 (원)" min="0" value={formData.fee_assist} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">원</span>
                </InputWrapper> */}
              </Row>
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>모집 마감일 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>특이사항
              <p>강사 준비물, 유의사항 등</p>
            </FormLabel>
            <InputArea>
              <TextArea
                name="note"
                placeholder="- 강사 준비물 및 유의사항&#13;&#10;- 기타 참고사항을 자세히 입력해주세요."
                value={formData.note}
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