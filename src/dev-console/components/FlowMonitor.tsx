/**
 * 실시간 데이터 흐름 감시 모니터 (FlowMonitor.tsx)
 *
 * flowTracker를 구독하여 API 수발신, 상태 전이 과정, 커스텀 이벤트 방출 로그를 실시간 출력합니다.
 * JSON 구문 강조 뷰어와 클립보드 복사 기능을 제공하며,
 * 네트워크 레이턴시 시뮬레이션 및 강제 에러 시뮬레이션을 상호 제어할 수 있는 조작기를 탑재하고 있습니다.
 */

import { useState, useEffect } from 'react';
import { flowTracker } from '../../utils/flowTracker';
import type { FlowEvent, FlowEventType } from '../../utils/flowTracker';

export default function FlowMonitor() {
  const [events, setEvents] = useState<FlowEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<FlowEvent | null>(null);
  const [filterType, setFilterType] = useState<FlowEventType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  // 시뮬레이터 상태 관리
  const [latencySim, setLatencySim] = useState(flowTracker.simulateLatency);
  const [errorSim, setErrorSim] = useState(flowTracker.simulateError);

  // 1. flowTracker 구독 처리
  useEffect(() => {
    const unsubscribe = flowTracker.subscribe((incomingEvents) => {
      if (!isPaused) {
        setEvents(incomingEvents);

        // 선택된 이벤트가 있으면 최신 정보로 동기화
        if (selectedEvent) {
          const updated = incomingEvents.find((e) => e.id === selectedEvent.id);
          if (updated) setSelectedEvent(updated);
        }
      }
    });

    return () => unsubscribe();
  }, [isPaused, selectedEvent]);

  // 2. 시뮬레이션 토글
  const handleToggleLatency = () => {
    const nextVal = !latencySim;
    setLatencySim(nextVal);
    flowTracker.simulateLatency = nextVal;
  };

  const handleToggleError = () => {
    const nextVal = !errorSim;
    setErrorSim(nextVal);
    flowTracker.simulateError = nextVal;
  };

  const handleClearLogs = () => {
    flowTracker.clearLogs();
    setSelectedEvent(null);
  };

  // 3. 필터 및 검색 적용
  const filteredEvents = events.filter((e) => {
    const matchType = filterType === 'all' || e.type === filterType;
    const matchSearch =
      e.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(e.detail).toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // 4. JSON 구문 강조 변환 헬퍼 (DevTools 룩앤필)
  const syntaxHighlight = (jsonObj: unknown) => {
    if (!jsonObj) return '';
    let json = JSON.stringify(jsonObj, null, 2);
    // HTML 이스케이프 처리
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // 정규식 매칭을 통해 JSON 요소들에 스타일 클래스 주입
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'text-amber-400'; // 숫자
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-indigo-400 font-semibold'; // Key 값
          } else {
            cls = 'text-emerald-400'; // String 값
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-blue-400'; // Boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-500'; // Null
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  // 5. 클립보드 복사
  const handleCopyJson = () => {
    if (!selectedEvent) return;
    void navigator.clipboard.writeText(JSON.stringify(selectedEvent.detail, null, 2));
    alert('JSON 데이터가 클립보드에 복사되었습니다.');
  };

  const getStatusBadge = (status: FlowEvent['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-950/40 text-yellow-400 border-yellow-800/50 animate-pulse';
      case 'success':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
      case 'error':
        return 'bg-rose-950/40 text-rose-400 border-rose-800/50';
      case 'aborted':
        return 'bg-gray-800 text-gray-400 border-gray-700';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getStatusText = (status: FlowEvent['status']) => {
    switch (status) {
      case 'pending':
        return '전송 중';
      case 'success':
        return '성공';
      case 'error':
        return '실패';
      case 'aborted':
        return '취소됨';
      default:
        return '완료';
    }
  };

  const getTypeBadge = (type: FlowEventType) => {
    switch (type) {
      case 'api':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60';
      case 'state':
        return 'bg-yellow-950/60 text-yellow-300 border-yellow-800/60';
      case 'event':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-[#070A13]">
      {/* Top Config Dashboard */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-white/5 bg-[#0D1222]/80 backdrop-blur-md">
        {/* Realtime filters */}
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5 text-0.75rem">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilterType('api')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'api' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              API 통신
            </button>
            <button
              onClick={() => setFilterType('state')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'state'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              전역 상태
            </button>
            <button
              onClick={() => setFilterType('event')}
              className={`px-3 py-1 rounded transition-colors ${
                filterType === 'event'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              커스텀 이벤트
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="결과 검색..."
            className="w-48 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-0.75rem placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-gray-300"
          />
        </div>

        {/* Network Conditions Simulator */}
        <div className="flex items-center gap-6 border-l border-white/5 pl-6">
          <div className="flex items-center gap-4 text-0.75rem text-gray-400">
            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-gray-200">
              <input
                type="checkbox"
                checked={latencySim}
                onChange={handleToggleLatency}
                className="w-3.5 h-3.5 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span>🐌 지연 시뮬레이션 (1.5초)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none hover:text-gray-200">
              <input
                type="checkbox"
                checked={errorSim}
                onChange={handleToggleError}
                className="w-3.5 h-3.5 rounded border-gray-700 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
              />
              <span>❌ 강제 통신 실패(500 에러)</span>
            </label>
          </div>

          {/* Logging Commands */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1 rounded-lg border text-0.75rem font-medium transition-all ${
                isPaused
                  ? 'bg-amber-950/40 text-amber-400 border-amber-800/50 hover:bg-amber-900/40'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
              }`}
            >
              {isPaused ? '▶ 기록 재개' : '⏸ 일시 정지'}
            </button>
            <button
              onClick={handleClearLogs}
              className="px-3 py-1 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/50 text-0.75rem font-medium transition-all"
            >
              로그 비우기
            </button>
          </div>
        </div>
      </div>

      {/* Logger Body (Split View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Log Lists */}
        <div className="w-1/2 border-r border-white/5 flex flex-col overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-0.875rem">
              기록된 로그가 존재하지 않습니다.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {filteredEvents.map((e) => {
                const isSelected = selectedEvent?.id === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => setSelectedEvent(e)}
                    className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-950/20 border-l-2 border-indigo-500'
                        : 'hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Type Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-mono ${getTypeBadge(e.type)}`}
                      >
                        {e.type.toUpperCase()}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded border font-mono ${getStatusBadge(e.status)}`}
                      >
                        {getStatusText(e.status)}
                      </span>

                      {/* Label Description */}
                      <span
                        className="text-0.75rem font-medium text-gray-300 truncate max-w-[280px]"
                        title={e.label}
                      >
                        {e.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                      {e.duration !== undefined && (
                        <span className="text-indigo-400">{e.duration}ms</span>
                      )}
                      <span>{e.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Detailed JSON Inspector */}
        <div className="w-1/2 flex flex-col bg-[#090C16] overflow-hidden">
          {selectedEvent ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0D1222]/30">
                <span className="text-0.75rem font-bold text-indigo-400 font-mono">
                  {selectedEvent.label}
                </span>
                <button
                  onClick={handleCopyJson}
                  className="px-2.5 py-1 text-0.75rem bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-900/50 hover:border-indigo-400 rounded-lg transition-colors font-medium"
                >
                  📋 JSON 복사
                </button>
              </div>

              {/* Pretty print logs */}
              <div className="flex-1 p-4 overflow-y-auto font-mono text-0.75rem leading-relaxed text-gray-300 scrollbar-thin">
                <pre
                  className="bg-black/20 p-4 rounded-xl border border-white/5 select-text overflow-x-auto whitespace-pre-wrap break-all"
                  dangerouslySetInnerHTML={{ __html: syntaxHighlight(selectedEvent.detail) }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 text-0.875rem">
              <span>상세 내역을 조회할 로그를 왼쪽 목록에서 선택해 주세요.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
