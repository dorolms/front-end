import React from 'react';
import styled from 'styled-components';
import { Lecture, Schedule } from '../types';

interface InstructorEventCardProps {
  lecture: Lecture;
  schedule: Schedule;
  onClick: () => void;
}

const getTypeColor = (type: string, isRecruiting: boolean) => {
  const colors = {
    normal: { bg: '#FFF9E6', border: '#FFD700' },
    doroland: { bg: '#E6F0FF', border: '#1E3A8A' },
    booth: { bg: '#FFE6E6', border: '#DC2626' },
    etc: { bg: '#F3F4F6', border: '#6B7280' },
    competition: { bg: '#E0F2FE', border: '#0EA5E9' },
    camp: { bg: '#ECFDF5', border: '#10B981' }
  };

  const colorSet = colors[type as keyof typeof colors] || colors.etc;
  
  if (!isRecruiting) {
    return {
      bg: '#F9FAFB',
      border: '#D1D5DB'
    };
  }
  
  return colorSet;
};

const InstructorEventCard: React.FC<InstructorEventCardProps> = ({ 
  lecture, 
  schedule, 
  onClick 
}) => {
  const isRecruiting = lecture.status === 'RECRUITING';
  const colors = getTypeColor(lecture.type, isRecruiting);

  return (
    <CardContainer 
      onClick={onClick}
      bgColor={colors.bg}
      borderColor={colors.border}
      isRecruiting={isRecruiting}
    >
      <Time>{schedule.start_time.slice(0, 5)}</Time>
      <Title isRecruiting={isRecruiting}>{lecture.title}</Title>
      {!isRecruiting && <StatusBadge>모집 완료</StatusBadge>}
    </CardContainer>
  );
};

const CardContainer = styled.div<{ 
  bgColor: string; 
  borderColor: string;
  isRecruiting: boolean;
}>`
  background-color: ${props => props.bgColor};
  border-left: 3px solid ${props => props.borderColor};
  padding: 4px 6px;
  margin: 2px 0;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.isRecruiting ? 1 : 0.7};

  &:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Time = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
`;

const Title = styled.div<{ isRecruiting: boolean }>`
  font-size: 12px;
  color: ${props => props.isRecruiting ? '#111827' : '#6B7280'};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  font-size: 10px;
  color: #6B7280;
  background-color: #E5E7EB;
  padding: 1px 4px;
  border-radius: 2px;
  margin-top: 2px;
  display: inline-block;
`;

export default InstructorEventCard;