export interface ConnectionMeta {
  label: string;
  type: 'component' | 'function' | 'data';
  dataOut?: string;
  dataIn?: string;
}

export const getConnectionMeta = (
  sourcePath: string,
  targetPath: string
): ConnectionMeta | null => {
  const key = `${sourcePath} -> ${targetPath}`;
  const metas: Record<string, ConnectionMeta> = {
    'src/main.tsx -> src/App.tsx': {
      label: '<App /> 렌더',
      type: 'component',
      dataOut: 'React Root 마운트 시그널',
      dataIn: 'App UI 렌더링',
    },
    'src/main.tsx -> src/index.css': {
      label: '글로벌 CSS',
      type: 'data',
      dataOut: '공통 스타일시트 임포트',
      dataIn: '스타일 클래스 바인딩',
    },
    'src/App.tsx -> src/router/index.tsx': {
      label: '<AppRouter /> 호출',
      type: 'component',
      dataOut: '라우팅 매핑 기동',
      dataIn: 'URL 매칭 화면 구성',
    },
    'src/router/index.tsx -> src/components/layout/Layout.tsx': {
      label: '<Layout /> 호출',
      type: 'component',
      dataOut: '상하단 레이아웃 뼈대 마운트',
      dataIn: 'Header / Footer 결합 UI',
    },
    'src/router/index.tsx -> src/pages/HomePage.tsx': {
      label: '<HomePage /> (/)',
      type: 'component',
      dataOut: '홈 경로(/) 진입 신호',
      dataIn: 'HomePage 컴포넌트 렌더',
    },
    'src/router/index.tsx -> src/pages/AboutPage.tsx': {
      label: '<AboutPage /> (/about)',
      type: 'component',
      dataOut: '소개 경로(/about) 진입 신호',
      dataIn: 'AboutPage 컴포넌트 렌더',
    },
    'src/components/layout/Layout.tsx -> src/components/layout/Header.tsx': {
      label: '<Header /> 마운트',
      type: 'component',
      dataOut: '헤더 레이아웃 구성 정보',
      dataIn: '상단 네비게이션 메뉴바',
    },
    'src/components/layout/Layout.tsx -> src/components/layout/Footer.tsx': {
      label: '<Footer /> 마운트',
      type: 'component',
      dataOut: '푸터 레이아웃 구성 정보',
      dataIn: '하단 정보 영역',
    },
    'src/pages/HomePage.tsx -> src/components/common/Button.tsx': {
      label: '<Button /> 사용',
      type: 'component',
      dataOut: '버튼 글자(children), onClick 핸들러',
      dataIn: '스타일링된 버튼 UI',
    },
    'src/pages/AboutPage.tsx -> src/utils/seo.ts': {
      label: 'updateMetaTags()',
      type: 'function',
      dataOut: 'title, description (메타 데이터)',
      dataIn: 'document.title 업데이트 적용',
    },
    'src/utils/api.ts -> src/utils/flowTracker.ts': {
      label: 'API 로그 수집',
      type: 'data',
      dataOut: 'ApiLogEvent (통신 시간, URL, Payload, 에러)',
      dataIn: '없음',
    },
    'src/hooks/useApi.ts -> src/utils/api.ts': {
      label: 'request() 호출',
      type: 'function',
      dataOut: 'url, options, requestBody',
      dataIn: 'Promise<Response> (API 결과)',
    },
    'src/stores/createStore.ts -> src/utils/flowTracker.ts': {
      label: 'logStateChange()',
      type: 'function',
      dataOut: 'StateChangeEvent (액션 이름, prevState, nextState)',
      dataIn: '없음',
    },
    'src/stores/demoStore.ts -> src/stores/createStore.ts': {
      label: 'createStore() 호출',
      type: 'function',
      dataOut: 'initialState (상태 초깃값), reducer/actions',
      dataIn: 'Store 인스턴스 (getState, dispatch, subscribe)',
    },
    'src/dev.tsx -> src/dev-console/DevConsoleApp.tsx': {
      label: '<DevConsoleApp /> 렌더',
      type: 'component',
      dataOut: '개발 모드 진입 신호',
      dataIn: '개발자 콘솔 프레임 UI',
    },
    'src/dev.tsx -> src/index.css': {
      label: '글로벌 스타일',
      type: 'data',
      dataOut: '글로벌 스타일시트 로드',
      dataIn: '디자인 클래스 반영',
    },
    'src/dev-console/DevConsoleApp.tsx -> src/dev-console/components/TopologyMap.tsx': {
      label: '<TopologyMap /> 마운트',
      type: 'component',
      dataOut: '탭 활성화 상태',
      dataIn: '2D 아키텍처 토폴로지 맵',
    },
    'src/dev-console/DevConsoleApp.tsx -> src/dev-console/components/FlowMonitor.tsx': {
      label: '<FlowMonitor /> 마운트',
      type: 'component',
      dataOut: '탭 활성화 상태',
      dataIn: '실시간 데이터 흐름 모니터 UI',
    },
    'src/dev-console/DevConsoleApp.tsx -> src/dev-console/components/DocsViewer.tsx': {
      label: '<DocsViewer /> 마운트',
      type: 'component',
      dataOut: '탭 활성화 상태',
      dataIn: '설계 가이드북 뷰어 UI',
    },
    'src/dev-console/components/TopologyMap.tsx -> src/dev-console/architectureDb.ts': {
      label: '명세 DB 참조',
      type: 'data',
      dataOut: '가져오기(Import) 요청',
      dataIn: 'architectureDb (전체 소스파일 메타 명세)',
    },
    'src/dev-console/components/TopologyMap.tsx -> src/dev-console/components/InspectorPanel.tsx': {
      label: '<InspectorPanel /> 렌더',
      type: 'component',
      dataOut: 'selectedFile, selectedConnection, onNavigate',
      dataIn: '상세 정보 인스펙터 패널 UI',
    },
    'src/dev-console/components/FlowMonitor.tsx -> src/utils/flowTracker.ts': {
      label: 'subscribe() 구독',
      type: 'function',
      dataOut: '로그 리스너 콜백 함수',
      dataIn: '실시간 이벤트 로그 데이터',
    },
    'src/dev-console/components/DocsViewer.tsx -> docs/PLAN.md': {
      label: 'PLAN.md 로드',
      type: 'data',
      dataOut: 'HTTP GET /docs/PLAN.md 파일 요청',
      dataIn: '마크다운 원문 텍스트',
    },
  };
  return metas[key] || null;
};

