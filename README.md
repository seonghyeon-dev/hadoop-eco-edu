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

## 발표 자료 (제작 중)

| 자료 | 내용 |
|------|------|
| [개념편](deck/hadoop-eco-ops-1.html) | 표지 · 목차와 01–05장(01 전체 구조, 02 Airflow, 03 머리글, 04 HDFS · Hive · Iceberg, 05 YARN · Spark · Tez). 03 DAG별 기능 내용은 내부에서 따로 만든다 |

조작법: `→` / `Space` 다음 단계, `←` 이전 단계, `D` 자세히(도식) · `Esc` 돌아오기, `O` 전체 슬라이드 보기, `N` 발표 메모(슬라이드 ID도 보인다), `F` 전체 화면.

## 발표 샘플

| 자료 | 내용 |
|------|------|
| [HTML 발표 샘플](samples/hadoop-eco-ops-sample.html) | 형식(HTML 개요 + 도식)을 검토하는 샘플 8장. 개요는 HTML 슬라이드로, 자세한 설명은 `D` 키로 archify 도식을 띄운다. 샘플일 뿐이며 내용은 다시 고친다 |

발표 샘플에 들어 있는 archify 도식은 따로 열어 볼 수도 있다.

| 도식 | 형식 | 쓰는 슬라이드 |
|------|------|------|
| [데이터가 테이블에 쌓이는 길](samples/archify/data-flow.html) | dataflow | M1-02 |
| [Airflow 프로세스 구성과 서버 배치](samples/archify/airflow-processes.html) | architecture | M2-06 ~ M2-09 |
| [Hive 적재 6단계](samples/archify/hive-batch.html) | workflow | M4-06 |
| [적재 중 조회 — Hive와 Iceberg](samples/archify/hive-iceberg-timeline.html) | timeline (예시 시각) | M4-09 |

HTML 발표 샘플 조작법: `→` / `Space` 다음 단계, `←` 이전 단계, `D` 자세히(archify 도식) · `Esc` 돌아오기, `O` 전체 슬라이드 보기, `N` 발표 메모, `F` 전체 화면. 휴대폰에서는 좌우로 밀어 넘긴다.

Apache Airflow · Spark · Hive · Tez · Iceberg · Hadoop 로고는 Apache Software Foundation의 상표이며, 각 프로젝트를 가리키는 용도로 쓴다(출처: `deck/logos/README.md`).

발표 자료의 아이콘은 [Lucide](https://lucide.dev)(ISC License, Copyright (c) 2026 Lucide Icons and Contributors)다 — `deck/icons/LICENSE`.

archify 도식(과 그것을 넣은 발표 샘플)에는 archify 렌더러 코드가 들어 있다 — MIT License, Copyright (c) 2026 tt-a1i (Archify), Copyright (c) 2025 Cocoon AI.

## 설계 문서

| 문서 | 내용 |
|------|------|
| [작업 규칙](CLAUDE.md) | 교육 범위, 독자와 대응 범위, 작성·사실 출처·산출물 규칙 |
| [교육 과정 intent](intent/course/hadoop-eco-ops/intent.md) | 배경, 제약, 미결 사항 |
| [커리큘럼 spec](intent/course/hadoop-eco-ops/spec.md) | 학습 목표, 모듈 구성, 슬라이드 목차 (79장) |
| [제작 plan](intent/course/hadoop-eco-ops/plan.md) | 산출물 위치, 제작 순서, 검수 방법 |
| [DAG별 기능 장 작업 안내](deck/DAG-작업안내.md) | 03 장을 외부 접속이 제한된 작업공간에서 만드는 방법 |
| [intent · spec · plan 작성 규칙](intent/README.md) | 문서 단계와 front matter |

## 사이트 빌드

`main` 브랜치에 push하면 GitHub Actions가 MkDocs로 사이트를 빌드해 GitHub Pages에 배포한다. 로컬 미리보기는 다음과 같다.

```bash
pip install -r requirements-docs.txt
mkdocs serve
```
