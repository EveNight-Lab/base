/**
 * 개발자 대시보드 메인 레이아웃 (DevConsoleApp.tsx)
 *
 * 프리미엄 스페이스 다크(Space Dark) 스타일의 테마가 가미된 관리용 UI 프레임워크입니다.
 * 아키텍처 노드 맵, 실시간 데이터 트래커, 문서 탐색 등 3가지 핵심 탭을 제공합니다.
 */

import { useState } from 'react';
import TopologyMap from './components/TopologyMap';
import FlowMonitor from './components/FlowMonitor';
import DocsViewer from './components/DocsViewer';

type DevTab = 'topology' | 'flow' | 'docs';

export default function DevConsoleApp() {
  const [activeTab, setActiveTab] = useState<DevTab>('topology');

  return (
    <div className="w-screen h-screen flex flex-col bg-[#080B13] text-gray-100 font-sans overflow-hidden">
      {/* Gimmick: Subtle Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[180px] pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0E1A]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
          <h1 className="text-1.25rem font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
            BASE Front-End Developer Workspace
          </h1>
          <span className="text-0.75rem px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-mono">
            V1.0.0 (Dev Mode)
          </span>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveTab('topology')}
            className={`flex items-center gap-2 px-4 py-2 text-0.875rem font-medium rounded-lg transition-all duration-300 ${
              activeTab === 'topology'
                ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📖</span> 아키텍처 노드 맵
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-4 py-2 text-0.875rem font-medium rounded-lg transition-all duration-300 ${
              activeTab === 'flow'
                ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>⚡</span> 실시간 데이터 흐름
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 px-4 py-2 text-0.875rem font-medium rounded-lg transition-all duration-300 ${
              activeTab === 'docs'
                ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📚</span> 설계 가이드북
          </button>
        </div>

        {/* Shortcut Info */}
        <div className="flex items-center gap-4 text-0.875rem text-gray-400 font-mono">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 border-b border-indigo-400/20 hover:border-indigo-300 transition-colors"
          >
            일반 화면 바로가기 ↗
          </a>
        </div>
      </header>

      {/* Main View Container */}
      <main className="flex-1 relative overflow-hidden bg-[#07090F]/45">
        <div className={`w-full h-full ${activeTab === 'topology' ? 'block' : 'hidden'}`}>
          <TopologyMap />
        </div>
        <div className={`w-full h-full ${activeTab === 'flow' ? 'block' : 'hidden'}`}>
          <FlowMonitor />
        </div>
        <div className={`w-full h-full ${activeTab === 'docs' ? 'block' : 'hidden'}`}>
          <DocsViewer />
        </div>
      </main>
    </div>
  );
}
