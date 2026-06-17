/**
 * 개발자 콘솔 React 진입점 (dev.tsx)
 *
 * dev.html 파일이 마운트될 때 호출되는 React 독립 엔트리입니다.
 * 사용자 서비스와 완전 격리되어 개발 보조 대시보드를 렌더링합니다.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import DevConsoleApp from './dev-console/DevConsoleApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DevConsoleApp />
  </React.StrictMode>
);
