interface MapControlPanelProps {
  onReset: () => void;
}

export default function MapControlPanel({ onReset }: MapControlPanelProps) {
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className="absolute top-4 right-4 z-20 flex flex-col gap-3.5 p-4 rounded-xl border border-white/5 bg-[#0D1222]/85 backdrop-blur-md shadow-2xl max-w-[240px]"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-0.875rem font-bold text-gray-200">아키텍처 맵 도구</span>
        <button
          onClick={onReset}
          className="px-2.5 py-1 text-[11px] font-medium bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-900/50 rounded-lg transition-colors"
        >
          배치 초기화
        </button>
      </div>

      {/* 파일 종류 색상 범례 */}
      <div className="border-t border-white/5 pt-3 flex flex-col gap-1.5 text-xs text-gray-400">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          🎨 파일 역할별 색상
        </span>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[10.5px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>시작 진입점</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span>라우터 채널</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
            <span>화면 골격</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            <span>UI 부품</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>독립 화면</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
            <span>데이터 스토어</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>커스텀 훅</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            <span>공통 유틸</span>
          </div>
        </div>
      </div>

      {/* 3대 아키텍처 분류 뱃지 범례 */}
      <div className="border-t border-white/5 pt-3 flex flex-col gap-2 text-xs text-gray-400">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
          🏷️ 아키텍처 3대 분류
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[8px] px-1 py-0.5 rounded border bg-indigo-950/50 text-indigo-300 border-indigo-800/40 font-bold whitespace-nowrap">
              🎛️ 상호작용 / 조율
            </span>
            <span className="text-[9.5px] text-gray-500 leading-none">
              전체 흐름을 제어하는 조율 파일
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] px-1 py-0.5 rounded border bg-emerald-950/50 text-emerald-300 border-emerald-800/40 font-bold whitespace-nowrap">
              ♻️ 공통 / 재사용
            </span>
            <span className="text-[9.5px] text-gray-500 leading-none">
              범용 재사용되는 공통 모듈
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[8px] px-1 py-0.5 rounded border bg-slate-900/60 text-slate-400 border-slate-700/40 font-bold whitespace-nowrap">
              🔒 특정 파일 전용
            </span>
            <span className="text-[9.5px] text-gray-500 leading-none">
              부모 전용으로 격리된 내부 파일
            </span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-gray-500 leading-normal border-t border-white/5 pt-2.5">
        * 파일 카드를 자유롭게 드래그하여 배치할 수 있으며, 마우스를 올리거나 클릭하면 연결 데이터
        흐름이 부각됩니다.
      </div>
    </div>
  );
}
