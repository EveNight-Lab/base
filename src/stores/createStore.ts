/**
 * 경량 상태 스토어 생성기 (createStore)
 *
 * React 19의 useSyncExternalStore를 활용하여 외부 상태 소스를 구독하고,
 * 컴포넌트 렌더링 최적화를 위한 셀렉터(Selector) 기능을 제공합니다.
 * 상태 변경 시 flowTracker에 이전 상태와 새 상태를 자동으로 로깅하여 추적을 용이하게 합니다.
 */

import { useSyncExternalStore } from 'react';
import { flowTracker } from '../utils/flowTracker';

export interface Store<T> {
  getState: () => T;
  setState: (nextStateOrFn: Partial<T> | ((state: T) => Partial<T>), actionName?: string) => void;
  subscribe: (listener: () => void) => () => void;
  useStore: <SelectorOutput = T>(selector?: (state: T) => SelectorOutput) => SelectorOutput;
}

export function createStore<T extends object>(storeName: string, initialState: T): Store<T> {
  let state = { ...initialState };
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (
    nextStateOrFn: Partial<T> | ((state: T) => Partial<T>),
    actionName = 'SET_STATE'
  ) => {
    const prevState = { ...state };

    const nextPartial = typeof nextStateOrFn === 'function' ? nextStateOrFn(state) : nextStateOrFn;

    state = { ...state, ...nextPartial };

    // 변경된 상태를 flowTracker에 기록
    flowTracker.logStateChange(storeName, actionName, prevState, state);

    // 구독자들에게 이벤트 전파
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  // React 훅 형태로 외부 상태를 읽을 수 있도록 지원
  function useStore<SelectorOutput = T>(
    selector: (state: T) => SelectorOutput = (s) => s as unknown as SelectorOutput
  ): SelectorOutput {
    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(initialState) // SSR 및 초기화 시 활용할 fallback
    );
  }

  return {
    getState,
    setState,
    subscribe,
    useStore,
  };
}