export const getConnectionDescription = (sourcePath: string, targetPath: string): string => {
  const key = `${sourcePath} -> ${targetPath}`;
  const desc: Record<string, string> = {
    'src/main.tsx -> src/App.tsx':
      'React의 ReactDOM.createRoot()를 사용하여 애플리케이션의 최상위 App 컴포넌트를 index.html의 #root DOM 엘리먼트에 마운트하고 렌더링 프로세스를 가동합니다.',
    'src/main.tsx -> src/index.css':
      '애플리케이션 전역에서 사용되는 Vanilla CSS 스타일링 파일(index.css)을 임포트하여 전체 UI 컴포넌트에 디자인 레이아웃 및 스타일 속성을 주입합니다.',
    'src/App.tsx -> src/router/index.tsx':
      'React Router 라이브러리에 전체 페이지 경로 제어 권한을 위임하기 위해, 정의된 라우터 설정 객체(<AppRouter />)를 호출하여 활성화합니다.',
    'src/router/index.tsx -> src/components/layout/Layout.tsx':
      '각 서브 페이지(/, /about)가 전환되더라도 공통된 상단 헤더와 하단 푸터 레이아웃 뼈대를 공유할 수 있도록 루트 레이아웃 구조를 매핑합니다.',
    'src/router/index.tsx -> src/pages/HomePage.tsx':
      '기본 경로(/) 주소로 사용자가 유입되었을 때 보여줄 첫 메인 랜딩 화면 컴포넌트(HomePage)를 lazy loading 방식으로 동적 호출합니다.',
    'src/router/index.tsx -> src/pages/AboutPage.tsx':
      '사용자가 /about 경로로 진입했을 때 기술 스택 소개 및 메타 설명글을 표출하기 위해 AboutPage 컴포넌트를 동적 로드합니다.',
    'src/components/layout/Layout.tsx -> src/components/layout/Header.tsx':
      '상단 네비게이션 영역인 Header 컴포넌트를 뼈대 구조에 배치하여 로고 및 페이지 전환 메뉴바를 노출합니다.',
    'src/components/layout/Layout.tsx -> src/components/layout/Footer.tsx':
      '하단 저작권 정보 및 고정 바닥글 영역인 Footer 컴포넌트를 뼈대 레이아웃에 고정 배치합니다.',
    'src/pages/HomePage.tsx -> src/components/common/Button.tsx':
      '메인 화면 내의 주요 CTA 상호작용 및 링크 클릭 액션에 표준화된 공통 스타일 버튼 컴포넌트를 가져와 사용합니다.',
    'src/pages/AboutPage.tsx -> src/utils/seo.ts':
      '소개 페이지 렌더링 시 브라우저 헤더 메타 태그(title, meta description)를 동적으로 변경하여 웹 크롤러 최적화(SEO) 함수를 트리거합니다.',
    'src/utils/api.ts -> src/utils/flowTracker.ts':
      'fetch 요청이 시작되거나 성공/실패/취소(Abort)될 때, 해당 통신 전문 데이터를 타임스탬프와 함께 flowTracker의 로그 스트림에 실시간 주입합니다.',
    'src/hooks/useApi.ts -> src/utils/api.ts':
      '리액트 컴포넌트의 라이프사이클과 연동하여 API 호출을 처리할 수 있도록, api.ts의 request() 핵심 메서드를 가져와 AbortSignal과 결합한 훅 형태로 가공합니다.',
    'src/stores/createStore.ts -> src/utils/flowTracker.ts':
      'useSyncExternalStore 기반 스토어에서 setState 상태 전이가 일어나는 순간 변경 전(Prev)/후(Next) 데이터의 Diff를 추출해 flowTracker에 로깅합니다.',
    'src/stores/demoStore.ts -> src/stores/createStore.ts':
      'createStore() 생성 유틸리티를 호출하여 전역 카운터 및 로그인 상태 등을 갖는 캡슐화된 상태 저장소(demoStore)를 선언합니다.',
    'src/dev.tsx -> src/dev-console/DevConsoleApp.tsx':
      '개발자 전용 진입화면(dev.html)의 독립 리액트 렌더러 위에 대시보드 프레임인 DevConsoleApp 컴포넌트를 로드하여 렌더링합니다.',
    'src/dev.tsx -> src/index.css':
      '개발 콘솔 내부 테크니컬 디자인(스페이스 다크, 네온 스티치 등)에 필요한 스타일 요소를 index.css로부터 가져옵니다.',
    'src/dev-console/DevConsoleApp.tsx -> src/dev-console/components/TopologyMap.tsx':
      '1번 탭 화면으로 프로젝트 아키텍처 및 의존 파일 연결선을 조작할 수 있는 2D 토폴로지 맵 컴포넌트를 불러와 마운트합니다.',
    'src/dev-console/DevConsoleApp.tsx -> src/dev-console/components/FlowMonitor.tsx':
      '2번 탭 화면으로 실시간 API 이벤트와 스토어 변동 상태(Diff) 내역을 가로채서 테이블 형식으로 보는 모니터 패널을 불러옵니다.',
    'src/dev-console/DevConsoleApp.tsx -> src/dev-console/components/DocsViewer.tsx':
      '3번 탭 화면으로 docs 폴더 아래의 마크다운 상세 가이드라인 문서를 비동기로 탐색하여 파싱하는 가이드북 뷰어를 마운트합니다.',
    'src/dev-console/components/TopologyMap.tsx -> src/dev-console/architectureDb.ts':
      '2D 캔버스 위에 파일 카드를 위치시키고 명세를 인스펙션하는 데 필요한 아키텍처 논리 명세 데이터베이스를 가져옵니다.',
    'src/dev-console/components/TopologyMap.tsx -> src/dev-console/components/InspectorPanel.tsx':
      '캔버스 노드나 선을 클릭했을 때 역할/함수/데이터 명세 세부사항을 하단에 표출해 주는 슬라이딩 드로어 컴포넌트를 마운트합니다.',
    'src/dev-console/components/FlowMonitor.tsx -> src/utils/flowTracker.ts':
      'flowTracker 싱글톤 스토어의 로그 리스너 채널을 구독(subscribe)하여, 브로드캐스팅되는 통신/상태 변동 이벤트를 모니터 UI 테이블에 실시간 반영합니다.',
    'src/dev-console/components/DocsViewer.tsx -> docs/PLAN.md':
      '가이드북 뷰어 탭이 활성화되면 docs/ 폴더 경로에 저장된 마크다운 파일을 fetch하여 화면에 파싱하고 마크다운 형태로 렌더링합니다.',
  };
  return desc[key] || '정의된 의존 관계가 연결되어 상호작용합니다.';
};

