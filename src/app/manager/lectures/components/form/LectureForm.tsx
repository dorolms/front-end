'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

interface LectureFormProps {
    where: 'new' | 'edit';
    initialData?: any;           // 수정일 경우 채워넣을 초기 데이터
    onSubmit: (data: any) => void; // 저장 버튼 눌렀을 때 실행할 부모 함수
    onBack: () => void; // 저장 버튼 눌렀을 때 실행할 부모 함수
    isSubmitting: boolean;       // 로딩 상태
}

export default function LectureForm({ 
    where,
    initialData,
    onBack, 
    onSubmit, 
    isSubmitting 
}: LectureFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '', type: 'general', category: '',
    status: 'RECRUITING',
    location: '', target: '', capacity: '',
    content: '',
    note: '',
    attachment_url: '',
    end_date: '',
    recruitment_main: '', recruitment_assist: '',
    fee: '',

    schedules: [
      { date: '', start_time: '', end_time: '' }
    ],
  });

   // 2. 수정 모드일 때(initialData가 들어오면) 폼 채워주는 로직만 추가
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleScheduleChange = (index: number, field: string, value: string) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setFormData(prev => ({ ...prev, schedules: newSchedules }));
  };

  const addSchedule = () => {
    setFormData(prev => ({
      ...prev,
      schedules: [...prev.schedules, { date: '', start_time: '', end_time: '' }]
    }));
  };

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

  // 3. handleSubmit 수정: 직접 API 호출하지 않고 부모가 준 onSubmit 실행
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 유효성 검사 로직 등...
    
    // ★ 핵심: 여기서 axios를 부르지 말고, 부모에게 데이터만 전달
    onSubmit(formData); 
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>{where === 'new' ? '새 강의 등록' : '강의 수정'}</PageTitle>
        <BackButton onClick={onBack}>{where === 'new' ? '목록으로' : '돌아가기'}</BackButton>
      </Header>

      <ScrollArea>
        <FormLayout id="lecture-form" onSubmit={handleSubmit}>
          
          <FormRow>
            <FormLabel>
              강의 제목 <span className="required">*</span>
            </FormLabel>
            <InputArea>
              <Input
                type="text" name="title"
                maxLength={255}
                placeholder="예: [2025-1학기] 도로초등학교 4학년 AI 기초 교육"
                value={formData.title} onChange={handleChange} required
                style={{ fontSize: '16px', fontWeight: '600' }}
              />
            </InputArea>
          </FormRow>

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
              </Row>
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>강의 구분 <span className="required">*</span></FormLabel>
            <InputArea>
                <Input type="text" name="category" maxLength={100} placeholder="강의 구분 (예: AI/SW)" value={formData.category} onChange={handleChange} required />
            </InputArea>
          </FormRow>

          {where === "edit" ? <FormRow>
            <FormLabel>상태 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value='RECRUITING'>모집 중</option>
                  <option value='ALLOCATING'>배정 중</option>
                  <option value='COMPLETED'>배정 완료</option>
                </Select>
              </Row>
            </InputArea>
          </FormRow> : null}

          <FormRow>
            <FormLabel>
              강의 일정 <span className="required">*</span>
            </FormLabel>
            <InputArea>
              {formData.schedules.map((schedule, index) => (
                <ScheduleRow key={index}>
                  <Input 
                    type="date" 
                    value={schedule.date} 
                    onChange={(e) => handleScheduleChange(index, 'date', e.target.value)} 
                    required 
                    style={{ flex: 1.2 }}
                  />
                  <Input 
                    type="time" 
                    value={schedule.start_time} 
                    onChange={(e) => handleScheduleChange(index, 'start_time', e.target.value)} 
                    required 
                    style={{ flex: 1 }}
                  />
                  <span>~</span>
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
          
          <FormRow>
            <FormLabel>강의 장소 <span className="required">*</span></FormLabel>
            <InputArea>
              <InputWrapper>
                <Input type="text" name="location" maxLength={255} placeholder="주소 입력.." value={formData.location} onChange={handleChange} required />
              </InputWrapper>
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>교육 대상 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="text" name="target" maxLength={255} placeholder="예: 초등학교 4학년" value={formData.target} onChange={handleChange} required />
            </InputArea>
          </FormRow>
          
          <FormRow>
            <FormLabel>인원 <span className="required">*</span></FormLabel>
            <InputArea>
              <Input type="text" name="capacity" maxLength={100} placeholder="예: 학급 당 30명, 2개 학급" value={formData.capacity} onChange={handleChange} required />
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>콘텐츠<p>강의 상세 내용, 커리큘럼 등</p></FormLabel>
            <InputArea>
              <TextArea name="content" placeholder="- 강의의 콘텐츠 정보." value={formData.content} onChange={handleChange} />
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>첨부파일 URL </FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="text" name="attachment_url" maxLength={255} placeholder="선택) 파일 URL을 복사하여 붙여넣으세요 - 예: https://example.com/detail.pdf" value={formData.attachment_url} onChange={handleChange} />
                </InputWrapper>
              </Row>
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
              </Row>
            </InputArea>
          </FormRow>

          <FormRow>
            <FormLabel>강의료 <span className="required">*</span></FormLabel>
            <InputArea>
              <Row>
                <InputWrapper>
                  <Input type="text" name="fee" placeholder="예: 주도로쌤 회차당 000원 / 보조도로쌤 회차당 000원" value={formData.fee} onChange={handleChange} required />
                </InputWrapper>
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
        <Button type="button" onClick={onBack} $variant="secondary" disabled={isSubmitting}>
          취소
        </Button>
        <Button type="submit" form="lecture-form" $variant="primary" disabled={isSubmitting}>
          {where === 'new' ? isSubmitting ? '등록 중...' : '강의 등록' : isSubmitting ? '저장 중...' : '저장하기'}
        </Button>
      </FixedBottomBar>
    </PageContainer>
  );
}