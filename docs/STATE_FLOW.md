# STATE_FLOW.md

AI가 상태·흐름·파일 작업 지도를 유지하는 문서.

---

## 0) 빠른 라우팅 맵 (항상 최상단 유지)

| 지시/키워드                          | 1차 Read                            | 1차 Change                                                                                                         | 2차 후보                                                                                            |
| ------------------------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| API 통신 추적 & 지연/에러 시뮬레이션 | `src/utils/flowTracker.ts`          | `src/utils/api.ts`                                                                                                 | `src/dev-console/components/FlowMonitor.tsx`                                                        |
| 전역 상태 및 스토어 액션             | `src/stores/createStore.ts`         | `src/stores/demoStore.ts`                                                                                          | -                                                                                                   |
| 아키텍처 노드 배치 및 드래그         | `src/dev-console/architectureDb.ts` | `src/dev-console/components/TopologyMap.tsx`<br>`MapNodeCard.tsx`<br>`MapConnections.tsx`<br>`MapControlPanel.tsx` | `src/dev-console/components/InspectorPanel.tsx`<br>`FileInspector.tsx`<br>`ConnectionInspector.tsx` |
| 설계 가이드북 문서 파싱              | `docs/PLAN.md`                      | `src/dev-console/components/DocsViewer.tsx`                                                                        | -                                                                                                   |

---

## 1) 파일 인벤토리 (핵심)

| File                                           | Owns state                                                                           | Sets/updates                                                                                                              | Reads/consumes                                            | Hooks                | Side effects                                                 | Related IDs                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `src/utils/flowTracker.ts`                     | `events` (로그목록)<br>`simulateLatency`<br>`simulateError`                          | `addEvent()`<br>`logApiStart/Success/Failure/Abort()`<br>`logStateChange()`/`logCustom()`                                 | `FlowMonitor.tsx`<br>`api.ts` (시뮬레이션 동작 검사)      | -                    | `localStorage` 에 시뮬레이션 플래그 캐싱                     | `monitor-control-bar`<br>`monitor-logs-list`  |
| `src/stores/demoStore.ts`                      | `counter`<br>`user` (로그인 정보)<br>`settings` (테마, 알림)                         | `increment()`, `decrement()` 스토어 액션<br>`login()`, `logout()` 스토어 액션<br>`toggleTheme()`, `toggleNotifications()` | `createStore.ts` (State Diff 추출)<br>구독 컴포넌트       | `demoStore.useStore` | 상태 업데이트 시 `flowTracker.logStateChange()` 자동 유발    | -                                             |
| `src/dev-console/components/TopologyMap.tsx`   | `positions` (노드 좌표)<br>`selectedPath` (선택 노드)<br>`hoveredPath` (마우스 호버) | 드래그 앤 드롭 이동<br>노드 클릭 / 마우스 호버 진입                                                                       | `canvas-viewport` (SVG 선 드로잉)<br>`InspectorPanel.tsx` | `useRef`             | 드래그 완료 시 `localStorage` 에 좌표 JSON 직렬화 저장       | `canvas-viewport`<br>`drawer-inspector-panel` |
| `src/dev-console/components/FileInspector.tsx` | `comment` (학습 노트 메모)<br>`saveStatus` (저장됨 문구)<br>`selectedDetail` (상세)  | 메모 입력 텍스트 변경<br>세부 항목 클릭                                                                                   | `inspector-spec-col3`                                     | `useRef`             | 입력값 `localStorage` 의 `node_memo_<path>` 키값에 자동 저장 | `inspector-spec-col3`                         |
| `src/dev-console/components/DocsViewer.tsx`    | `selectedDoc` (문서 메타)<br>`content` (텍스트)<br>`isLoading` / `error`             | 문서 탭 선택<br>비동기 파일 수신 완료                                                                                     | `docs-content-viewer`                                     | `useEffect`          | `fetch(selectedDoc.path)`로 서버에서 로컬 마크다운 파일 요청 | `docs-sidebar`<br>`docs-content-viewer`       |

---

## 2) 상태·훅 흐름 블록 (필요 최소만)

### `flow-tracker-events`

- **Source of truth**: `src/utils/flowTracker.ts`
- **Updated by**: `api.ts` (네트워크 통신), `createStore.ts` (전역 스토어 상태 변경)
- **Flows to**: `FlowMonitor.tsx` (이벤트 뷰어 리스트)
- **Read-only consumers**: `FlowMonitor.tsx`
- **Side effects**: 없음
- **Read first**: `src/utils/flowTracker.ts`
- **Change first**: `src/utils/api.ts`

### `network-simulation-flags`

- **Source of truth**: `src/utils/flowTracker.ts`
- **Updated by**: `FlowMonitor.tsx` (체크박스 클릭)
- **Flows to**: `api.ts` (fetch 수행 전 지연 대기 및 에러 던지기)
- **Read-only consumers**: `api.ts`
- **Side effects**: `localStorage.setItem('flow_sim_latency' / 'flow_sim_error')`
- **Read first**: `src/utils/flowTracker.ts`
- **Change first**: `src/dev-console/components/FlowMonitor.tsx`

### `demo-store-state`

- **Source of truth**: `src/stores/demoStore.ts` (경량 store 인스턴스)
- **Updated by**: `demoActions`
- **Flows to**: 구독중인 컴포넌트
- **Read-only consumers**: 구독중인 컴포넌트
- **Side effects**: `flowTracker.logStateChange()` 로깅 수행
- **Read first**: `src/stores/demoStore.ts`
- **Change first**: 스토어 상태 변경 유발 컴포넌트

---

## 3) 작업 후 갱신 체크 (AI용)

- [x] 상태 소유 위치 변경
- [x] 업데이트 트리거 변경
- [x] 훅 의존/소비 변경
- [x] API/스토리지/구독 부수효과 변경
- [x] 1차 Read/Change 파일 변경
