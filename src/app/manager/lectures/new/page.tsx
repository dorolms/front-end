'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { isTokenValid, getUserRole } from './jwt';
import { createLecture } from './api';

// [수정] 스타일 파일에서 import
import {
  PageContainer, Header, PageTitle, BackButton,
  ScrollArea, FormLayout, FormRow, FormLabel, InputArea,
  Input, TextArea, Select, Row, InputWrapper,
  // FileLabel,
  FixedBottomBar, Button,
  AddScheduleButton, ScheduleRow, DeleteButton
} from './styles';

// --- Main Component ---


export default function InstructorLectureNewPage() {
  const router = useRouter();
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
        capacity: formData.capacity,
        
        recruitment_main: parseInt(formData.recruitment_main) || 0,
        recruitment_assist: parseInt(formData.recruitment_assist) || 0,
        
        schedules: formData.schedules,

        location: formData.location,
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

  if (!isAuthChecked) {
    return null;
  }

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
                
          {/* Row 6: 강의 장소 */}
          <FormRow>
            <FormLabel>강의 장소 <span className="required">*</span></FormLabel>
            <InputArea>
              <InputWrapper>
                <Input type="text" name="location" placeholder="주소 입력.." value={formData.location} onChange={handleChange} required />
              </InputWrapper>
            </InputArea>
          </FormRow>


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
            <FormLabel>첨부파일 URL </FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="text" name="attachment_url" placeholder="선택) 파일 URL을 복사하여 붙여넣으세요 - 예: https://example.com/detail.pdf" value={formData.attachment_url} onChange={handleChange} />
                </InputWrapper>
                {/* <InputWrapper>
                  <Input type="number" name="fee_assist" placeholder="보조 도로쌤 급여 (원)" min="0" value={formData.fee_assist} onChange={handleChange} data-has-unit="true" />
                  <span className="unit">원</span>
                </InputWrapper> */}
              </Row>
            </InputArea>
          </FormRow>

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