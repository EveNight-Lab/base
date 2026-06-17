import { useState, useEffect, useRef } from 'react';
import type { FileMeta } from '../architectureDb';
import DetailOverlay from './DetailOverlay';

interface FileInspectorProps {
  selectedFile: FileMeta;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function FileInspector({ selectedFile, onClose, onNavigate }: FileInspectorProps) {
  const [comment, setComment] = useState(() => {
    return localStorage.getItem(`node_memo_${selectedFile.path}`) || '';
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [selectedDetail, setSelectedDetail] = useState<{
    name: string;
    description: string;
    type: '받는 데이터 [In]' | '보내는 데이터 [Out]' | '핵심 함수';
  } | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 메모 저장 핸들러
  const handleCommentChange = (text: string) => {
    setComment(text);
    localStorage.setItem(`node_memo_${selectedFile.path}`, text);
    setSaveStatus('saved');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSaveStatus('idle');
    }, 1000);
  };

  return (
    <div className="h-[340px] flex flex-col bg-[#0C0F1A]/95 border-t border-indigo-950/80 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-20 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#0A0D17] border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-0.75rem px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-900/50">
            {selectedFile.path}
          </span>
          <h2 className="text-1rem font-bold text-white tracking-wide">
            {selectedFile.name} 의 스펙 분석서
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          ✕
        </button>
      </div>

      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 p-6 overflow-y-auto">
        {/* Column 1: 역할 및 데이터 송수신 */}
        <div className="flex flex-col gap-3.5 border-r border-white/5 pr-6">
          <div>
            <h3 className="text-0.875rem font-semibold text-indigo-400 mb-1.5 flex items-center gap-1.5">
              <span>🎯</span> 어떤 역할을 하나요?
            </h3>
            <p className="text-0.875rem text-gray-300 leading-relaxed">{selectedFile.role}</p>
          </div>

          <div className="mt-2 flex-1">
            <h3 className="text-0.875rem font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
              <span>🔄</span> 데이터 송수신 흐름
            </h3>
            <div className="flex flex-col gap-2 text-0.75rem">
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-emerald-400 font-medium whitespace-nowrap bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/50">
                  받는 데이터 [In]
                </span>
                {selectedFile.inputs.length === 0 ? (
                  <span className="text-gray-500">없음</span>
                ) : (
                  selectedFile.inputs.map((inp, idx) => (
                    <span
                      key={idx}
                      onClick={() =>
                        setSelectedDetail({
                          name: inp.name,
                          description: inp.description,
                          type: '받는 데이터 [In]',
                        })
                      }
                      className="bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-900/40 hover:border-emerald-600/50 text-emerald-300 px-2 py-0.5 rounded cursor-pointer transition-all active:scale-95 font-medium"
                      title="클릭하여 상세 정보 표시"
                    >
                      📦 {inp.name}
                    </span>
                  ))
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1 mt-1">
                <span className="text-rose-400 font-medium whitespace-nowrap bg-rose-950/30 px-1.5 py-0.5 rounded border border-rose-900/50">
                  보내는 데이터 [Out]
                </span>
                {selectedFile.outputs.length === 0 ? (
                  <span className="text-gray-500">없음</span>
                ) : (
                  selectedFile.outputs.map((out, idx) => (
                    <span
                      key={idx}
                      onClick={() =>
                        setSelectedDetail({
                          name: out.name,
                          description: out.description,
                          type: '보내는 데이터 [Out]',
                        })
                      }
                      className="bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 hover:border-rose-600/50 text-rose-300 px-2 py-0.5 rounded cursor-pointer transition-all active:scale-95 font-medium"
                      title="클릭하여 상세 정보 표시"
                    >
                      📦 {out.name}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: 핵심 함수 해설 */}
        <div className="flex flex-col border-r border-white/5 pr-6 overflow-y-auto">
          <h3 className="text-0.875rem font-semibold text-indigo-400 mb-2.5 flex items-center gap-1.5">
            <span>⚙️</span> 핵심 함수 사전
          </h3>
          {selectedFile.functions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-0.75rem text-gray-500 border border-white/[0.02] bg-white/[0.01] rounded-xl p-4">
              이 파일은 전역 변수, 정적 스타일, 혹은 단순 마크업 화면이며 자체 노출하는 전용 함수가
              존재하지 않습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin">
              {selectedFile.functions.map((fn, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    setSelectedDetail({
                      name: `${fn.name}(${fn.parameters || ''})`,
                      description: `${fn.role}${fn.returns ? ` (반환값: ${fn.returns})` : ''}`,
                      type: '핵심 함수',
                    })
                  }
                  className="bg-[#121624] hover:bg-[#181E31] border border-white/[0.04] hover:border-indigo-500/30 p-2 rounded-xl cursor-pointer transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-mono text-0.75rem font-bold text-indigo-300">
                      ⚙️ {fn.name}()
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1 truncate">{fn.role}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 3: 의존망 점프 및 나만의 주석 */}
        <div className="flex flex-col gap-3.5">
          {/* Dependencies jumpers */}
          <div>
            <h3 className="text-0.875rem font-semibold text-indigo-400 mb-2 flex items-center gap-1.5">
              <span>🔗</span> 연결된 다른 파일
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedFile.dependencies.length === 0 ? (
                <span className="text-0.75rem text-gray-500">외존 의존성 없음</span>
              ) : (
                selectedFile.dependencies.map((dep, idx) => {
                  const filename = dep.split('/').pop() || dep;
                  return (
                    <button
                      key={idx}
                      onClick={() => onNavigate(dep)}
                      className="px-2 py-0.5 text-[11px] bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-900/50 hover:border-indigo-400 rounded transition-all font-mono animate-pulse-subtle"
                    >
                      {filename} ↗
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* User Custom Comment */}
          <div className="flex-1 flex flex-col mt-1">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-0.875rem font-semibold text-indigo-400 flex items-center gap-1.5">
                <span>📝</span> 나만의 개발 노트 (학습 메모)
              </h3>
              {saveStatus === 'saved' && (
                <span className="text-[10px] text-emerald-400 animate-pulse">자동 저장됨...</span>
              )}
            </div>
            <textarea
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="이 파일의 흐름을 분석하며 기억하고 싶은 나만의 설명이나 메모를 기록하세요. 자동 저장됩니다."
              className="flex-1 w-full p-2.5 text-0.75rem bg-[#090C16] border border-white/10 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* 세부 항목 정보 오버레이 팝업 */}
      {selectedDetail && (
        <DetailOverlay detail={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}
    </div>
  );
}
