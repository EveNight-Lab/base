/**
 * 프로젝트 아키텍처 스펙 데이터베이스 (Architecture DB)
 *
 * 프로젝트 내의 모든 핵심 소스 파일에 대한 논리 스펙을 담고 있습니다.
 * 복잡한 React/TypeScript 코드를 읽지 못하더라도 이 데이터베이스를 통해
 * 각 파일이 어떤 역할을 하고, 어떤 함수를 가지며, 어떤 데이터 흐름을 갖는지 쉽게 이해할 수 있습니다.
 * AI가 새로운 파일 추가/수정 시 이 명세를 함께 업데이트합니다.
 */

export interface FileMeta {
  path: string;
  name: string;
  type:
    | 'entry'
    | 'router'
    | 'page'
    | 'layout'
    | 'component'
    | 'store'
    | 'hook'
    | 'utility'
    | 'style'
    | 'dev';
  role: string; // 한글 역할 설명
  inputs: { name: string; description: string; type?: string }[];
  outputs: { name: string; description: string; type?: string }[];
  functions: { name: string; role: string; parameters?: string; returns?: string }[];
  dependencies: string[]; // 이 파일이 가져다 쓰는 다른 파일의 path 리스트
  defaultPos: { x: number; y: number }; // 2D 캔버스 초기 배치 좌표
}

