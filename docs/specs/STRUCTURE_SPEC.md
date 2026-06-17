# STRUCTURE_SPEC.md

## 목적

UI 영역/배치/대략 비율(레이아웃) 정의.

## 포함

- 화면 계층
- 영역 위치
- 크기/비율

## 제외

- 버튼 동작 상세
- 상태 흐름 상세

## 갱신 트리거

- 레이아웃 변경
- 영역 구조 변경

## 작성 규칙

- 각 영역은 고유 ID 사용(이후 FUNCTION과 연결).
- "위치 + 비율/크기"를 함께 기록.

## 권장 예문

```text
<app-shell>
- header-main — 위치: top | 높이: 56px
- body-main — 위치: below header | 비율: 30/70
  - panel-filter — 위치: left | 폭: 30%
  - panel-list — 위치: right | 폭: 70%
```
