"use client";

import React, { useState, useEffect, useRef } from "react";
import * as S from "./styles";
//새로운 메시지 온거 표시 코드는 있으나 백엔드 수정 필요하긴 한데 필요 없을듯해서 코드만 뒀습니다.
// --- Types ---
type Instructor = {
  id: number;
  name: string;
  major: string;
  profile_photo_url?: string;
  portfolio?: string;
};

type ChatMessage = {
  id: number;
  sender_id: number;
  content: string;
  sent_at: string;
  read_at: string | null;
  isMine: boolean;
};

// WebSocket Types
type WsMessageEvent = {
  event: "message";
  message_id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  sent_at: string;
};

type WsReadEvent = {
  event: "read";
  message_ids: number[];
};

type WsAnyEvent = WsMessageEvent | WsReadEvent | { event: string; [key: string]: any };

// --- Utils ---
const BACKEND_HTTP_BASE = process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE ?? "http://localhost:8000";
const BACKEND_WS_BASE = process.env.NEXT_PUBLIC_BACKEND_WS_BASE ?? "ws://localhost:8000";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("accessToken");
}

function createAuthHeaders() {
  const token = getAccessToken();
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function getInstructorName(i: Instructor) {
  return i.name || `강사 #${i.id}`;
}

function formatTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("ko-KR", { hour: "numeric", minute: "2-digit" });
}

function formatDateHeader(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
}

// --- Icons ---
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
);
const ChatIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

