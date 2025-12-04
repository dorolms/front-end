"use client";

import { useState, useEffect, useRef } from "react";
import { Wrap, BreadCrumb, Title, Grid, LeftPanel, RightPanel } from "./styles";

type Instructor = {
  id: number;
  name: string;
  major: string;
  profile_photo_url?: string;
  portfolio?: string;
};

type RawMessage = {
  id: number;
  sender_id: number;
  recipient_id: number;
  content: string;
  sent_at: string;
  read_at: string | null;
};

type ChatMessage = RawMessage & {
  isMine: boolean;
};

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
  reader_id: number;
  other_user_id: number;
  message_ids: number[];
};

type WsAnyEvent =
  | WsMessageEvent
  | WsReadEvent
  | { event: string; [key: string]: any };

// --- 백엔드 주소 상수 (필요하면 .env에서 NEXT_PUBLIC_BACKEND_* 로 override 가능) ---
const BACKEND_HTTP_BASE =
  process.env.NEXT_PUBLIC_BACKEND_HTTP_BASE ?? "http://localhost:8000";
const BACKEND_WS_BASE =
  process.env.NEXT_PUBLIC_BACKEND_WS_BASE ?? "ws://localhost:8000";
// ------------------------------------------------------------------------

// localStorage 에서 accessToken 읽기
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem("accessToken");
  } catch {
    return null;
  }
}

