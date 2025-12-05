'use client';

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { isTokenValid, getUserRole } from './jwt';
import { createLecture } from './api';

// [수정] 스타일 파일에서 import
// import {
//   PageContainer, Header, PageTitle, BackButton,
//   ScrollArea, FormLayout, FormRow, FormLabel, InputArea,
//   Input, TextArea, Select, Row, InputWrapper,
//   // FileLabel,
//   FixedBottomBar, Button,
//   AddScheduleButton, ScheduleRow, DeleteButton
// } from './styles';

// --- Main Component ---

import LectureForm from '../components/form/LectureForm';

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

  /*
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
  */

  const handleSubmit = async (formData: any) => {
    // e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {

      // const attachmentUrl = formData.file ? `` : null;
      // 2. API Payload 구성
      const payload = {
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
    <LectureForm 
      where='new'
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
} 