interface ConnectionInspectorProps {
  selectedConnection: {
    source: string;
    target: string;
    label: string;
    type?: 'component' | 'function' | 'data';
    dataOut?: string;
    dataIn?: string;
    description: string;
  };
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function ConnectionInspector({
  selectedConnection,
  onClose,
  onNavigate,
}: ConnectionInspectorProps) {
  const { source, target, label, description, dataOut, dataIn } = selectedConnection;
  const sourceName = source.split('/').pop() || source;
  const targetName = target.split('/').pop() || target;

  return (
    <div className="h-[340px] flex flex-col bg-[#0C0F1A]/95 border-t border-indigo-950/80 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 relative z-20 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-[#0A0D17] border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono border border-indigo-900/50">
            연결망 분석 (Connection Path)
          </span>
          <h2 className="text-1rem font-bold text-white tracking-wide">
            {sourceName} ➔ {targetName} 의 연동 관계
          </h2>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
        {/* Left: Role and summary */}
        <div className="flex-1 flex flex-col gap-3 pr-6 border-r border-white/5 justify-center">
          <div>
            <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
              상호작용 역할
            </span>
            <p className="text-0.875rem text-gray-300 leading-relaxed">{description}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div>
              <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
                흐르는 데이터 / 관련 함수
              </span>
              <span
                className={`inline-block px-2 py-1 border text-[11.5px] rounded-lg font-mono font-bold ${
                  selectedConnection.type === 'component'
                    ? 'bg-blue-950/60 border-blue-800/60 text-blue-300'
                    : selectedConnection.type === 'function'
                      ? 'bg-purple-950/60 border-purple-800/60 text-purple-300'
                      : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                }`}
              >
                {selectedConnection.type === 'component'
                  ? '🧩 '
                  : selectedConnection.type === 'function'
                    ? '⚙️ '
                    : '📦 '}
                {label}
              </span>
            </div>

            {/* 송수신 데이터 흐름 시각 가이드 */}
            {(dataOut || dataIn) && (
              <div className="flex-1 min-w-[280px] bg-[#090D16] p-2.5 rounded-xl border border-white/5 flex flex-col gap-2.5 justify-center">
                <span className="text-[10px] text-gray-500 font-semibold block mb-0.5">
                  🔄 송수신 데이터 흐름 (Data Flow)
                </span>
                {dataOut && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] leading-relaxed">
                    <span className="text-gray-400 font-mono font-semibold">{sourceName}</span>
                    <span className="text-emerald-500 font-bold">➔</span>
                    <span className="bg-emerald-950/30 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-mono break-all">
                      {dataOut}
                    </span>
                    <span className="text-emerald-500 font-bold">➔</span>
                    <span className="text-gray-400 font-mono font-semibold">{targetName}</span>
                  </div>
                )}
                {dataIn && dataIn !== '없음' && (
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] leading-relaxed">
                    <span className="text-gray-400 font-mono font-semibold">{sourceName}</span>
                    <span className="text-blue-500 font-bold">◀</span>
                    <span className="bg-blue-950/30 text-blue-400 border border-blue-900/40 px-2 py-0.5 rounded font-mono break-all">
                      {dataIn}
                    </span>
                    <span className="text-blue-500 font-bold">◀</span>
                    <span className="text-gray-400 font-mono font-semibold">{targetName}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Navigation actions */}
        <div className="w-[300px] flex flex-col gap-3 justify-center pl-2">
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
            파일 바로보기
          </span>
          <button
            onClick={() => onNavigate(source)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl transition-all text-0.75rem font-medium flex items-center justify-between px-4"
          >
            <span>출발지: {sourceName}</span>
            <span className="text-indigo-400">명세 검사 ➔</span>
          </button>
          <button
            onClick={() => onNavigate(target)}
            className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl transition-all text-0.75rem font-medium flex items-center justify-between px-4"
          >
            <span>도착지: {targetName}</span>
            <span className="text-indigo-400">명세 검사 ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
