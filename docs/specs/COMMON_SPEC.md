# COMMON_SPEC.md

## 공통 규칙

- 실사용 문서(`PLAN/STRUCTURE/FUNCTION/DESIGN/STATE_FLOW`)에는 긴 규칙 설명을 넣지 않는다.
- 파일 경로는 저장소 루트 기준(`src/...`)으로 표기한다.
- ID는 `kebab-case`를 권장한다. 예: `header-search-submit`
- 문서와 코드가 충돌하면 해당 영역의 스펙 문서와 실사용 문서를 우선 정렬한다.
- 변경이 있으면 코드와 문서를 같은 작업 단위에서 동기화한다.
- 실사용 문서의 작성법/예문/체크리스트는 `docs/specs/`에만 유지한다.

## STATE_FLOW 강제 점검 규칙

모든 코드 변경 작업 종료 전에 아래 5개 항목을 점검한다.

1. 상태 소유 파일 변경
2. set/update 트리거 변경
3. 훅 의존/소비 관계 변경
4. API/스토리지/구독 부수효과 변경
5. 1차 Read/Change 파일 변경

운영 원칙:

- 하나라도 해당하면 `docs/STATE_FLOW.md`를 같은 작업에서 갱신한다.
- 해당 없음이면 최종 보고에 "STATE_FLOW 영향 없음(점검 완료)"를 명시한다.

## 역할 우선순위

- 기획: `PLAN.md`
- 레이아웃/영역: `STRUCTURE.md`
- 기능/동작: `FUNCTION.md`
- 시각 규칙: `DESIGN.md`
- 상태/흐름/파일 작업 지도: `STATE_FLOW.md`