// Authorization 헤더 포함한 공통 헤더 생성
function createAuthHeaders(base?: HeadersInit): HeadersInit {
  const token = getAccessToken();
  const headers: HeadersInit = {
    ...(base || {}),
  };

  if (token) {
    (headers as any).Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getInstructorDisplayName(instructor: Instructor): string {
  return `${instructor.name} 강사 (${instructor.major}) #${instructor.id}`;
}

function formatTime(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ManagerMessagesPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(false);
  const [selectedInstructorId, setSelectedInstructorId] = useState<
    number | null
  >(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isWsConnected, setIsWsConnected] = useState(false);

  const [sendText, setSendText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 스크롤 맨 아래로
  useEffect(() => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  // 1. 강사 목록 GET: /api/accounts/instructors/
  useEffect(() => {
    let cancelled = false;

    const fetchInstructors = async () => {
      setIsLoadingInstructors(true);
      setError(null);
      try {
        const res = await fetch(
          `${BACKEND_HTTP_BASE}/api/accounts/instructors/`,
          {
            method: "GET",
            headers: createAuthHeaders({ "Content-Type": "application/json" }),
            credentials: "include",
          }
        );

        if (res.status === 401) {
          throw new Error("UNAUTHORIZED");
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const list: Instructor[] = Array.isArray(data)
          ? data
          : data?.results || data?.instructors || [];

        if (cancelled) return;

        setInstructors(list);

        // 아무것도 선택 안 되어 있으면 첫 번째 강사 자동 선택
        if (!selectedInstructorId && list.length > 0) {
          setSelectedInstructorId(list[0].id);
        }
      } catch (e: any) {
        console.error(e);
        if (!cancelled) {
          if (e?.message === "UNAUTHORIZED") {
            setError("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
          } else {
            setError("강사 목록을 불러오는 중 오류가 발생했습니다.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingInstructors(false);
        }
      }
    };

    fetchInstructors();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. 선택된 강사 변경 시 메시지 히스토리 GET:
  //    /api/communications/history/<id>/
  useEffect(() => {
    if (!selectedInstructorId) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const fetchHistory = async () => {
      setIsLoadingHistory(true);
      setError(null);
      try {
        const res = await fetch(
          `${BACKEND_HTTP_BASE}/api/communications/history/${selectedInstructorId}/`,
          {
            method: "GET",
            headers: createAuthHeaders({ "Content-Type": "application/json" }),
            credentials: "include",
          }
        );

        if (res.status === 401) {
          throw new Error("UNAUTHORIZED");
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data: { messages: RawMessage[] } = await res.json();

        const sorted = [...data.messages].sort(
          (a, b) =>
            new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
        );

        if (cancelled) return;

        setMessages(
          sorted.map((m) => ({
            ...m,
            // 매니저 vs 강사 1:1 구조라고 가정 → sender_id !== selectedInstructorId 이면 "나(매니저)"
            isMine: m.sender_id !== selectedInstructorId,
          }))
        );
      } catch (e: any) {
        console.error(e);
        if (!cancelled) {
          if (e?.message === "UNAUTHORIZED") {
            setError("로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
          } else {
            setError("메시지 목록을 불러오는 중 오류가 발생했습니다.");
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    };

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedInstructorId]);

  // 3. WebSocket 연결: ws://.../ws/chat/<id>/?token=<JWT>
  useEffect(() => {
    if (!selectedInstructorId) {
      if (ws) {
        ws.close();
        setWs(null);
      }
      setIsWsConnected(false);
      return;
    }

    const token = getAccessToken();

    // 토큰이 없으면 연결 시도하지 않고 에러 표시
    if (!token) {
      setError(
        "로그인 정보가 없어 메시지 서버에 연결할 수 없습니다. 다시 로그인해주세요."
      );
      setIsWsConnected(false);
      return;
    }

    let url = `${BACKEND_WS_BASE}/ws/chat/${selectedInstructorId}/`;
    const qs = new URLSearchParams({ token }).toString();
    url += `?${qs}`;

    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => {
      setIsWsConnected(true);
    };

    socket.onclose = () => {
      setIsWsConnected(false);
      setWs((current) => (current === socket ? null : current));
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
      setError("메시지 서버와의 연결 중 오류가 발생했습니다.");
    };

    socket.onmessage = (event) => {
      try {
        const data: WsAnyEvent = JSON.parse(event.data);

        if (data.event === "message") {
          const msgEvent = data as WsMessageEvent;
          const newMsg: ChatMessage = {
            id: msgEvent.message_id,
            sender_id: msgEvent.sender_id,
            recipient_id: msgEvent.recipient_id,
            content: msgEvent.content,
            sent_at: msgEvent.sent_at,
            read_at: null,
            isMine: msgEvent.sender_id !== selectedInstructorId,
          };
          setMessages((prev) => [...prev, newMsg]);
        } else if (data.event === "read") {
          const readEvent = data as WsReadEvent;
          if (!readEvent.message_ids || !readEvent.message_ids.length) return;

          setMessages((prev) =>
            prev.map((msg) => {
              if (!readEvent.message_ids.includes(msg.id)) {
                return msg;
              }
              if (msg.read_at) return msg;
              return {
                ...msg,
                read_at: new Date().toISOString(),
              };
            })
          );
        }
      } catch (e) {
        console.error("Failed to parse WS message:", e);
      }
    };

    return () => {
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedInstructorId]);

  const handleSelectInstructor = (id: number) => {
    setError(null);
    setSelectedInstructorId(id);
  };

  const handleSend = () => {
    const text = sendText.trim();
    if (
      !text ||
      !ws ||
      ws.readyState !== WebSocket.OPEN ||
      !selectedInstructorId
    ) {
      return;
    }

    ws.send(
      JSON.stringify({
        command: "message",
        message: text,
      })
    );
    setSendText("");
  };

  const handleKeyDownOnTextarea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // IME 조합 중인지 확인
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedInstructor = instructors.find(
    (i) => i.id === selectedInstructorId
  );

  return (
    <Wrap>
      <BreadCrumb>홈 &gt; 메시지</BreadCrumb>
      <Title>메시지</Title>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #fecaca",
            backgroundColor: "#fef2f2",
            fontSize: 13,
            color: "#b91c1c",
          }}>
          {error}
        </div>
      )}

      <Grid>
        {/* 왼쪽: 강사 목록 */}
        <LeftPanel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}>
            <div
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                }}>
                강사 목록
              </div>
              {isLoadingInstructors && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                  }}>
                  불러오는 중…
                </span>
              )}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
              }}>
              {!isLoadingInstructors && instructors.length === 0 && (
                <div
                  style={{
                    padding: 12,
                    fontSize: 12,
                    color: "#9ca3af",
                  }}>
                  표시할 강사가 없습니다.
                </div>
              )}

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}>
                {instructors.map((instructor) => {
                  const isSelected = instructor.id === selectedInstructorId;
                  return (
                    <li key={instructor.id}>
                      <button
                        type="button"
                        onClick={() => handleSelectInstructor(instructor.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 10px",
                          border: "none",
                          backgroundColor: isSelected
                            ? "#eff6ff"
                            : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}>
                        {instructor.profile_photo_url && (
                          <img
                            src={instructor.profile_photo_url}
                            alt={instructor.name}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "999px",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        )}
                        <div
                          style={{
                            minWidth: 0,
                          }}>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: isSelected ? "#1d4ed8" : "#111827",
                              marginBottom: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>
                            {getInstructorDisplayName(instructor)}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "#6b7280",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>
                            {instructor.portfolio || ""}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </LeftPanel>

        {/* 오른쪽: 채팅 영역 */}
        <RightPanel>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}>
            {/* 채팅 헤더 */}
            <div
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                  }}>
                  채팅창
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    color: "#6b7280",
                  }}>
                  {selectedInstructor
                    ? `${getInstructorDisplayName(
                        selectedInstructor
                      )} 님과 대화 중`
                    : "왼쪽에서 대화할 강사를 선택해주세요."}
                </div>
              </div>
              {selectedInstructorId && (
                <div
                  style={{
                    fontSize: 11,
                    color: isWsConnected ? "#16a34a" : "#9ca3af",
                  }}>
                  {isWsConnected ? "연결됨" : "연결 중…"}
                </div>
              )}
            </div>

            {/* 메시지 리스트 */}
            <div
              style={{
                flex: 1,
                padding: 12,
                overflowY: "auto",
                backgroundColor: "#f8fafc",
              }}>
              {isLoadingHistory && selectedInstructorId && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#6b7280",
                    marginBottom: 8,
                  }}>
                  기존 메시지를 불러오는 중입니다…
                </div>
              )}

              {!isLoadingHistory &&
                selectedInstructorId &&
                messages.length === 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                    }}>
                    아직 주고받은 메시지가 없습니다. 첫 메시지를 보내보세요.
                  </div>
                )}

              {!selectedInstructorId && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                  }}>
                  왼쪽 강사 목록에서 대화할 상대를 선택하면 메시지 목록이
                  표시됩니다.
                </div>
              )}

              <div>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: msg.isMine ? "flex-end" : "flex-start",
                      marginBottom: 6,
                    }}>
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "6px 10px",
                        borderRadius: 10,
                        fontSize: 13,
                        lineHeight: 1.4,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        backgroundColor: msg.isMine ? "#2563eb" : "#ffffff",
                        color: msg.isMine ? "#ffffff" : "#111827",
                        border: msg.isMine ? "none" : "1px solid #e5e7eb",
                        boxShadow:
                          "0 1px 2px rgba(15,23,42,0.06), 0 0 0 1px rgba(15,23,42,0.02)",
                      }}>
                      <div>{msg.content}</div>
                      <div
                        style={{
                          marginTop: 3,
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: 6,
                          fontSize: 10,
                          opacity: 0.8,
                        }}>
                        <span>{formatTime(msg.sent_at)}</span>
                        {msg.isMine && (
                          <span>{msg.read_at ? "읽음" : "전송됨"}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* 입력 영역 */}
            <div
              style={{
                borderTop: "1px solid #e5e7eb",
                padding: 10,
              }}>
              <textarea
                value={sendText}
                onChange={(e) => setSendText(e.target.value)}
                onKeyDown={handleKeyDownOnTextarea}
                disabled={!selectedInstructorId || !isWsConnected}
                placeholder={
                  selectedInstructor
                    ? "메시지를 입력하세요. (Enter: 보내기, Shift+Enter: 줄바꿈)"
                    : "강사를 먼저 선택하세요."
                }
                style={{
                  width: "100%",
                  minHeight: 60,
                  resize: "none",
                  fontSize: 13,
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  outline: "none",
                  boxSizing: "border-box",
                  marginBottom: 6,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={
                    !selectedInstructorId ||
                    !isWsConnected ||
                    !sendText.trim().length
                  }
                  style={{
                    padding: "6px 14px",
                    fontSize: 13,
                    borderRadius: 999,
                    border: "none",
                    backgroundColor:
                      !selectedInstructorId ||
                      !isWsConnected ||
                      !sendText.trim().length
                        ? "#9ca3af"
                        : "#2563eb",
                    color: "#ffffff",
                    cursor:
                      !selectedInstructorId ||
                      !isWsConnected ||
                      !sendText.trim().length
                        ? "default"
                        : "pointer",
                  }}>
                  보내기
                </button>
              </div>
            </div>
          </div>
        </RightPanel>
      </Grid>
    </Wrap>
  );
}
