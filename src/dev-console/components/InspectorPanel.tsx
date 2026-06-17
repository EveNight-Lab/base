import type { FileMeta } from '../architectureDb';
import ConnectionInspector from './ConnectionInspector';
import FileInspector from './FileInspector';

interface InspectorPanelProps {
  selectedFile: FileMeta | null;
  selectedConnection?: {
    source: string;
    target: string;
    label: string;
    type?: 'component' | 'function' | 'data';
    dataOut?: string;
    dataIn?: string;
    description: string;
  } | null;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export default function InspectorPanel({
  selectedFile,
  selectedConnection,
  onClose,
  onNavigate,
}: InspectorPanelProps) {
  // 노드나 연결이 아예 선택되지 않은 상태의 뷰
  if (!selectedFile && !selectedConnection) {
    return (
      <div className="h-[240px] flex items-center justify-center bg-[#0C0F1A]/95 border-t border-white/5 text-gray-500 text-0.875rem tracking-wide">
        <div className="text-center">
          <p className="mb-2">
            💡 맵 상에서 상세히 알아보고 싶은 파일 노드 또는 연결 라벨을 선택해 주세요.
          </p>
          <p className="text-[12px] text-gray-600">
            선택 시 해당 파일의 역할 요약, 데이터 송수신 목록, 내부 함수 해설 및 메모 기능이
            열립니다.
          </p>
        </div>
      </div>
    );
  }

  // 연결(의존선)이 선택된 상태의 뷰
  if (!selectedFile && selectedConnection) {
    return (
      <ConnectionInspector
        selectedConnection={selectedConnection}
        onClose={onClose}
        onNavigate={onNavigate}
      />
    );
  }

  // selectedFile이 존재하는 경우 (파일 인스펙터 화면)
  if (selectedFile) {
    return <FileInspector selectedFile={selectedFile} onClose={onClose} onNavigate={onNavigate} />;
  }

  return null;
}
