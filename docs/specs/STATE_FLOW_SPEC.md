# STATE_FLOW_SPEC.md

## 목적

AI가 상태/훅/부수효과와 Read/Change 파일 지도를 유지.

## 포함

- 빠른 라우팅 맵(지시 -> 1차 Read/Change)
- 파일 인벤토리(File, Owns, Sets, Reads, Hooks, Side effects, Related IDs)
- 상태/훅 흐름 최소 블록

## 제외

- UI 서사
- 레이아웃 설명
- 기능 설명 장문

## 갱신 트리거

- 상태 소유 위치 변경
- 업데이트 트리거 변경
- 훅 의존/소비 변경
- API/스토리지/구독 부수효과 변경
- 1차 Read/Change 파일 변경

## 필수 프로토콜 (항상 적용)

- 코드 변경 작업 종료 전, 위 5개 트리거를 체크리스트로 점검한다.
- 하나라도 해당하면 `docs/STATE_FLOW.md`를 같은 작업에서 갱신한다.
- 해당 없음이면 최종 보고에 "STATE_FLOW 영향 없음(점검 완료)"를 명시한다.
- 갱신 시 `0) 빠른 라우팅 맵`과 `1) 파일 인벤토리`를 먼저 맞추고, 필요 시 `2) 상태·훅 흐름 블록`을 갱신한다.

## 작성 규칙

- 저토큰 우선: 긴 설명보다 표를 우선.
- Read/Change는 실제 수정 가능성이 높은 파일부터 순서화.
- Related IDs는 STRUCTURE/FUNCTION ID와 일치.

## 권장 예문

| 지시/키워드 | 1차 Read                 | 1차 Change                   | 2차 후보                           |
| ----------- | ------------------------ | ---------------------------- | ---------------------------------- |
| 목록 필터   | `src/pages/ListPage.tsx` | `src/hooks/useListFilter.ts` | `src/components/ListFilterBar.tsx` |

체크리스트 예문:

- [x] 상태 소유 위치 변경
- [ ] 업데이트 트리거 변경
- [x] 훅 의존/소비 변경
- [ ] API/스토리지/구독 부수효과 변경
- [x] 1차 Read/Change 파일 변경
