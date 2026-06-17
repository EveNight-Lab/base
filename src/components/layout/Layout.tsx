/**
 * 레이아웃 컴포넌트
 * 모든 페이지에 공통으로 적용되는 레이아웃
 */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const isDev = import.meta.env.DEV;

  const handleOpenConsole = () => {
    window.open('/dev.html', '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* 개발 전용 콘솔 플로팅 단축 버튼 */}
      {isDev && (
        <button
          onClick={handleOpenConsole}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-0.875rem font-medium shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.6)] hover:scale-105 border border-white/10 active:scale-95 transition-all duration-300 group"
          title="Vite 다중 페이지 개발자 콘솔 열기"
        >
          <span className="animate-spin group-hover:animate-none">⚙️</span>
          <span>개발자 콘솔 열기</span>
        </button>
      )}
    </div>
  );
}
