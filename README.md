# Hadoop eco 운영 교육자료

현재 운영 중인 **as-is Hadoop eco 시스템**의 데이터 파이프라인(Airflow · Spark · Hive · Iceberg)을 운영 담당자에게 가르치는 교육자료다. 교육 내용은 ① 구조와 개념 ② 모니터링 ③ 장애 대응이다.

메인 산출물은 PowerPoint(`.pptx`)이고, HTML은 이해를 돕는 보조 자료다. 이 사이트에는 설계 문서와 HTML 샘플을 게시한다.

## 대상 시스템

| 구성 | 버전 |
|------|-----|
| Airflow | 2.7.1 (CeleryExecutor) |
| Spark | 3.5.2 on YARN |
| Hive · Tez | 3.1.2 · 0.10.1 |
| Hadoop (HDFS · YARN) | 3.2.3 |
| Iceberg | 1.6.1 (카탈로그 Hive Metastore, HDFS, Parquet) |

## 발표 샘플

| 자료 | 내용 |
|------|------|
| [HTML 발표 샘플](samples/hadoop-eco-ops-sample.html) | spec 102장 중 일부를 동적 발표 형태로 만든 샘플. 완성본이 아니며 계속 수정한다 |
| [archify 도식 샘플](samples/hadoop-eco-ops-archify.html) | [archify](https://github.com/tt-a1i/archify)로 만든 Airflow 프로세스 구성과 재시작 범위 도식. 입력 JSON은 `samples/archify/airflow-processes.json` |

HTML 발표 샘플 조작법: `→` / `Space` 다음 단계, `←` 이전 단계, `O` 전체 슬라이드 보기, `N` 발표 메모, `F` 전체 화면. 휴대폰에서는 좌우로 밀어 넘긴다.

archify 도식 샘플에는 archify 렌더러 코드가 들어 있다 — MIT License, Copyright (c) 2026 tt-a1i (Archify), Copyright (c) 2025 Cocoon AI.

## 설계 문서

| 문서 | 내용 |
|------|------|
| [작업 규칙](CLAUDE.md) | 교육 범위, 독자와 대응 범위, 작성·사실 출처·산출물 규칙 |
| [교육 과정 intent](intent/course/hadoop-eco-ops/intent.md) | 배경, 제약, 미결 사항 |
| [커리큘럼 spec](intent/course/hadoop-eco-ops/spec.md) | 학습 목표, 모듈 구성, 슬라이드 목차 |
| [intent · spec · plan 작성 규칙](intent/README.md) | 문서 단계와 front matter |

## 사이트 빌드

`main` 브랜치에 push하면 GitHub Actions가 MkDocs로 사이트를 빌드해 GitHub Pages에 배포한다. 로컬 미리보기는 다음과 같다.

```bash
pip install -r requirements-docs.txt
mkdocs serve
```
