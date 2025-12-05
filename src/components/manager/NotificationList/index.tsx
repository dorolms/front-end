"use client";

import { useEffect, useState, useMemo } from "react";
import * as S from "./styles";
import * as API from "./api";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type InstructorGroup = {
  user_id: number;
  user_name: string;
  total_count: number;
  unread_count: number;
  latest_date: string;
};

type Notification = {
  id: number;
  user: number;
  user_name: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

/* -------------------------------------------------------------------------- */
/*  Icons                                                                     */
/* -------------------------------------------------------------------------- */

const BellIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.5}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const RefreshIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </svg>
);

const ChevronLeft = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const CheckCircle = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#cbd5e1"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

/** 재전송 완료 모달에서 사용하는 큰 체크 아이콘 */
const SuccessCheckIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#10b981"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ManagerNotificationList() {
  /** 전체 / 상세 보기 모드 */
  const [view, setView] = useState<"LIST" | "DETAIL">("LIST");

  /** 전체 알림 데이터 (모든 강사) */
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  /** 선택된 강사 정보 (상세 보기용) */
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);
  const [selectedInstructorName, setSelectedInstructorName] = useState("");

  /** 필터 및 검색 상태 */
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [filterType, setFilterType] = useState<string>("ALL");

  /** 재전송 관련 모달 상태 */
  const [pendingNoti, setPendingNoti] = useState<Notification | null>(null); // 재전송 확인 모달
  const [isSuccessOpen, setIsSuccessOpen] = useState(false); // 재전송 성공 모달

  useEffect(() => {
    loadAllNotifications();
  }, []);

  /**
   * 전체 알림 목록 로드
   * - 매니저가 관리 화면에서 사용하는 모든 알림 데이터
   */
  const loadAllNotifications = async () => {
    setLoading(true);
    try {
      const data: Notification[] = await API.getAllNotificationsAPI();
      setAllNotifications(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 개별 알림이 현재 필터 조건에 포함되는지 여부
   */
  const isMatchFilter = (noti: Notification) => {
    if (filterType === "ASSIGN" && !noti.message.includes("강사로 배정")) return false;
    if (filterType === "NEW_LECTURE" && !noti.message.includes("새로운 강의")) return false;
    if (filterType === "NOTICE" && !noti.message.includes("새로운 공지사항")) return false;

    if (
      searchQuery &&
      !noti.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  };

  /**
   * 강사별로 알림을 묶어 요약 정보(InstructorGroup) 생성
   * - 전체 목록 화면에서 사용
   */
  const instructorGroups = useMemo(() => {
    const groups: { [key: number]: InstructorGroup } = {};

    allNotifications.forEach((noti) => {
      if (!isMatchFilter(noti)) return;

      if (!groups[noti.user]) {
        groups[noti.user] = {
          user_id: noti.user,
          user_name: noti.user_name || `강사 ${noti.user}`,
          total_count: 0,
          unread_count: 0,
          latest_date: noti.created_at,
        };
      }

      groups[noti.user].total_count += 1;

      if (!noti.is_read) {
        groups[noti.user].unread_count += 1;
      }

      if (new Date(noti.created_at) > new Date(groups[noti.user].latest_date)) {
        groups[noti.user].latest_date = noti.created_at;
      }
    });

    let result = Object.values(groups);

    if (showUnreadOnly) {
      result = result.filter((group) => group.unread_count > 0);
    }

    // 미확인 개수 우선 정렬 → 최근 알림 기준 정렬
    return result.sort((a, b) => {
      if (b.unread_count !== a.unread_count) return b.unread_count - a.unread_count;
      return new Date(b.latest_date).getTime() - new Date(a.latest_date).getTime();
    });
  }, [allNotifications, searchQuery, showUnreadOnly, filterType]);

  /**
   * 선택된 강사의 알림 목록
   * - 상세 보기 화면에서 사용
   */
  const detailNotifications = useMemo(() => {
    if (!selectedInstructorId) return [];

    let list = allNotifications.filter((noti) => noti.user === selectedInstructorId);
    list = list.filter((noti) => isMatchFilter(noti));

    if (showUnreadOnly) {
      list = list.filter((noti) => !noti.is_read);
    }

    return list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [allNotifications, selectedInstructorId, showUnreadOnly, filterType]);

  /**
   * 강사 선택 → 상세 화면으로 이동
   */
  const handleSelectInstructor = (id: number, name: string) => {
    setSelectedInstructorId(id);
    setSelectedInstructorName(name);
    setView("DETAIL");
  };

  /**
   * 상세 → 목록 화면으로 돌아가기
   */
  const handleBack = () => {
    setView("LIST");
    setSelectedInstructorId(null);
  };

  /**
   * 재전송 버튼 클릭 시: 대상 알림을 모달에 세팅
   */
  const handleResendClick = (noti: Notification) => {
    setPendingNoti(noti);
  };

  /**
   * 재전송 모달에서 실제 재전송 실행
   */
  const executeResend = async () => {
    if (!pendingNoti) return;

    try {
      await API.resendNotificationAPI(pendingNoti);

      // 성공 처리: 확인 모달 닫기 + 성공 모달 오픈
      setPendingNoti(null);
      setIsSuccessOpen(true);

      // 재전송으로 새 알림이 추가되었을 수 있으므로 목록 다시 로드
      loadAllNotifications();
    } catch (error) {
      console.error(error);
      alert("전송 실패");
    }
  };

  /**
   * 날짜/시간 표시 형식 변환 (MM/DD HH:mm)
   */
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <>
      <S.Container onClick={(e) => e.stopPropagation()}>
        {/* 상단 헤더 영역 */}
        <S.Header>
          {view === "LIST" ? (
            <S.HeaderTitle>
              알림 관리
              <span
                style={{
                  color: "#94a3b8",
                  fontWeight: 400,
                  fontSize: "0.9em",
                  marginLeft: 4,
                }}
              >
                ({instructorGroups.length})
              </span>
            </S.HeaderTitle>
          ) : (
            <>
              <S.BackBtn onClick={handleBack}>
                <ChevronLeft /> 목록으로
              </S.BackBtn>
              <S.HeaderTitle>{selectedInstructorName}</S.HeaderTitle>
            </>
          )}
        </S.Header>

        {/* 상단 필터 영역 */}
        <S.FilterSection>
          {view === "LIST" && (
            <S.FilterRow>
              <S.SearchInputWrapper>
                <SearchIcon />
                <S.SearchInput
                  placeholder="강사명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </S.SearchInputWrapper>
            </S.FilterRow>
          )}

          <S.FilterRow>
            <S.Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">전체 유형</option>
              <option value="ASSIGN">강사 배정</option>
              <option value="NEW_LECTURE">신규 강의</option>
              <option value="NOTICE">공지사항</option>
            </S.Select>

            <S.ToggleButton
              $isActive={showUnreadOnly}
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            >
              {showUnreadOnly && <CheckCircle />}
              미확인만
            </S.ToggleButton>
          </S.FilterRow>
        </S.FilterSection>

        {/* 내용 영역: 리스트 / 상세 */}
        <S.List>
          {loading && <S.EmptyState>로딩 중...</S.EmptyState>}

          {!loading && view === "LIST" && (
            instructorGroups.length > 0 ? (
              instructorGroups.map((group) => (
                <S.InstructorItem
                  key={group.user_id}
                  onClick={() =>
                    handleSelectInstructor(group.user_id, group.user_name)
                  }
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <S.Avatar $hasUnread={group.unread_count > 0}>
                      {group.user_name.charAt(0)}
                    </S.Avatar>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "0.9rem",
                          color: "#334155",
                        }}
                      >
                        {group.user_name}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        최근: {formatTime(group.latest_date)}
                      </span>
                    </div>
                  </div>

                  {group.unread_count > 0 ? (
                    <S.CountBadge>{group.unread_count}건 미확인</S.CountBadge>
                  ) : (
                    <CheckIcon />
                  )}
                </S.InstructorItem>
              ))
            ) : (
              <S.EmptyState>
                <BellIcon />
                <span>조건에 맞는 알림이 없습니다.</span>
              </S.EmptyState>
            )
          )}

          {!loading && view === "DETAIL" && (
            <S.DetailWrapper>
              {detailNotifications.length > 0 ? (
                detailNotifications.map((noti) => (
                  <S.NotificationCard key={noti.id} $isRead={noti.is_read}>
                    <div className="header">
                      <span className="status">
                        {noti.is_read ? "읽음" : "미확인"}
                      </span>
                      <span className="time">{formatTime(noti.created_at)}</span>
                    </div>
                    <div className="message">{noti.message}</div>
                    {!noti.is_read && (
                      <div className="actions">
                        <S.ActionBtn
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResendClick(noti);
                          }}
                        >
                          <RefreshIcon /> 재전송
                        </S.ActionBtn>
                      </div>
                    )}
                  </S.NotificationCard>
                ))
              ) : (
                <S.EmptyState>
                  <span>해당 조건의 알림이 없습니다.</span>
                </S.EmptyState>
              )}
            </S.DetailWrapper>
          )}
        </S.List>
      </S.Container>

      {/* 재전송 확인 모달 */}
      {pendingNoti && (
        <S.ModalOverlay onClick={() => setPendingNoti(null)}>
          <S.ModalBox onClick={(e) => e.stopPropagation()}>
            <S.IconCircle>
              <SendIcon />
            </S.IconCircle>
            <S.ModalContent>
              <h3>알림 재전송</h3>
              <p>
                <strong>{pendingNoti.user_name}</strong>님께
                <br />
                해당 알림을 다시 보내시겠습니까?
              </p>
            </S.ModalContent>
            <S.ModalActions>
              <S.CancelButton onClick={() => setPendingNoti(null)}>
                취소
              </S.CancelButton>
              <S.ConfirmButton onClick={executeResend}>
                전송하기
              </S.ConfirmButton>
            </S.ModalActions>
          </S.ModalBox>
        </S.ModalOverlay>
      )}

      {/* 재전송 완료 모달 */}
      {isSuccessOpen && (
        <S.SuccessOverlay onClick={() => setIsSuccessOpen(false)}>
          <S.SuccessBox onClick={(e) => e.stopPropagation()}>
            <SuccessCheckIcon />
            <S.SuccessMessage>알림이 전송되었습니다.</S.SuccessMessage>
            <S.SuccessButton onClick={() => setIsSuccessOpen(false)}>
              확인
            </S.SuccessButton>
          </S.SuccessBox>
        </S.SuccessOverlay>
      )}
    </>
  );
}