export const architectureDb: Record<string, FileMeta> = {
  // 1. 엔트리 & 라우터 레이어
  'src/main.tsx': {
    path: 'src/main.tsx',
    name: 'main.tsx',
    type: 'entry',
    role: '리액트 애플리케이션의 최상위 진입 파일로, 브라우저의 HTML DOM에 React 컴포넌트를 주입하여 화면을 켜는 스타터 역할을 수행합니다.',
    inputs: [],
    outputs: [
      {
        name: 'DOM Injection',
        description: 'index.html의 #root 엘리먼트에 앱 컴포넌트를 마운트함',
      },
    ],
    functions: [],
    dependencies: ['src/App.tsx', 'src/index.css'],
    defaultPos: { x: 50, y: 150 },
  },
  'src/App.tsx': {
    path: 'src/App.tsx',
    name: 'App.tsx',
    type: 'entry',
    role: '전체 애플리케이션의 뿌리가 되는 컴포넌트입니다. 라우터를 가져와 화면에 그리는 주축 역할을 합니다.',
    inputs: [],
    outputs: [{ name: 'AppRouter', description: '화면 전환을 처리하는 라우터 트리거' }],
    functions: [],
    dependencies: ['src/router/index.tsx'],
    defaultPos: { x: 220, y: 150 },
  },
  'src/router/index.tsx': {
    path: 'src/router/index.tsx',
    name: 'router/index.tsx',
    type: 'router',
    role: '주소(URL) 경로에 맞춰 어떤 페이지 컴포넌트를 보여줄지 길을 안내하는 지도 역할을 합니다. 페이지 컴포넌트를 비동기적(Lazy Loading)으로 가져와 속도를 높입니다.',
    inputs: [
      { name: 'URL Path', description: '브라우저 주소 표시줄의 경로 (예: /, /about, /demo)' },
    ],
    outputs: [
      {
        name: 'Layout / Page Rendering',
        description: '경로에 맞는 레이아웃 구조와 알맞은 페이지 화면 출력',
      },
    ],
    functions: [
      {
        name: 'PageLoader',
        role: '페이지 파일을 불러오는 도중 화면에 임시로 "로딩 중..." 표시를 띄우는 함수',
      },
    ],
    dependencies: [
      'src/components/layout/Layout.tsx',
      'src/pages/HomePage.tsx',
      'src/pages/AboutPage.tsx',
    ],
    defaultPos: { x: 390, y: 150 },
  },

  // 2. 레이아웃 & 공통 컴포넌트 레이어
  'src/components/layout/Layout.tsx': {
    path: 'src/components/layout/Layout.tsx',
    name: 'layout/Layout.tsx',
    type: 'layout',
    role: '모든 페이지에 고통으로 탑재되는 뼈대 구조입니다. 상단 헤더, 본문(Outlet), 하단 푸터 영역을 일관된 형태 배치해 줍니다.',
    inputs: [],
    outputs: [
      {
        name: 'Outlet',
        description: '라우터가 지정한 현재 페이지 컴포넌트가 끼워 맞춰져 렌더링될 자리',
      },
    ],
    functions: [],
    dependencies: ['src/components/layout/Header.tsx', 'src/components/layout/Footer.tsx'],
    defaultPos: { x: 560, y: 150 },
  },
  'src/components/layout/Header.tsx': {
    path: 'src/components/layout/Header.tsx',
    name: 'layout/Header.tsx',
    type: 'layout',
    role: '화면 상단에 노출되는 네비게이션 영역으로, 프로젝트 로고와 메뉴 링크들을 배치하여 사용자가 원하는 페이지로 이동할 수 있도록 돕습니다.',
    inputs: [],
    outputs: [
      { name: 'Link Click', description: '클릭 시 해당 경로(/, /about)로 페이지 전환 유도' },
    ],
    functions: [],
    dependencies: [],
    defaultPos: { x: 730, y: 50 },
  },
  'src/components/layout/Footer.tsx': {
    path: 'src/components/layout/Footer.tsx',
    name: 'layout/Footer.tsx',
    type: 'layout',
    role: '화면 하단에 저작권 표시, 고정 문구 등을 고정시켜 나타내는 바닥글 영역입니다.',
    inputs: [],
    outputs: [],
    functions: [],
    dependencies: [],
    defaultPos: { x: 730, y: 250 },
  },
  'src/components/common/Button.tsx': {
    path: 'src/components/common/Button.tsx',
    name: 'common/Button.tsx',
    type: 'component',
    role: '프로젝트 전역에서 공통으로 재사용하는 버튼 컴포넌트입니다. 테두리 스타일, 둥글기, 비활성화 처리 등을 Props 속성으로 제어합니다.',
    inputs: [
      { name: 'variant', description: '버튼의 스타일 양식 (primary, outline, secondary 등)' },
      { name: 'size', description: '버튼의 크기 (sm, md, lg)' },
      { name: 'loading', description: '로딩 애니메이션 활성화 여부' },
    ],
    outputs: [
      { name: 'onClick Event', description: '버튼 클릭 시 상위 컴포넌트의 특정 로직 트리거' },
    ],
    functions: [],
    dependencies: [],
    defaultPos: { x: 920, y: 50 },
  },
  'src/components/common/Input.tsx': {
    path: 'src/components/common/Input.tsx',
    name: 'common/Input.tsx',
    type: 'component',
    role: '사용자의 텍스트 입력을 처리하는 공통 입력 박스입니다. 에러 메시지 알람과 캡션 표시 기능이 결합되어 있습니다.',
    inputs: [
      { name: 'label', description: '입력 박스 위에 띄울 제목 텍스트' },
      { name: 'error', description: '하단에 노출시킬 경고 에러 문구' },
    ],
    outputs: [
      {
        name: 'onChange Event',
        description: '키보드 입력이 일어날 때마다 실시간 타이핑 문자 전달',
      },
    ],
    functions: [],
    dependencies: [],
    defaultPos: { x: 920, y: 250 },
  },

  // 3. 페이지 레이어
  'src/pages/HomePage.tsx': {
    path: 'src/pages/HomePage.tsx',
    name: 'pages/HomePage.tsx',
    type: 'page',
    role: '서비스의 얼굴이 되는 대표 메인 화면입니다. 서버 사이드 렌더링(SSR) 시 검색 크롤러들이 핵심 텍스트 정보를 긁어갈 수 있도록 텍스트 위주로 정밀 설계되어 있습니다.',
    inputs: [],
    outputs: [],
    functions: [],
    dependencies: ['src/components/common/Button.tsx'],
    defaultPos: { x: 560, y: 380 },
  },
  'src/pages/AboutPage.tsx': {
    path: 'src/pages/AboutPage.tsx',
    name: 'pages/AboutPage.tsx',
    type: 'page',
    role: '프로젝트에 사용된 기술 스택 정보 및 SEO 태그 삽입을 위한 안내를 포함하는 소개 서브 페이지입니다.',
    inputs: [],
    outputs: [],
    functions: [],
    dependencies: ['src/utils/seo.ts'],
    defaultPos: { x: 390, y: 380 },
  },

  // 4. 유틸리티, 훅 및 상태 스토어 레이어
  'src/utils/api.ts': {
    path: 'src/utils/api.ts',
    name: 'utils/api.ts',
    type: 'utility',
    role: '서버와 네트워크 통신을 전담하는 순수 비동기 통신 코어 서비스입니다. 네트워크 지연 및 강제 에러 시뮬레이터 옵션이 결합되어 동작합니다.',
    inputs: [
      { name: 'url', description: '호출할 API 경로 주소' },
      { name: 'options', description: 'HTTP 메서드 및 AbortSignal, 헤더 정보' },
    ],
    outputs: [
      {
        name: 'Promise Data',
        description: '서버로부터 파싱 완료되어 정규화된 JSON 객체 데이터 반환',
      },
    ],
    functions: [
      {
        name: 'request',
        role: 'Abort 컨트롤러 및 타임아웃, 에러/지연 시뮬레이션을 종합 연산하여 최종 fetch 요청을 수행하는 실무 핵심 엔진',
      },
      { name: 'get', role: 'GET 방식으로 리소스를 수신하는 편리한 통신 포장 함수' },
      { name: 'post', role: 'POST 방식으로 데이터를 생성/전송하는 포장 함수' },
    ],
    dependencies: ['src/utils/flowTracker.ts'],
    defaultPos: { x: 50, y: 620 },
  },
  'src/hooks/useApi.ts': {
    path: 'src/hooks/useApi.ts',
    name: 'hooks/useApi.ts',
    type: 'hook',
    role: '화면 컴포넌트가 꺼질 때(Unmount), 미처 완료되지 못한 네트워크 API 요청들을 안전하게 일괄 중단시켜 좀비 프로세스 및 메모리 누수를 방지하는 핵심 리액트 훅입니다.',
    inputs: [],
    outputs: [
      {
        name: 'useApiReturn',
        description: '컴포넌트 수명주기에 바인딩되어 통신하는 get/post/put/delete 기능 꾸러미 반환',
      },
    ],
    functions: [
      {
        name: 'useAbortSignal',
        role: '컴포넌트 소멸 시 자동으로 중단 시그널(AbortSignal)을 발산하도록 리스너를 바인딩하는 비공개 내부 훅',
      },
      {
        name: 'useApi',
        role: '컴포넌트에 주입된 AbortSignal을 기본 주입하여 안전한 API 인스턴스를 공급하는 훅 함수',
      },
    ],
    dependencies: ['src/utils/api.ts'],
    defaultPos: { x: 220, y: 620 },
  },
  'src/utils/seo.ts': {
    path: 'src/utils/seo.ts',
    name: 'utils/seo.ts',
    type: 'utility',
    role: '검색 엔진 최적화(SEO)를 극대화하기 위해, 컴포넌트 호출에 따라 브라우저 타이틀, 메타 정보, OpenGraph 이미지 등을 헤더 DOM 영역에 강제 주입해 주는 도구입니다.',
    inputs: [{ name: 'seoData', description: '페이지 타이틀, 설명문구, OG 태그 정보들' }],
    outputs: [
      {
        name: 'Meta Tag Injection',
        description: 'HTML head 태그 내부의 메타 요소 동적 생성 및 치환',
      },
    ],
    functions: [
      {
        name: 'updateMetaTags',
        role: '전달된 데이터를 기반으로 meta 요소를 찾고 치환/생성해 주는 함수',
      },
    ],
    dependencies: [],
    defaultPos: { x: 390, y: 620 },
  },
  'src/stores/createStore.ts': {
    path: 'src/stores/createStore.ts',
    name: 'stores/createStore.ts',
    type: 'store',
    role: '리액트 19의 화면 동기화 규격인 useSyncExternalStore를 기반으로 고성능 상태 저장소를 선언할 수 있는 템플릿 제네레이터입니다. 상태가 바뀔 때마다 자동으로 플로우 이벤트를 로깅합니다.',
    inputs: [
      { name: 'storeName', description: '디버그 및 플로우 구분을 위한 스토어 고유 명칭' },
      { name: 'initialState', description: '스토어가 시작 시 보관할 최초 기본 상태 데이터' },
    ],
    outputs: [
      {
        name: 'Store Interface',
        description: '상태 조회(getState), 변경(setState), React 구독 훅(useStore) 반환',
      },
    ],
    functions: [
      {
        name: 'createStore',
        role: '외부 상태 보관 장소와 동적 리액트 구독 리스너 체인을 구축하는 선언 함수',
      },
    ],
    dependencies: ['src/utils/flowTracker.ts'],
    defaultPos: { x: 730, y: 620 },
  },
  'src/stores/demoStore.ts': {
    path: 'src/stores/demoStore.ts',
    name: 'stores/demoStore.ts',
    type: 'store',
    role: '카운터 수치, 로그인 유저 정보, 유저 인터페이스 설정 등을 보관하여, 전역 상태 전이가 어떻게 시각 모니터링 화면으로 리액션되는지 검사하는 테스트 스토어입니다.',
    inputs: [],
    outputs: [
      { name: 'State Values', description: '현재 저장된 카운터 수치, 로그인 여부 및 설정 정보' },
    ],
    functions: [
      { name: 'increment', role: '카운터 수치를 1 더하는 행위' },
      { name: 'decrement', role: '카운터 수치를 1 뺴는 행위' },
      { name: 'login', role: '테스트 가상 사용자로 로그인을 수행하여 유저 세션을 적재하는 행위' },
      { name: 'logout', role: '로그인 세션을 파괴하고 기본 방문자 상태로 초기화하는 행위' },
      { name: 'toggleTheme', role: '다크모드/라이트모드 설정을 상호 토글시키는 행위' },
    ],
    dependencies: ['src/stores/createStore.ts'],
    defaultPos: { x: 920, y: 620 },
  },
  'src/utils/flowTracker.ts': {
    path: 'src/utils/flowTracker.ts',
    name: 'utils/flowTracker.ts',
    type: 'utility',
    role: '애플리케이션 안에서 발생하는 모든 통신 트랜잭션, 상태 변화, 커스텀 이벤트 로그를 낚아채서 배열에 기록하고 옵저버들에게 실시간으로 전파(Publish)하는 데이터 플로우의 핵심 우체국 역할을 합니다.',
    inputs: [
      { name: 'Raw Logs', description: 'API 송수신 시점 정보, 상태 이전/이후 스냅샷 데이터' },
    ],
    outputs: [
      {
        name: 'Broadcast Events',
        description: '구독 중인 개발자 대시보드 화면에 전수 이벤트 브로드캐스팅',
      },
    ],
    functions: [
      {
        name: 'subscribe',
        role: '개발자 대시보드가 새로운 로그를 실시간 수신할 수 있도록 리스너를 매핑해 두는 함수',
      },
      { name: 'logApiStart', role: 'API 요청 시작 시점을 시간 정보와 함께 보관하는 함수' },
      {
        name: 'logStateChange',
        role: '스토어 상태 전이 시점의 이전(Prev) 값과 이후(Next) 값을 가시적으로 비교 로깅하는 함수',
      },
    ],
    dependencies: [],
    defaultPos: { x: 560, y: 620 },
  },

  // 5. 개발자 대시보드 전용 레이어
  'src/dev.tsx': {
    path: 'src/dev.tsx',
    name: 'dev.tsx',
    type: 'dev',
    role: '개발자 대시보드 전용 페이지(dev.html)의 독립된 React 진입점으로, 메인 서비스 코드와 격리된 아키텍처 콘솔 화면을 독립적으로 브라우징 마운트해 줍니다.',
    inputs: [],
    outputs: [],
    functions: [],
    dependencies: ['src/dev-console/DevConsoleApp.tsx', 'src/index.css'],
    defaultPos: { x: 50, y: 850 },
  },
  'src/dev-console/DevConsoleApp.tsx': {
    path: 'src/dev-console/DevConsoleApp.tsx',
    name: 'dev-console/DevConsoleApp.tsx',
    type: 'dev',
    role: '개발자 전용 대시보드의 전체 화면 프레임입니다. 탭 이동을 관리하고 전반적인 테크니컬 디자인(스페이스 다크 모드, 네온 보더)을 총괄 지배합니다.',
    inputs: [],
    outputs: [],
    functions: [],
    dependencies: [
      'src/dev-console/components/TopologyMap.tsx',
      'src/dev-console/components/FlowMonitor.tsx',
      'src/dev-console/components/DocsViewer.tsx',
    ],
    defaultPos: { x: 220, y: 850 },
  },
  'src/dev-console/components/TopologyMap.tsx': {
    path: 'src/dev-console/components/TopologyMap.tsx',
    name: 'dev-console/components/TopologyMap.tsx',
    type: 'dev',
    role: '2D 인터랙티브 노드 맵 캔버스 화면입니다. 마우스 드래그를 처리하고 노드 좌표를 localStorage에 기록하며, 의존성 관계를 흐르는 점선 SVG 곡선 화살표로 표현합니다.',
    inputs: [{ name: 'architectureDb', description: '이 파일에 적힌 파일 명세 데이터' }],
    outputs: [
      { name: 'Active Node Select', description: '노드 클릭 시 하단 인스펙터 상세 화면 갱신' },
    ],
    functions: [
      {
        name: 'handleDragStart',
        role: '노드 카드를 마우스로 쥐었을 때 좌표 수집을 활성화하는 함수',
      },
      {
        name: 'drawConnections',
        role: '각 노드 카드들 간의 위치 차이를 계산해 부드러운 연결 곡선 좌표를 뱉어내는 SVG 생성 함수',
      },
      {
        name: 'autoAlignGrid',
        role: '흐트러진 노드들을 격자 구조로 가지런히 자동 정렬하고 좌표를 초기화하는 기능',
      },
    ],
    dependencies: [
      'src/dev-console/architectureDb.ts',
      'src/dev-console/components/InspectorPanel.tsx',
    ],
    defaultPos: { x: 390, y: 850 },
  },
  'src/dev-console/components/InspectorPanel.tsx': {
    path: 'src/dev-console/components/InspectorPanel.tsx',
    name: 'dev-console/components/InspectorPanel.tsx',
    type: 'dev',
    role: '선택된 노드의 기능 설명, 함수 딕셔너리, 입력/출력 매개변수 구조를 상세 표기하고 사용자가 공부하며 직접 주석 메모를 기록할 수 있게 지원하는 인스펙터 도구입니다.',
    inputs: [{ name: 'selectedFile', description: '선택된 파일 정보 개체' }],
    outputs: [
      { name: 'Comment Save', description: '사용자가 남긴 파일 주석을 localStorage에 영구 보존' },
    ],
    functions: [
      { name: 'saveCustomComment', role: '텍스트 영역의 글을 로컬 메모리에 동기화 저장하는 함수' },
    ],
    dependencies: [],
    defaultPos: { x: 560, y: 850 },
  },
  'src/dev-console/components/FlowMonitor.tsx': {
    path: 'src/dev-console/components/FlowMonitor.tsx',
    name: 'dev-console/components/FlowMonitor.tsx',
    type: 'dev',
    role: '실시간 데이터 이벤트를 표 형태로 조회하고, 상세 JSON 트리를 클립보드에 복사할 수 있는 리얼타임 감시 로그 패널 및 통신 시뮬레이터 옵션 토글 박스입니다.',
    inputs: [],
    outputs: [
      {
        name: 'Toggle Simulator',
        description: '네트워크 강제 지연 및 통신 실패 시뮬레이터 플래그 조정',
      },
    ],
    functions: [
      {
        name: 'renderJsonTree',
        role: '이벤트 세부 JSON 데이터를 색상이 입혀진 계층형 리더기로 렌더링하는 함수',
      },
      { name: 'toggleLatencySim', role: '지연 시뮬레이터 플래그를 ON/OFF 토글하는 기능' },
    ],
    dependencies: ['src/utils/flowTracker.ts'],
    defaultPos: { x: 730, y: 850 },
  },
  'src/dev-console/components/DocsViewer.tsx': {
    path: 'src/dev-console/components/DocsViewer.tsx',
    name: 'dev-console/components/DocsViewer.tsx',
    type: 'dev',
    role: 'docs 폴더 내 마크다운 문서를 읽어와 브라우저상에서 예쁜 스타일의 개발 가이드북으로 보여주는 문서 통합 탐색 탭입니다.',
    inputs: [],
    outputs: [],
    functions: [
      {
        name: 'fetchMarkdownDocument',
        role: 'docs 폴더 경로 상에 존재하는 특정 마크다운 파일을 로드하는 비동기 함수',
      },
    ],
    dependencies: [],
    defaultPos: { x: 920, y: 850 },
  },
};
