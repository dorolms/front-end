import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Lecture, Schedule, LectureDetail } from '../../types';

interface InstructorEventDetailModalProps {
  lecture: Lecture | null;
  schedule: Schedule | null;
  isOpen: boolean;
  onClose: () => void;
}

const InstructorEventDetailModal: React.FC<InstructorEventDetailModalProps> = ({
  lecture,
  schedule,
  isOpen,
  onClose
}) => {
  const [lectureDetail, setLectureDetail] = useState<LectureDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen && lecture) {
      fetchLectureDetail(lecture.id);
    }
    
    // 모달 닫힐 때 데이터 초기화
    if (!isOpen) {
      setLectureDetail(null);
      setError(null);
    }
  }, [isOpen, lecture?.id]);

  const fetchLectureDetail = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}/api/lectures/lectures/${id}`);
      
      if (!response.ok) {
        throw new Error('강의 정보를 불러오는데 실패했습니다.');
      }
      
      const data = await response.json();
      setLectureDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '오류가 발생했습니다.');
      console.error('Failed to fetch lecture detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      general: '일반',
      competition: '대회',
      camp: '캠프',
      doroland: '도로랜드',
      booth: '부스',
      etc: '기타'
    };
    return map[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      RECRUITING: '모집 중',
      ALLOCATING: '배정 중',
      COMPLETED: '배정 완료',
      COMPETITION: '배정 완료'
    };
    return map[status] || status;
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{lecture?.title || '강의 정보'}</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          {loading && (
            <LoadingContainer>
              <LoadingSpinner />
              <LoadingText>로딩 중...</LoadingText>
            </LoadingContainer>
          )}

          {error && (
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
              <RetryButton onClick={() => lecture && fetchLectureDetail(lecture.id)}>
                다시 시도
              </RetryButton>
            </ErrorContainer>
          )}

          {!loading && !error && lectureDetail && (
            <>
              <Section>
                <SectionTitle>기본 정보</SectionTitle>
                <InfoRow>
                  <Label>강의 타입</Label>
                  <Value>{getTypeLabel(lectureDetail.type)}</Value>
                </InfoRow>
                
                {lectureDetail.category && (
                  <InfoRow>
                    <Label>강의 구분</Label>
                    <Value>{lectureDetail.category}</Value>
                  </InfoRow>
                )}
                
                <InfoRow>
                  <Label>상태</Label>
                  <StatusBadge status={lectureDetail.status}>
                    {getStatusLabel(lectureDetail.status)}
                  </StatusBadge>
                </InfoRow>
                
                <InfoRow>
                  <Label>장소</Label>
                  <Value>{lectureDetail.location}</Value>
                </InfoRow>
                
                <InfoRow>
                  <Label>대상</Label>
                  <Value>{lectureDetail.target}</Value>
                </InfoRow>
                
                <InfoRow>
                  <Label>정원</Label>
                  <Value>{lectureDetail.capacity}명</Value>
                </InfoRow>
              </Section>

              <Divider />

              <Section>
                <SectionTitle>강의 일정</SectionTitle>
                {lectureDetail.schedules.map((sch) => (
                  <InfoRow key={sch.id}>
                    <Label>{sch.date}</Label>
                    <Value>{sch.start_time.slice(0, 5)} - {sch.end_time.slice(0, 5)}</Value>
                  </InfoRow>
                ))}
              </Section>

              <Divider />

              <Section>
                <SectionTitle>모집 정보</SectionTitle>
                <InfoRow>
                  <Label>모집 마감</Label>
                  <Value>{lectureDetail.end_date}</Value>
                </InfoRow>
                
                <InfoRow>
                  <Label>모집 인원</Label>
                  <Value>
                    메인 {lectureDetail.recruitment_main}명 / 보조 {lectureDetail.recruitment_assist}명
                  </Value>
                </InfoRow>
                
                <InfoRow>
                  <Label>강의료</Label>
                  <Value>{lectureDetail.fee}</Value>
                </InfoRow>
              </Section>

              {lectureDetail.content && (
                <>
                  <Divider />
                  <Section>
                    <SectionTitle>강의 내용</SectionTitle>
                    <ContentBox>{lectureDetail.content}</ContentBox>
                  </Section>
                </>
              )}

              {lectureDetail.note && (
                <>
                  <Divider />
                  <Section>
                    <SectionTitle>특이사항</SectionTitle>
                    <ContentBox>{lectureDetail.note}</ContentBox>
                  </Section>
                </>
              )}

              {lectureDetail.attachment_url && (
                <>
                  <Divider />
                  <Section>
                    <SectionTitle>첨부파일</SectionTitle>
                    <AttachmentLink href={lectureDetail.attachment_url} target="_blank" rel="noopener noreferrer">
                      📎 첨부파일 다운로드
                    </AttachmentLink>
                  </Section>
                </>
              )}

              {lectureDetail.confirmed_instructors.length > 0 && (
                <>
                  <Divider />
                  <Section>
                    <SectionTitle>확정 강사</SectionTitle>
                    <InfoRow>
                      <Value>{lectureDetail.confirmed_instructors.length}명 확정</Value>
                    </InfoRow>
                  </Section>
                </>
              )}
            </>
          )}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
  flex-shrink: 0;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #6B7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background-color: #F3F4F6;
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #E5E7EB;
  border-top-color: #3B82F6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  margin-top: 16px;
  color: #6B7280;
  font-size: 14px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const ErrorText = styled.div`
  color: #DC2626;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #2563EB;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  font-size: 14px;
`;

const Value = styled.div`
  color: #111827;
  font-size: 14px;
  flex: 1;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  background-color: ${props => {
    if (props.status === 'RECRUITING') return '#DBEAFE';
    if (props.status === 'ALLOCATING') return '#FEF3C7';
    return '#E5E7EB';
  }};
  color: ${props => {
    if (props.status === 'RECRUITING') return '#1E40AF';
    if (props.status === 'ALLOCATING') return '#92400E';
    return '#374151';
  }};
`;

const ContentBox = styled.div`
  background-color: #F9FAFB;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #E5E7EB;
  margin: 20px 0;
`;

const AttachmentLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #3B82F6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #2563EB;
    text-decoration: underline;
  }
`;

export default InstructorEventDetailModal;