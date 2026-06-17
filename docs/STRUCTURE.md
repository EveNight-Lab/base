# STRUCTURE.md

UI 영역·배치·대략 비율(레이아웃)을 작성한다.

---

## UI 구조 (레이아웃·위치·비율)

### 1. 메인 사용자 애플리케이션 (index.html)

```text
<app-root> — 위치: 전체화면 | 비율: 100%
- header-main — 위치: top | 높이: 72px (고정)
- page-container — 위치: center | 높이: flex-1 (나머지 전체)
  - page-home — 위치: '/' 경로 | 너비: max-w-5xl 중앙 정렬
  - page-about — 위치: '/about' 경로 | 너비: max-w-5xl 중앙 정렬
- footer-main — 위치: bottom | 높이: 60px (고정)
- floating-dev-console-trigger — 위치: bottom-right | 크기: 48px 원형 (Vite DEV 모드 한정 노출)
```

### 2. 개발자 전용 모니터링 시스템 (dev.html)

```text
<dev-console-root> — 위치: 전체화면 | 비율: 100% (다크 테마 적용)
- dev-header — 위치: top | 높이: 56px (고정)
  - dev-tab-menu — 위치: left-center | 가로 정렬
- dev-content-container — 위치: center | 높이: flex-1 (헤더 제외 전체)

  [탭 1: 아키텍처 노드 맵 (tab-topology-map)]
  - canvas-viewport — 위치: center | 크기: 1250px x 980px 무한 스크롤 컨테이너
    - canvas-control-panel — 위치: floating-left-top | 너비: 240px
    - svg-connections-layer — 위치: absolute-inset-0 | z-index: 0
    - node-cards-layer — 위치: absolute | z-index: 10
  - drawer-inspector-panel — 위치: bottom | 높이: 340px (z-index: 20, 토글 및 파일 상세 점프 지원)
    - inspector-spec-col1 — 위치: left | 비율: 33% (파일 역할 및 데이터 입출력 설명)
    - inspector-spec-col2 — 위치: middle | 비율: 33% (핵심 함수 목록 사전)
    - inspector-spec-col3 — 위치: right | 비율: 33% (의존 관계 점프 버튼 & 메모 편집 텍스트에어리어)

  [탭 2: 실시간 데이터 흐름 (tab-flow-monitor)]
  - monitor-control-bar — 위치: top | 높이: 52px (필터, 검색, 시뮬레이터 옵션, 기록 제어 버튼군)
  - monitor-split-view — 위치: center | 높이: flex-1
    - monitor-logs-list — 위치: left | 비율: 50% (타임라인 로그 항목 리스트)
    - monitor-json-viewer — 위치: right | 비율: 50% (선택된 로그의 JSON 구문 강조 및 클립보드 복사 버튼)

  [탭 3: 설계 가이드북 (tab-docs-viewer)]
  - docs-sidebar — 위치: left | 너비: 320px (문서 선택 네비게이터)
  - docs-content-viewer — 위치: right | 너비: flex-1 (마크다운 파싱 HTML 문서 뷰어)
```
