/**
 * 데모용 전역 상태 저장소 (Demo Store)
 *
 * createStore를 사용하여 생성한 예시 스토어로,
 * 카운터, 유저 프로필 정보, 일반 설정을 관리하며
 * 모든 상태 변경 행위(Action)는 Flow Console에 자동 기록됩니다.
 */

import { createStore } from './createStore';

export interface DemoState {
  counter: number;
  user: {
    name: string;
    email: string;
    isLoggedIn: boolean;
  };
  settings: {
    theme: 'light' | 'dark';
    allowNotifications: boolean;
  };
}

const initialState: DemoState = {
  counter: 0,
  user: {
    name: '방문자',
    email: 'visitor@example.com',
    isLoggedIn: false,
  },
  settings: {
    theme: 'light',
    allowNotifications: true,
  },
};

export const demoStore = createStore<DemoState>('DemoStore', initialState);

// ==========================================
// 스토어 액션 (Actions) - 명시적 액션명을 기입하여 로깅
// ==========================================

export const demoActions = {
  increment: () => {
    demoStore.setState((state) => ({ counter: state.counter + 1 }), 'COUNTER_INCREMENT');
  },

  decrement: () => {
    demoStore.setState((state) => ({ counter: state.counter - 1 }), 'COUNTER_DECREMENT');
  },

  login: (name: string, email: string) => {
    demoStore.setState(
      {
        user: { name, email, isLoggedIn: true },
      },
      'USER_LOGIN'
    );
  },

  logout: () => {
    demoStore.setState(
      {
        user: { name: '방문자', email: 'visitor@example.com', isLoggedIn: false },
      },
      'USER_LOGOUT'
    );
  },

  toggleTheme: () => {
    demoStore.setState(
      (state) => ({
        settings: {
          ...state.settings,
          theme: state.settings.theme === 'light' ? 'dark' : 'light',
        },
      }),
      'TOGGLE_THEME'
    );
  },

  toggleNotifications: () => {
    demoStore.setState(
      (state) => ({
        settings: {
          ...state.settings,
          allowNotifications: !state.settings.allowNotifications,
        },
      }),
      'TOGGLE_NOTIFICATIONS'
    );
  },

  reset: () => {
    demoStore.setState(initialState, 'RESET_STORE');
  },
};