export default function ManagerMessagesPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const [sendText, setSendText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 안 읽은 뱃지 카운트
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 1. 강사 목록 조회
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await fetch(`${BACKEND_HTTP_BASE}/api/accounts/instructors/`, {
          headers: createAuthHeaders() as any,
        });
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.results || data.instructors || [];
          setInstructors(list);

          // 초기 unread_count 설정 (백엔드 지원 시)
          const initialCounts: Record<number, number> = {};
          list.forEach((i: any) => {
            if (i.unread_count) initialCounts[i.id] = i.unread_count;
          });
          setUnreadCounts(initialCounts);
        }
      } catch (e) { console.error(e); }
    };
    fetchInstructors();
  }, []);

  // 2. 강사 선택 -> 히스토리 로드 & 뱃지 제거
  useEffect(() => {
    if (!selectedInstructorId) return;

    setUnreadCounts(prev => ({ ...prev, [selectedInstructorId]: 0 }));

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BACKEND_HTTP_BASE}/api/communications/history/${selectedInstructorId}/`, {
          headers: createAuthHeaders() as any,
        });
        if (res.ok) {
          const data = await res.json();
          const sorted = (data.messages || []).sort((a: any, b: any) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
          setMessages(sorted.map((m: any) => ({ ...m, isMine: m.sender_id !== selectedInstructorId })));
        }
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchHistory();
  }, [selectedInstructorId]);

  // 3. WebSocket 연결
  useEffect(() => {
    if (!selectedInstructorId) return;
    const token = getAccessToken();
    if (!token) return;

    const url = `${BACKEND_WS_BASE}/ws/chat/${selectedInstructorId}/?token=${token}`;
    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => setIsWsConnected(true);
    socket.onclose = () => setIsWsConnected(false);

    socket.onmessage = (event) => {
      try {
        const data: WsAnyEvent = JSON.parse(event.data);

        if (data.event === "message") {
          const msgEvent = data as WsMessageEvent;

          if (msgEvent.sender_id === selectedInstructorId || msgEvent.recipient_id === selectedInstructorId) {
            setMessages((prev) => [...prev, {
              id: msgEvent.message_id,
              sender_id: msgEvent.sender_id,
              content: msgEvent.content,
              sent_at: msgEvent.sent_at,
              read_at: null,
              isMine: msgEvent.sender_id !== selectedInstructorId,
            }]);
          } else {
            // 다른 강사로부터 온 메시지라면 뱃지에 표시 (백엔드에서 구현 안됨 근데 안해도 될듯합니다)
            setUnreadCounts(prev => ({
              ...prev,
              [msgEvent.sender_id]: (prev[msgEvent.sender_id] || 0) + 1
            }));
          }

        } else if (data.event === "read") {
          const readEvent = data as WsReadEvent;
          setMessages((prev) => prev.map((msg) =>
            readEvent.message_ids.includes(msg.id) ? { ...msg, read_at: new Date().toISOString() } : msg
          ));
        }
      } catch (e) { console.error(e); }
    };

    return () => socket.close();
  }, [selectedInstructorId]);

  const handleSend = () => {
    if (!sendText.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ command: "message", message: sendText.trim() }));
    setSendText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentInstructor = instructors.find(i => i.id === selectedInstructorId);

  // 날짜별 그룹화
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = msg.sent_at.split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <>
    <S.Title>메시지</S.Title>
    <S.Wrap>


      <S.ChatContainer>
        {/* [왼쪽] 강사 목록 */}
        <S.Sidebar>
          <S.SidebarHeader>
            <h2>강사 목록</h2>
          </S.SidebarHeader>
          <S.UserList>
            {instructors.map((inst) => {
              const isActive = inst.id === selectedInstructorId;
              const name = getInstructorName(inst);
              const count = unreadCounts[inst.id] || 0;

              return (
                <S.UserItem key={inst.id} $active={isActive} onClick={() => setSelectedInstructorId(inst.id)}>
                  <div className="avatar">
                    {inst.profile_photo_url ? (
                      <img src={inst.profile_photo_url} alt={name} />
                    ) : (
                      name.charAt(0)
                    )}
                  </div>
                  <div className="info">
                    <div className="name">{name}</div>
                    {/* 매니저는 강사의 전공 정보를 봅니다 */}
                    <div className="sub">{inst.major || "전공 미입력"}</div>
                  </div>
                  {count > 0 && <S.UnreadBadge>{count}</S.UnreadBadge>}
                </S.UserItem>
              );
            })}
          </S.UserList>
        </S.Sidebar>

        {/* [오른쪽] 채팅창 */}
        <S.ChatArea>
          {/* 헤더 */}
          <S.ChatHeader>
            <div className="title-group">
              <span className="name">
                {currentInstructor ? getInstructorName(currentInstructor) : "대화 상대 선택"}
              </span>
              {currentInstructor && (
                <div className="status-text">
                  <div className={`status-indicator ${isWsConnected ? "active" : ""}`} />
                  {isWsConnected ? "온라인" : "연결 중..."}
                </div>
              )}
            </div>
          </S.ChatHeader>

          {/* 메시지 내용 */}
          <S.MessageList>
            {!selectedInstructorId ? (
              <S.EmptyState>
                <ChatIcon />
                <div>왼쪽 목록에서 강사를 선택하여 대화를 시작하세요.</div>
              </S.EmptyState>
            ) : (
              <>
                {Object.keys(groupedMessages).map((date) => (
                  <div key={date}>
                    <S.DateDivider>{formatDateHeader(date)}</S.DateDivider>
                    {groupedMessages[date].map((msg) => (
                      <S.BubbleWrapper key={msg.id} $isMine={msg.isMine}>
                        <S.Bubble $isMine={msg.isMine}>
                          {msg.content}
                        </S.Bubble>
                        <S.MessageMeta $isMine={msg.isMine}>
                          {msg.isMine && (
                            <span className={`read-status ${msg.read_at ? "read" : ""}`}>
                              {msg.read_at ? "읽음" : "1"}
                            </span>
                          )}
                          <span className="time">{formatTime(msg.sent_at)}</span>
                        </S.MessageMeta>
                      </S.BubbleWrapper>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </S.MessageList>

          {/* 입력창 */}
          {selectedInstructorId && (
            <S.InputArea>
              <S.InputWrapper>
                <S.StyledTextarea
                  value={sendText}
                  onChange={(e) => setSendText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요..."
                  disabled={!isWsConnected}
                />
                <S.SendButton onClick={handleSend} disabled={!isWsConnected || !sendText.trim()}>
                  <SendIcon />
                </S.SendButton>
              </S.InputWrapper>
            </S.InputArea>
          )}
        </S.ChatArea>
      </S.ChatContainer>
    </S.Wrap>
    </>
  );
}