export type FileCategory = 'local' | 'shared' | 'orchestrator';

export interface FileCategoryInfo {
  type: FileCategory;
  label: string;
  desc: string;
  styleClass: string;
}

export const getFileCategory = (path: string): FileCategoryInfo => {
  const localMap: Record<string, FileCategory> = {
    'src/components/layout/Header.tsx': 'local',
    'src/components/layout/Footer.tsx': 'local',
  };

  const sharedMap: Record<string, FileCategory> = {
    'src/components/common/Button.tsx': 'shared',
    'src/components/common/Input.tsx': 'shared',
    'src/utils/api.ts': 'shared',
    'src/hooks/useApi.ts': 'shared',
    'src/utils/seo.ts': 'shared',
    'src/stores/createStore.ts': 'shared',
    'src/utils/flowTracker.ts': 'shared',
  };

  let cat: FileCategory = 'orchestrator';
  if (localMap[path]) {
    cat = 'local';
  } else if (sharedMap[path]) {
    cat = 'shared';
  }

  const infos: Record<FileCategory, FileCategoryInfo> = {
    local: {
      type: 'local',
      label: '🔒 특정 파일 전용',
      desc: '특정 부모 컴포넌트/레이아웃 내부에서만 독점적으로 사용되는 내부 헬퍼 파일입니다.',
      styleClass:
        'border-[#475569] bg-[#0F172A]/70 text-slate-300 shadow-[0_0_15px_rgba(71,85,105,0.1)]',
    },
    shared: {
      type: 'shared',
      label: '♻️ 공통 / 재사용',
      desc: '프로젝트 여러 곳에서 불러와 공통으로 사용되는 범용 컴포넌트, 유틸리티, 훅입니다.',
      styleClass:
        'border-emerald-500 bg-emerald-950/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    },
    orchestrator: {
      type: 'orchestrator',
      label: '🎛️ 상호작용 / 조율',
      desc: '페이지 구성, 라우팅, 전역 흐름 제어 등 다른 파일들을 모아 결합하고 조율하는 중심점 파일입니다.',
      styleClass:
        'border-indigo-500 bg-indigo-950/40 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.15)]',
    },
  };

  return infos[cat];
};
