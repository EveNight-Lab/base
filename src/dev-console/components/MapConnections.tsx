import type { FileMeta } from '../architectureDb';
import { getConnectionMeta, getConnectionDescription } from '../utils/connectionMeta';

interface ConnectionInfo {
  source: string;
  target: string;
  label: string;
  type?: 'component' | 'function' | 'data';
  dataOut?: string;
  dataIn?: string;
  description: string;
}

interface MapConnectionsProps {
  nodes: Record<string, FileMeta>;
  positions: Record<string, { x: number; y: number }>;
  nodeWidth: number;
  nodeHeight: number;
  selectedPath: string | null;
  hoveredPath: string | null;
  selectedConnection: ConnectionInfo | null;
  onSelectConnection: (conn: ConnectionInfo | null) => void;
  onHoverConnection: (conn: ConnectionInfo | null) => void;
  onSelectPath: (path: string | null) => void;
}

export default function MapConnections({
  nodes,
  positions,
  nodeWidth,
  nodeHeight,
  selectedPath,
  hoveredPath,
  selectedConnection,
  onSelectConnection,
  onHoverConnection,
  onSelectPath,
}: MapConnectionsProps) {
  const paths: React.ReactNode[] = [];

  Object.values(nodes).forEach((node) => {
    const sourcePos = positions[node.path];
    if (!sourcePos) return;

    node.dependencies.forEach((depPath, idx) => {
      const targetNode = nodes[depPath];
      const targetPos = positions[depPath];
      if (!targetNode || !targetPos) return;

      // 노드의 중앙점 연산
      const x1 = sourcePos.x + nodeWidth / 2;
      const y1 = sourcePos.y + nodeHeight / 2;
      const x2 = targetPos.x + nodeWidth / 2;
      const y2 = targetPos.y + nodeHeight / 2;

      // 베지에 곡선 중간 제어점 연산
      const dx = x2 - x1;
      const dy = y2 - y1;
      const cx1 = x1 + dx * 0.4;
      const cy1 = y1 + dy * 0.1;
      const cx2 = x1 + dx * 0.6;
      const cy2 = y2 - dy * 0.1;

      const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

      // 곡선상의 정확한 1/2 지점(중앙점) 연산 (베지에 공식 t = 0.5 적용)
      const mx = 0.125 * x1 + 0.375 * cx1 + 0.375 * cx2 + 0.125 * x2;
      const my = 0.125 * y1 + 0.375 * cy1 + 0.375 * cy2 + 0.125 * y2;

      // 해당 노드 관련 호버 또는 선택 시 하이라이트 여부 결정
      const isHighlighted =
        selectedPath === node.path ||
        selectedPath === depPath ||
        hoveredPath === node.path ||
        hoveredPath === depPath ||
        (selectedConnection &&
          selectedConnection.source === node.path &&
          selectedConnection.target === depPath);

      const strokeColor = isHighlighted ? '#6366F1' : '#312E81';
      const strokeWidth = isHighlighted ? 2.5 : 1.2;
      const glowFilter = isHighlighted ? 'url(#glow)' : undefined;

      const connMeta = getConnectionMeta(node.path, depPath);

      paths.push(
        <g key={`${node.path}-${depPath}-${idx}`}>
          {/* 배경 광원 라인 (선택 시에만) */}
          {isHighlighted && (
            <path
              d={pathData}
              fill="none"
              stroke="#4F46E5"
              strokeWidth={5}
              strokeOpacity={0.2}
              filter={glowFilter}
            />
          )}

          {/* 기본 연결 베지에 커브 선 */}
          <path
            d={pathData}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            className="transition-colors duration-300 pointer-events-auto cursor-pointer"
            onMouseEnter={() => {
              if (connMeta) {
                onHoverConnection({
                  source: node.path,
                  target: depPath,
                  label: connMeta.label,
                  type: connMeta.type,
                  dataOut: connMeta.dataOut,
                  dataIn: connMeta.dataIn,
                  description: getConnectionDescription(node.path, depPath),
                });
              }
            }}
            onMouseLeave={() => {
              onHoverConnection(null);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (connMeta) {
                onSelectConnection({
                  source: node.path,
                  target: depPath,
                  label: connMeta.label,
                  type: connMeta.type,
                  dataOut: connMeta.dataOut,
                  dataIn: connMeta.dataIn,
                  description: getConnectionDescription(node.path, depPath),
                });
                onSelectPath(null); // 파일 노드 선택 상태는 해제
              }
            }}
          />

          {/* 움직이는 흐름 점선 애니메이션 */}
          {isHighlighted && (
            <path
              d={pathData}
              fill="none"
              stroke="#818CF8"
              strokeWidth={1.5}
              strokeDasharray="6, 5"
              className="flow-line pointer-events-none"
              style={{
                animation: 'flowAnimation 1.2s linear infinite',
              }}
            />
          )}

          {/* 데이터 흐름 / 연결 기능 라벨 */}
          {connMeta && (
            <foreignObject
              x={mx - 90}
              y={my - 12}
              width={180}
              height={24}
              className="pointer-events-auto cursor-pointer"
            >
              <div
                onMouseEnter={() => {
                  onHoverConnection({
                    source: node.path,
                    target: depPath,
                    label: connMeta.label,
                    type: connMeta.type,
                    dataOut: connMeta.dataOut,
                    dataIn: connMeta.dataIn,
                    description: getConnectionDescription(node.path, depPath),
                  });
                }}
                onMouseLeave={() => {
                  onHoverConnection(null);
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onSelectConnection({
                    source: node.path,
                    target: depPath,
                    label: connMeta.label,
                    type: connMeta.type,
                    dataOut: connMeta.dataOut,
                    dataIn: connMeta.dataIn,
                    description: getConnectionDescription(node.path, depPath),
                  });
                  onSelectPath(null); // 파일 노드 선택 상태는 해제
                }}
                className="flex items-center justify-center w-full h-full"
              >
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-semibold border rounded shadow-md transition-all duration-300 ${
                    isHighlighted
                      ? connMeta.type === 'component'
                        ? 'bg-blue-600 border-blue-400 text-white font-bold scale-[1.05] shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                        : connMeta.type === 'function'
                          ? 'bg-purple-600 border-purple-400 text-white font-bold scale-[1.05] shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                          : 'bg-emerald-600 border-emerald-400 text-white font-bold scale-[1.05] shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : connMeta.type === 'component'
                        ? 'bg-[#0B1528]/95 border-blue-900/60 text-blue-300'
                        : connMeta.type === 'function'
                          ? 'bg-[#120D25]/95 border-purple-900/60 text-purple-300'
                          : 'bg-[#09151B]/95 border-emerald-900/60 text-emerald-300'
                  }`}
                >
                  {connMeta.type === 'component'
                    ? '🧩 '
                    : connMeta.type === 'function'
                      ? '⚙️ '
                      : '📦 '}
                  {connMeta.label}
                </span>
              </div>
            </foreignObject>
          )}
        </g>
      );
    });
  });

  return <>{paths}</>;
}
