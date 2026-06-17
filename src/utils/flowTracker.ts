/**
 * 데이터 플로우 트래커 (Flow Tracker)
 *
 * 애플리케이션 내의 API 호출, 전역 상태 변화, 커스텀 이벤트를 중앙에서 수집하여
 * 구독 중인 옵저버(예: Dev Console)에 실시간으로 브로드캐스트합니다.
 * 또한 개발용 API 지연/에러 시뮬레이션 상태를 보관합니다.
 */

export type FlowEventType = 'api' | 'state' | 'event';
export type FlowEventStatus = 'pending' | 'success' | 'error' | 'aborted';

export interface FlowEvent {
  id: string;
  type: FlowEventType;
  status: FlowEventStatus;
  label: string;
  timestamp: string;
  duration?: number; // ms 단위 (API 전용)
  detail: unknown; // 세부 JSON 데이터
}

type FlowTrackerListener = (events: FlowEvent[]) => void;

class FlowTracker {
  private events: FlowEvent[] = [];
  private listeners: Set<FlowTrackerListener> = new Set();
  private maxHistory = 150;

  // 시뮬레이션 옵션 (새로고침 시 영구 보존을 위해 localStorage 활용)
  private _simulateLatency: boolean = localStorage.getItem('flow_sim_latency') === 'true';
  private _simulateError: boolean = localStorage.getItem('flow_sim_error') === 'true';

  get simulateLatency(): boolean {
    return this._simulateLatency;
  }

  set simulateLatency(value: boolean) {
    this._simulateLatency = value;
    localStorage.setItem('flow_sim_latency', String(value));
    this.notifySimulationChange();
  }

  get simulateError(): boolean {
    return this._simulateError;
  }

  set simulateError(value: boolean) {
    this._simulateError = value;
    localStorage.setItem('flow_sim_error', String(value));
    this.notifySimulationChange();
  }

  private notifySimulationChange() {
    this.logCustom('SIMULATOR', {
      message: '시뮬레이션 모드 변경됨',
      latencySimulated: this._simulateLatency,
      errorSimulated: this._simulateError,
    });
  }

  // 리스너 구독
  subscribe(listener: FlowTrackerListener): () => void {
    this.listeners.add(listener);
    // 현재 보관 중인 로그 즉시 전달
    listener([...this.events]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copiedEvents = [...this.events];
    this.listeners.forEach((listener) => listener(copiedEvents));
  }

  // 로그 초기화
  clearLogs() {
    this.events = [];
    this.notify();
  }

  // 이벤트 기록 내부 헬퍼
  private addEvent(event: FlowEvent) {
    this.events.unshift(event); // 최신 이벤트가 앞으로 오게 정렬
    if (this.events.length > this.maxHistory) {
      this.events = this.events.slice(0, this.maxHistory);
    }
    this.notify();
  }

  // ==========================================
  // 1. API 호출 트래킹 API
  // ==========================================

  logApiStart(id: string, method: string, url: string, payload?: unknown): void {
    this.addEvent({
      id,
      type: 'api',
      status: 'pending',
      label: `${method} ${url}`,
      timestamp: new Date().toLocaleTimeString(),
      detail: {
        method,
        url,
        requestPayload: payload || null,
        startedAt: new Date().toISOString(),
      },
    });
  }

  logApiSuccess(id: string, status: number, responseData: unknown, duration: number): void {
    const existing = this.events.find((e) => e.id === id);
    const existingDetail =
      existing && typeof existing.detail === 'object' && existing.detail !== null
        ? (existing.detail as Record<string, unknown>)
        : {};

    this.updateEvent(id, {
      status: 'success',
      duration,
      detail: {
        ...existingDetail,
        status,
        response: responseData,
        durationMs: duration,
        endedAt: new Date().toISOString(),
      },
    });
  }

  logApiFailure(id: string, errorMsg: string, duration: number, status = 500): void {
    const existing = this.events.find((e) => e.id === id);
    const existingDetail =
      existing && typeof existing.detail === 'object' && existing.detail !== null
        ? (existing.detail as Record<string, unknown>)
        : {};

    this.updateEvent(id, {
      status: 'error',
      duration,
      detail: {
        ...existingDetail,
        status,
        error: errorMsg,
        durationMs: duration,
        endedAt: new Date().toISOString(),
      },
    });
  }

  logApiAbort(id: string, duration: number): void {
    const existing = this.events.find((e) => e.id === id);
    const existingDetail =
      existing && typeof existing.detail === 'object' && existing.detail !== null
        ? (existing.detail as Record<string, unknown>)
        : {};

    this.updateEvent(id, {
      status: 'aborted',
      duration,
      detail: {
        ...existingDetail,
        status: 'Aborted',
        message: 'AbortController에 의해 요청 취소됨',
        durationMs: duration,
        endedAt: new Date().toISOString(),
      },
    });
  }

  private updateEvent(id: string, updates: Partial<FlowEvent>) {
    const index = this.events.findIndex((e) => e.id === id);
    if (index !== -1) {
      this.events[index] = {
        ...this.events[index],
        ...updates,
      };
      this.notify();
    }
  }

  // ==========================================
  // 2. 스토어 상태 변경 트래킹 API
  // ==========================================

  logStateChange(
    storeName: string,
    actionName: string,
    prevState: unknown,
    nextState: unknown
  ): void {
    const id = `state-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.addEvent({
      id,
      type: 'state',
      status: 'success',
      label: `[${storeName}] ${actionName}`,
      timestamp: new Date().toLocaleTimeString(),
      detail: {
        store: storeName,
        action: actionName,
        previousState: prevState,
        nextState: nextState,
        diff: this.getObjectDiff(prevState, nextState),
      },
    });
  }

  // ==========================================
  // 3. 커스텀 이벤트 로그 기록 API
  // ==========================================

  logCustom(label: string, payload: unknown): void {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.addEvent({
      id,
      type: 'event',
      status: 'success',
      label,
      timestamp: new Date().toLocaleTimeString(),
      detail: payload,
    });
  }

  // 두 객체 간의 얕은 차이 분석 헬퍼
  private getObjectDiff(
    prev: unknown,
    next: unknown
  ): Record<string, { from: unknown; to: unknown }> {
    if (typeof prev !== 'object' || typeof next !== 'object' || prev === null || next === null) {
      return {};
    }

    const prevObj = prev as Record<string, unknown>;
    const nextObj = next as Record<string, unknown>;
    const diff: Record<string, { from: unknown; to: unknown }> = {};
    const allKeys = new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]);

    for (const key of allKeys) {
      if (prevObj[key] !== nextObj[key]) {
        diff[key] = {
          from: prevObj[key],
          to: nextObj[key],
        };
      }
    }
    return diff;
  }
}

export const flowTracker = new FlowTracker();
