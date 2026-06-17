import type { FileMeta } from '../architectureDb';
import { getFileCategory } from '../utils/connectionMeta';

interface MapNodeCardProps {
  path: string;
  node: FileMeta;
  pos: { x: number; y: number };
  isSelected: boolean;
  koreanType: string;
  nodeWidth: number;
  nodeHeight: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const getTypeStyles = (type: string) => {
  switch (type) {
    case 'entry':
      return 'border-rose-500 bg-rose-950/30 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.12)]';
    case 'router':
      return 'border-amber-500 bg-amber-950/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.12)]';
    case 'layout':
      return 'border-cyan-500 bg-cyan-950/30 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.12)]';
    case 'component':
      return 'border-blue-500 bg-blue-950/30 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.12)]';
    case 'page':
      return 'border-emerald-500 bg-emerald-950/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.12)]';
    case 'hook':
      return 'border-purple-500 bg-purple-950/30 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.12)]';
    case 'store':
      return 'border-yellow-500 bg-yellow-950/30 text-yellow-200 shadow-[0_0_15px_rgba(234,179,8,0.12)]';
    case 'utility':
      return 'border-indigo-500 bg-indigo-950/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.12)]';
    default:
      return 'border-gray-600 bg-gray-900/60 text-gray-300';
  }
};

export default function MapNodeCard({
  path,
  node,
  pos,
  isSelected,
  koreanType,
  nodeWidth,
  nodeHeight,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: MapNodeCardProps) {
  const catInfo = getFileCategory(path);
  const typeStyleClass = getTypeStyles(node.type);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'absolute',
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        cursor: 'grab',
      }}
      className={`flex flex-col justify-between p-2.5 border rounded-xl backdrop-blur-sm select-none transition-all duration-150 z-10 ${typeStyleClass} ${
        isSelected
          ? 'ring-2 ring-indigo-400 scale-[1.03] shadow-[0_0_25px_rgba(99,102,241,0.3)] z-30 border-white/20'
          : 'hover:scale-[1.01] hover:border-white/10'
      }`}
    >
      {/* Header: Name & Type */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[11.5px] font-bold tracking-wide truncate w-full" title={node.name}>
            {node.name}
          </span>
          {/* 3대 아키텍처 분류 뱃지 */}
          <span
            className={`text-[7.5px] font-bold mt-1 px-1.5 py-0.5 rounded border w-max leading-none ${
              catInfo.type === 'orchestrator'
                ? 'bg-indigo-950/50 text-indigo-300 border-indigo-800/40'
                : catInfo.type === 'shared'
                  ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40'
                  : 'bg-slate-900/60 text-slate-400 border-slate-700/40'
            }`}
          >
            {catInfo.label}
          </span>
        </div>
        <span className="text-[9px] px-1 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5 whitespace-nowrap">
          {koreanType}
        </span>
      </div>

      {/* Footer: Dependencies indicator */}
      <div className="flex justify-between items-center text-[9px] text-gray-400 border-t border-white/5 pt-1 font-mono">
        <span>의존성 {node.dependencies.length}개</span>
        <span className="truncate max-w-[80px]" title={path}>
          {path.replace('src/', '')}
        </span>
      </div>
    </div>
  );
}
