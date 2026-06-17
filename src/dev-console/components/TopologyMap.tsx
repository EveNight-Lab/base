import React, { useState, useRef, useEffect } from 'react';
import { architectureDb } from '../architectureDb';
import type { FileMeta } from '../architectureDb';
import InspectorPanel from './InspectorPanel';
import MapControlPanel from './MapControlPanel';
import MapNodeCard from './MapNodeCard';
import MapConnections from './MapConnections';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

interface ConnectionInfo {
  source: string;
  target: string;
  label: string;
  type?: 'component' | 'function' | 'data';
  dataOut?: string;
  dataIn?: string;
  description: string;
}

export default function TopologyMap() {
  const nodes = Object.fromEntries(
    Object.entries(architectureDb).filter(([, node]) => node.type !== 'dev')
  );
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const loadedPos: Record<string, { x: number; y: number }> = {};
    Object.keys(nodes).forEach((path) => {
      const cached = localStorage.getItem(`node_pos_${path}`);
      if (cached) {
        try {
          loadedPos[path] = JSON.parse(cached) as { x: number; y: number };
        } catch {
          loadedPos[path] = { ...nodes[path].defaultPos };
        }
      } else {
        loadedPos[path] = { ...nodes[path].defaultPos };
      }
    });
    return loadedPos;
  });
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<ConnectionInfo | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<ConnectionInfo | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1.5. 캔버스 무한 확장 연산 (가장 외곽에 있는 노드 좌표에 맞춰 캔버스 크기를 동적으로 확장)
  const maxX = Object.values(positions).reduce((max, pos) => Math.max(max, pos.x), 0);
  const maxY = Object.values(positions).reduce((max, pos) => Math.max(max, pos.y), 0);
  const canvasWidth = Math.max(1250, maxX + NODE_WIDTH + 150);
  const canvasHeight = Math.max(980, maxY + NODE_HEIGHT + 150);
  const draggingNodeRef = useRef<{
    path: string;
    startX: number;
    startY: number;
    nodeX: number;
    nodeY: number;
  } | null>(null);

  // 2. 드래그 이동 핸들러
  const handleMouseDown = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return; // 좌클릭만 허용

    setSelectedConnection(null); // 노드 선택 시 연결 선택 초기화
    const pos = positions[path] || { x: 0, y: 0 };
    draggingNodeRef.current = {
      path,
      startX: e.clientX,
      startY: e.clientY,
      nodeX: pos.x,
      nodeY: pos.y,
    };

    setSelectedPath(path);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingNodeRef.current) return;
    const { path, startX, startY, nodeX, nodeY } = draggingNodeRef.current;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // 좌/상단 최소 여백 10px 유지, 우/하단은 노드 드래그에 따라 무한히 캔버스가 확장되도록 제한 해제
    const nextX = Math.max(10, nodeX + dx);
    const nextY = Math.max(10, nodeY + dy);

    setPositions((prev) => ({
      ...prev,
      [path]: { x: nextX, y: nextY },
    }));
  };

  const handleMouseUp = () => {
    if (draggingNodeRef.current) {
      const { path } = draggingNodeRef.current;
      const finalPos = positions[path];
      if (finalPos) {
        localStorage.setItem(`node_pos_${path}`, JSON.stringify(finalPos));
      }
    }
    draggingNodeRef.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };

  // 3. 레이아웃 리셋 / 자동 격자 배치
  const handleReset = () => {
    const defaultPos: Record<string, { x: number; y: number }> = {};
    Object.keys(nodes).forEach((path) => {
      localStorage.removeItem(`node_pos_${path}`);
      defaultPos[path] = { ...nodes[path].defaultPos };
    });
    setPositions(defaultPos);
    setSelectedPath(null);
  };

  const getTypeKorean = (type: FileMeta['type']) => {
    switch (type) {
      case 'entry':
        return '시작점';
      case 'router':
        return '라우터';
      case 'layout':
        return '레이아웃';
      case 'component':
        return '컴포넌트';
      case 'page':
        return '페이지';
      case 'store':
        return '스토어';
      case 'hook':
        return '커스텀 훅';
      case 'utility':
        return '유틸리티';
      case 'style':
        return '스타일';
      case 'dev':
        return '콘솔 관리';
      default:
        return '파일';
    }
  };

  // 4.7. 현재 열려있는 패널의 뷰어 콘텐츠를 결정 (호버 중인 경우 호버 임시 미리보기 제공)
  const isPanelOpen = selectedPath !== null || selectedConnection !== null;
  let displayedFile: FileMeta | null = null;
  let displayedConnection: ConnectionInfo | null = null;

  if (isPanelOpen) {
    if (hoveredPath && nodes[hoveredPath]) {
      displayedFile = nodes[hoveredPath];
      displayedConnection = null;
    } else if (hoveredConnection) {
      displayedConnection = hoveredConnection;
      displayedFile = null;
    } else {
      displayedFile = selectedPath ? nodes[selectedPath] : null;
      displayedConnection = selectedConnection;
    }
  }

  // Cleanup events on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative bg-[#070A14] select-none">
      {/* CSS Animation injection */}
      <style>{`
        @keyframes flowAnimation {
          to {
            stroke-dashoffset: -22;
          }
        }
        .flow-line {
          filter: drop-shadow(0 0 3px rgba(129, 140, 248, 0.8));
        }
      `}</style>

      {/* Control Panel (Floating Left) */}
      <MapControlPanel onReset={handleReset} />

      {/* Infinite Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={() => {
          setSelectedPath(null);
          setSelectedConnection(null);
        }}
        className="flex-1 overflow-auto relative p-6 scrollbar-thin scrollbar-thumb-white/10"
      >
        <div
          style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
          className="relative bg-[#090C16]/20 rounded-2xl border border-white/[0.02]"
        >
          {/* Connection Lines Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <MapConnections
              nodes={nodes}
              positions={positions}
              nodeWidth={NODE_WIDTH}
              nodeHeight={NODE_HEIGHT}
              selectedPath={selectedPath}
              hoveredPath={hoveredPath}
              selectedConnection={selectedConnection}
              onSelectConnection={setSelectedConnection}
              onHoverConnection={setHoveredConnection}
              onSelectPath={setSelectedPath}
            />
          </svg>

          {/* Draggable Node Cards Layer */}
          {Object.entries(nodes).map(([path, node]) => {
            const pos = positions[path] || { x: 0, y: 0 };
            const isSelected = selectedPath === path;
            const koreanType = getTypeKorean(node.type);

            return (
              <MapNodeCard
                key={path}
                path={path}
                node={node}
                pos={pos}
                isSelected={isSelected}
                koreanType={koreanType}
                nodeWidth={NODE_WIDTH}
                nodeHeight={NODE_HEIGHT}
                onMouseDown={(e) => handleMouseDown(path, e)}
                onMouseEnter={() => setHoveredPath(path)}
                onMouseLeave={() => setHoveredPath(null)}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Inspector Panel */}
      <div onMouseDown={(e) => e.stopPropagation()} className="relative z-20">
        <InspectorPanel
          key={
            displayedFile
              ? `file-${displayedFile.path}`
              : displayedConnection
                ? `conn-${displayedConnection.source}-${displayedConnection.target}`
                : 'empty'
          }
          selectedFile={displayedFile}
          selectedConnection={displayedConnection}
          onClose={() => {
            setSelectedPath(null);
            setSelectedConnection(null);
          }}
          onNavigate={(targetPath) => {
            setSelectedPath(targetPath);
            setSelectedConnection(null);
          }}
        />
      </div>
    </div>
  );
}
