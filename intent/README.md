# intent / spec / plan

작업 하나를 세 단계 문서로 기록한다. 세 문서는 같은 폴더에 둔다.

| 문서 | 담는 것 | 언제 |
|------|---------|------|
| `intent.md` | 왜 하는가, 누구에게 무엇이 바뀌는가, 제약, **미결 사항(Open questions)** | 착수 전 |
| `spec.md` | 확정된 내용 — 이 저장소에서는 커리큘럼, 모듈 구성, 모듈별 슬라이드 목차 | Open questions 해소 후 |
| `plan.md` | 만드는 순서, 산출물 위치, 검수 방법 | spec 승인 후 |

## 폴더 구조

```
intent/
└── <분류>/
    └── <slug>/
        ├── intent.md
        ├── spec.md
        └── plan.md
```

| 분류 | 쓰임 |
|------|------|
| `course` | 교육 과정 전체에 걸친 결정 (대상, 범위, 커리큘럼) |
| `module` | 모듈 하나에 한정된 결정 — 모듈이 커져 별도 결정이 필요할 때만 만든다 |

## front matter

```yaml
---
title: 문서 제목
status: draft            # draft → approved
category: course         # 분류 폴더명
originated: YYYY-MM-DD   # 작업이 처음 제기된 날
written: YYYY-MM-DD      # 이 문서를 쓴 날
approved:                # 사용자가 승인한 날
author: Seonghyeon Lee
drafted-by: Claude
---
```

## 목록

| 분류 | slug | intent | spec | plan |
|------|------|--------|------|------|
| course | `hadoop-eco-ops` | draft | draft | - |
