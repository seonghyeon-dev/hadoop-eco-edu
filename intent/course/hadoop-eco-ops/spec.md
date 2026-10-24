---
title: Hadoop eco 운영 교육자료 — 커리큘럼
status: draft
category: course
originated: 2026-10-04
written: 2026-10-24
approved:
author: Seonghyeon Lee
drafted-by: Claude
---

# Spec: Hadoop eco 운영 교육자료 — 커리큘럼

> **초안 상태 안내.** `intent.md`의 Open questions가 아직 일부 열려 있는 상태에서 커리큘럼 뼈대를 먼저 합의하려고 쓴 초안이다. 미결 사항에 기대는 슬라이드는 `[확인 필요: …]`로, 사용자가 직접 쓰기로 한 DAG 동작 상세는 `[사용자 작성: …]`로 표시했고, 영향 범위는 끝의 "미결 사항 의존표"에 모았다.
>
> **2026-10-24 개정.** 사용자 결정 반영 — 당분간 HTML만으로 발표하고 도식은 시각화 도구(archify 기본, 필요하면 dashmotion 등)로 만든다. 사용자의 개요 검토(102장 → 79장)를 반영했다: M0 축소, Flower 화면 제외, 할 수 있는 조치만 다룸, Hive `_orc` 교체 방식 정정(비는 구간 없음), 프로세스별 역할 · 서버 배치 · Tez와 Spark 비교 추가, 슬라이드 표현 정리. 슬라이드 ID는 새 번호로 다시 매겼다.

## 1. 학습 목표

`intent.md`의 Proposed outcome을 모듈에 연결한 것이다. 슬라이드에는 쓰지 않는다(발표자용).

| # | 교육 후 할 수 있어야 하는 것 | 다루는 모듈 |
|---|------|------|
| 1 | 데이터가 들어와 테이블에 쌓이는 경로를 그림 한 장으로 설명한다 | M1 |
| 2 | Airflow 프로세스와 Spark · Tez · YARN · HDFS · Hive · Iceberg의 역할을 말한다 | M1–M4 |
| 3 | Hive와 Iceberg, Tez와 Spark의 차이와 전환의 득실을 말한다 | M3, M4 |
| 4 | Airflow UI · YARN UI · Spark UI에서 정상과 비정상을 구분한다 | M5 |
| 5 | Airflow log를 보고 증상을 1차 분류한다 | M6 |
| 6 | DAG 재실행과 Airflow 프로세스 재시작을 절차대로 수행한다 | M6 |
| 7 | 그 밖의 상황은 필요한 정보를 정리해 담당자에게 전달한다 | M6 |

## 2. 설계 결정

"확정"은 사용자 결정이고, 나머지는 Claude 제안이다(승인 필요).

| 결정 | 내용 | 이유 |
|------|------|------|
| 발표 형식 (**확정**) | HTML 슬라이드로 발표한다(파일을 회차별로 나눌지는 plan에서 정한다). 슬라이드에는 메시지와 요점을 → 키로 펼치고, 도식이 필요한 곳은 `D`(또는 '자세히')로 도식을 전체 화면으로 띄워 자세히 설명한다. 도식은 archify를 기본으로 하고, 움직임으로 보여 줘야 이해가 쉬운 흐름은 dashmotion 등 상황에 맞는 도구를 쓴다. 누르거나 끌어서 조작하는 시연은 HTML로, 화면 캡처는 이미지로 넣는다 | 사용자 결정 (2026-10-24). pptx는 필요해지면 전환한다 |
| 슬라이드 내용 (**확정**) | 슬라이드에는 듣는 사람에게 필요한 내용만 둔다. 대상 지칭(교육생 · 수강자 등), 교육 범위 설명("~는 보지 않는다"), 발표자용 근거는 발표 메모에만 둔다. "이 한 장만 보면 된다" 같은 구어 대신 제목다운 표현을 쓴다 | 사용자 결정 (2026-10-24) |
| 조치 범위 (**확정**) | 할 수 있는 조치(DAG 재실행, Airflow 프로세스 재시작, Airflow log 확인)만 다룬다. 금지 조치 목록 슬라이드는 두지 않는다. 조치의 안전 조건은 그 조치 절차 안에 둔다(예: worker 재시작 전 실행 중인 Spark Task 확인) | 사용자 결정 (2026-10-24) |
| Flower (**확정**) | Flower 화면은 다루지 않는다. flower는 프로세스 역할(M2-07)과 재시작 대상(M6-15)에만 나온다 | 사용자 결정 (2026-10-24) |
| as-is Hive 적재 (**정정**) | 6단계로 그린다: `_raw` Insert → `_temp` 비움 → 대상 날짜 select해 `_temp`(ORC) → `_orc` 기존 파일 목록 기록 → `hdfs mv` → 기록한 기존 파일 `hdfs rm`. `_orc`는 비지 않는다. Iceberg와의 차이는 "파일 작업 두 번에 나눠 바뀐다 vs commit 한 번에 바뀐다"로 보여 준다 | 사용자 정정 (2026-10-24) |
| 모듈 순서 | 구조(M1) → 개념(M2 Airflow, M3 Spark · Tez · YARN, M4 HDFS · Hive · Iceberg) → 모니터링(M5) → 장애 대응(M6) → 요약(M7) | 장애 대응은 "어느 부분의 문제인가"를 알아야 가능하다 |
| 개념의 깊이 | 화면에 나오는 용어까지 설명한다. 전환 비교(Hive → Iceberg, Tez → Spark)는 운영에서 달라지는 점 수준으로 다룬다 | 목표는 운영 |
| 이름이 겹치는 용어 | Airflow의 Task · Executor와 Spark의 task · executor를 구분하는 슬라이드를 둔다 (M3-09) | 가장 헷갈리는 지점 |
| 날짜 개념 | 처리 범위(PARAM)와 화면의 DAG Run 날짜(logical date)를 별도 슬라이드로 구분한다 (M2-03, M2-05) | 수동 Trigger한 DAG Run의 logical date는 버튼을 누른 시각이라, 화면 날짜로 처리 범위를 판단하면 틀린다 |
| job_history 소개 위치 | M2-04에서 소개하고 M4-15(동시 적재 재실행) · M6-11(재실행)에서 다시 쓴다 | 재실행이 안전한 이유가 job_history에 있다 |
| Tez | 이름 · 역할과 Spark와의 비교까지 다룬다 (M3-03~05). Tez UI는 다루지 않는다 | Hive 적재는 Hive SQL(Tez)로 한다(사용자 확인) |
| log | Spark UI · YARN UI에서 log를 여는 방법은 다루지 않는다. Airflow log는 "볼 곳"만 표시한다 (M6-04) | 사용자 결정(2026-10-04). "보지 않는다"는 문구는 슬라이드에 쓰지 않는다 |
| 장애 대응 구성 | 판단 흐름도 1장(M6-03)을 중심에 두고, 증상 분류 → 재실행 → 재시작 → 전달 순으로 펼친다 | 실제 대응 순서와 같게 |
| 모듈 정리 장 | M2 · M4 · M5 · M6 끝에 정리 1장씩 둔다. 작은 모듈(M1 · M3)은 두지 않는다 | 분량이 큰 모듈만 |
| 회차 | 2회차 제안 — 1회차: M0–M4(구조 · 개념), 2회차: M5–M7(모니터링 · 장애 대응) | `[확인 필요: 교육 총 시간 · 회차]` |
| 슬라이드 ID | `M<모듈>-<번호>`, 도식은 `D<번호>`(6절). 원고 · HTML · 도식이 같은 ID로 서로를 가리킨다 | 수정 요청과 검수 때 위치 지정 |

## 3. 비유 목록

`CLAUDE.md` 규칙대로, 비유와 함께 **실제 동작과 어긋나는 지점**을 슬라이드에 같이 적는다.

| 개념 | 비유 | 어긋나는 지점 |
|------|------|------|
| Airflow | 작업 일정표를 들고 지시하는 작업반장 | 반장은 상황을 보고 순서를 바꾸지만, Airflow는 DAG에 정해진 순서와 조건대로만 움직인다. 데이터는 직접 만지지 않는다 |
| DAG | 작업 순서도(레시피) | 레시피는 사람이 한 번 따라 하지만, DAG는 정해진 주기마다 반복 실행된다 |
| DAG Run | 그 순서도대로 한 번 돌린 기록 | 어느 범위의 데이터를 처리했는지는 DAG Run 날짜가 아니라 PARAM으로 정해진다 |
| PARAM | 작업 지시서의 "처리할 기간" 칸 | — |
| job_history | 적재 대장 — 데이터 건마다 처리 상태를 적어 두는 표. 비유: 택배 배송 조회표 | 택배는 사람이 조회만 하지만, job_history는 DAG가 직접 읽고 상태를 고쳐 쓴다. `[사용자 작성: 상태 값과 의미 — 건별 상태 방식이 아니면 표현 수정]` |
| CeleryExecutor | 반장(scheduler)이 작업 지시서를 꽂이(redis)에 꽂으면, 작업자(worker)가 하나씩 가져가 처리하고 결과를 작업 일지(PostgreSQL)에 적는다 | Spark · Hive SQL 작업이면 worker가 직접 계산하지 않는다. YARN에 맡기고 끝날 때까지 지켜본다 — 그래서 지켜보는 도중에 worker를 끄면 안 된다 |
| redis-sentinel | 꽂이(redis)를 지켜보는 당번 — 쓰던 꽂이가 망가지면 예비 꽂이로 바꿔 준다 | — |
| pgpool | 작업 일지(PostgreSQL) 창구 — 요청을 모아 받고, 일지 하나가 망가지면 다른 일지로 넘긴다 | — |
| YARN | 공용 작업장의 자리(장비) 배정 담당 | 실제로 나눠 주는 것은 자리가 아니라 CPU · 메모리 묶음(container)이다 |
| Spark | 큰 계산을 여러 사람이 나눠 처리하는 계산팀 (driver = 팀장, executor = 팀원) | 팀원 수와 역량은 실행 전에 정해지고, 실행 중에 바뀌지 않는다 (as-is는 dynamic allocation을 쓰지 않는다) |
| Tez | Hive SQL 주문서를 받아 실제 작업으로 바꿔 돌리는 또 다른 계산팀 | — |
| HDFS | 여러 창고에 나눠 보관하고 복사본을 두는 창고 시스템 | 한 파일도 조각(block) 단위로 쪼개져 여러 창고에 흩어진다 |
| hdfs mv | 서류를 옮기지 않고 캐비닛 이름표만 바꿔 다는 것 | — (HDFS의 이동은 실제로 파일을 복사하지 않아 빠르다) |
| Hive Metastore | 도서관 목록 카드 | 목록 카드가 사라지면 책(파일)은 있어도 찾지 못한다 — 비유와 일치. 목록 카드는 Oracle DB에 저장된다 |
| Hive 적재(as-is) | 새 서류는 임시 서랍(`_raw`)에 계속 쌓고, 정해진 때마다 해당 날짜 서류로 정리본(`_temp`)을 만든다. 캐비닛(`_orc`)에 있던 서류 목록을 적어 두고, 정리본을 먼저 넣은 뒤 적어 둔 옛 서류를 꺼내 버린다 | — |
| Iceberg 적재(as-is) | 새 서류만 장부에 덧붙이고 목록을 갱신한다 | 장부 자체도 파일로 저장된다. 장부가 쌓이면 정리(유지보수)가 필요하다 |
| snapshot | 적재가 끝날 때마다 찍는 테이블 전체 사진 | 사진은 내용을 복사하지만, snapshot은 파일을 복사하지 않고 "그 시점의 파일 목록"만 기록한다 |
| Compaction | 흩어진 작은 서류를 큰 묶음으로 다시 철하기 | — |

## 4. 모듈 구성

| 모듈 | 제목 | 장 수(안) | 회차(안) |
|------|------|------|------|
| M0 | 표지 · 목차 | 2 | 1 |
| M1 | 전체 구조 — 데이터가 흐르는 길 | 3 | 1 |
| M2 | Airflow — 언제, 무엇을, 어떤 순서로 | 11 | 1 |
| M3 | Spark · Tez와 YARN — 실제 계산과 자원 배분 | 9 | 1 |
| M4 | HDFS · Hive · Iceberg — 데이터가 쌓이는 곳 | 16 | 1 |
| M5 | 모니터링 — 화면에서 정상과 비정상 구분하기 | 14 | 2 |
| M6 | 장애 대응 — 확인하고, 조치하고, 전달한다 | 21 | 2 |
| M7 | 마무리 | 3 | 2 |
| | **합계** | **79** | |

레이아웃 이름은 `CLAUDE.md`의 표준 레이아웃(제목 슬라이드 / 제목 및 내용 / 구역 머리글 / 콘텐츠 2개 / 제목만 / 빈 화면)이다. HTML 슬라이드도 이 이름으로 형태를 정한다 — pptx로 전환할 때 그대로 짝지을 수 있게 하려는 것이다. 비고의 `D<번호>`는 6절의 도식이고, 슬라이드에는 그 요점만 HTML로 둔다.

## 5. 모듈별 슬라이드 목차

"메시지"는 그 슬라이드가 전달할 단 하나의 문장이다.

### M0. 표지 · 목차

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M0-01 | 제목 슬라이드 | Hadoop eco 데이터 파이프라인 운영 교육 | 버전 표기. Oracle DB 전환 후 상태 기준임은 발표 메모에만 |
| M0-02 | 제목만 | 구조 → 개념 → 모니터링 → 장애 대응 순서로 진행한다 | 목차. D01 |

### M1. 전체 구조 — 데이터가 흐르는 길

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M1-01 | 구역 머리글 | 전체 구조 | |
| M1-02 | 제목만 | 데이터는 Airflow의 지시로 Spark · Tez가 처리해 HDFS 위 테이블에 쌓인다 | **핵심 도식** D02. Airflow는 지시만 하고 데이터는 Airflow를 지나가지 않는다. `[확인 필요: 데이터 원천의 종류]` `[사용자 작성: Spark는 Iceberg 적재에만 쓰는지]` `[확인 필요: Oracle · Trino를 도식에 표시할지]` |
| M1-03 | 제목 및 내용 | 구성요소는 각각 한 가지 역할을 맡는다 | Airflow · YARN · Spark · Tez · HDFS · Hive Metastore · Iceberg의 역할 한 줄 + 비유(3절) |

### M2. Airflow — 언제, 무엇을, 어떤 순서로

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M2-01 | 구역 머리글 | Airflow | Airflow 2.7.1 |
| M2-02 | 제목만 | DAG는 Task를 순서대로 이은 작업 순서도이고, 정해진 주기마다 실행된다 | D05. 앞 Task가 성공해야 다음 Task가 시작된다(trigger rule 기본값). as-is는 `catchup=False` — 멈춰 있던 구간을 한꺼번에 실행하지 않는다 |
| M2-03 | 제목 및 내용 | DAG는 처리할 날짜 범위를 PARAM으로 받는다 | D06. `[사용자 작성: 스케줄 실행 때 범위가 정해지는 방식]` |
| M2-04 | 제목만 | get_jobs가 그 범위로 job_history를 조회해 처리할 데이터를 고른다 | D06. job_history는 Oracle에 있다 — 이름만. `[사용자 작성: 고르는 상태 값]` |
| M2-05 | 제목만 | 화면의 DAG Run 날짜(logical date)와 처리 범위는 다를 수 있다 | D07. 수동 Trigger한 DAG Run의 logical date는 버튼을 누른 시각 |
| M2-06 | 제목만 | Airflow는 서버 3대에 나뉜 여러 프로세스가 함께 움직인다 | D08. 서버 배치: worker.1 — webserver · scheduler · worker · flower · postgresql · pgpool · redis · redis-sentinel / worker.2 — webserver · scheduler · worker · postgresql · pgpool · redis · redis-sentinel / worker.3 — worker · postgresql · pgpool · redis · redis-sentinel |
| M2-07 | 제목 및 내용 | 실행을 맡는 프로세스 — webserver · scheduler · worker · flower | 프로세스별 역할 한 줄씩. webserver = Airflow UI 화면, scheduler = 언제 무엇을 실행할지 결정, worker = Task 실행(CeleryExecutor), flower = worker 상태 화면. 개수: webserver 2, scheduler 2, worker 3, flower 1 |
| M2-08 | 제목 및 내용 | 기록과 전달을 맡는 프로세스 — PostgreSQL · pgpool · redis · redis-sentinel | PostgreSQL = metadata DB(실행 기록), pgpool = PostgreSQL 앞단(HA · 커넥션 풀), redis = 작업 대기열(Celery broker), redis-sentinel = redis 감시와 자동 전환. 각 3개 |
| M2-09 | 콘텐츠 2개 | 프로세스마다 멈췄을 때의 증상이 다르다 | **HTML 시연** + D08. scheduler → 새 DAG Run · Task가 시작되지 않고 경고 배너 / webserver → 화면만 안 열림 / worker → Task가 queued에 머묾 / flower → Flower 화면만 안 열림 / redis → Task가 worker에 전달되지 않음 / PostgreSQL · pgpool → 화면과 scheduler 모두 오류. 같은 종류가 모두 멈췄을 때 기준. `[확인 필요: 운영에서 실제로 본 증상과 맞는지]` `[확인 필요: redis-sentinel이 멈췄을 때의 증상]` |
| M2-10 | 제목 및 내용 | Task 상태는 색으로 구분되고, 실패하면 정해진 횟수만큼 자동으로 다시 시도한다 | D09. success, running, queued, failed, upstream_failed, up_for_retry, skipped. 자동 재시도 중에는 기다린다 |
| M2-11 | 제목 및 내용 | 정리 | |

### M3. Spark · Tez와 YARN — 실제 계산과 자원 배분

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M3-01 | 구역 머리글 | Spark · Tez와 YARN | Hadoop 3.2.3(YARN), Spark 3.5.2, Hive 3.1.2, Tez 0.10.1 |
| M3-02 | 제목만 | Spark는 driver 하나가 여러 executor에게 계산을 나눠 맡긴다 | D10. 팀장/팀원 비유 + 어긋나는 지점. cluster 모드라 driver도 YARN 위에서 돈다 |
| M3-03 | 제목만 | Hive 적재는 Hive SQL을 Tez로 실행해서 한다 | D11. Tez = Hive SQL을 실제 작업으로 바꿔 돌리는 엔진 |
| M3-04 | 콘텐츠 2개 | Tez와 Spark는 실행 방식과 쓰임이 다르다 | D11. 비교: 무엇을 실행하나(Hive SQL / Spark 작업) · 적재 대상(as-is: Hive 테이블 / Iceberg 테이블) · YARN에서의 모습(TEZ / SPARK application). 일반 개념은 Spark 3.5 · Hive 3.1 문서 기준 |
| M3-05 | 제목 및 내용 | Tez에서 Spark로 옮기면 적재 엔진이 하나로 모인다 | 전환으로 얻는 것: 엔진 하나로 운영 · Iceberg 적재와 같은 엔진 · 모니터링 화면 통일(Spark UI). 비용도 함께. `[확인 필요: as-is에서 Tez → Spark 전환이 진행 · 계획 중인지 — Hive → Iceberg 전환과 같은 범위인지]` |
| M3-06 | 제목만 | YARN은 CPU · 메모리를 container로 나눠 주고, 모자라면 queue에서 기다리게 한다 | D12. ResourceManager, NodeManager, container. Spark와 Tez가 같은 자원을 나눠 쓴다. `[확인 필요: queue 구성]` |
| M3-07 | 제목만 | Airflow Task 하나가 YARN application 하나를 띄운다 | D13. SparkSubmitOperator → SPARK application / Hive SQL Task → TEZ application. worker는 끝날 때까지 지켜본다. `[사용자 작성: Hive SQL Task의 실행 방식(Operator), Task 하나에 application 하나인지]` |
| M3-08 | 제목만 | YARN application은 ACCEPTED → RUNNING → FINISHED 순서로 상태가 바뀐다 | D14. State와 FinalStatus(SUCCEEDED / FAILED / KILLED) 구분 |
| M3-09 | 콘텐츠 2개 | Airflow의 Task · Executor와 Spark의 task · executor는 이름만 같고 다른 것이다 | |

### M4. HDFS · Hive · Iceberg — 데이터가 쌓이는 곳

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M4-01 | 구역 머리글 | HDFS · Hive · Iceberg | |
| M4-02 | 제목만 | 테이블은 HDFS의 파일과 Hive Metastore의 목록이 합쳐진 것이다 | D03. HDFS는 파일을 조각내 복사본과 함께 보관한다. 목록은 Oracle DB에 저장된다 — 이름만 |
| M4-03 | 제목만 | Hive 테이블은 HDFS 폴더이고, `dt` 파티션은 날짜별 하위 폴더다 | D15. `_raw` · `_orc`는 `dt=YYYYMMDD` 파티션, `_temp`는 파티션 없음 |
| M4-04 | 콘텐츠 2개 | TEXT는 글자 그대로 저장하고, ORC는 열 단위로 압축해 빨리 읽게 저장한다 | `_raw` = TEXTFILE, `_temp` · `_orc` = ORC |
| M4-05 | 제목만 | Hive 데이터는 `_raw`와 `_orc`에 나뉘어 있다 — 최근 데이터는 `_raw`, 예전 데이터는 `_orc`에서 조회한다 | D16. `_raw`는 비우지 않고 retention 때만 과거 데이터를 지운다 |
| M4-06 | 제목만 | 새 데이터는 `_raw`에 계속 추가되고, 배치 주기마다 `_temp`를 거쳐 `_orc`의 파일과 교체된다 | **as-is 적재 6단계** D17: ① `_raw` Insert(항상) ② `_temp` 비움 ③ `_raw`에서 대상 날짜 select해 `_temp`(ORC)에 ④ `_orc` 기존 파일 목록 기록 ⑤ `hdfs mv`로 `_temp` 파일을 `_orc`에 ⑥ 기록한 기존 파일 `hdfs rm`. `_orc`는 비지 않는다. `[사용자 작성: ④에서 기록하는 범위]` `[사용자 작성: ⑤와 ⑥ 사이 조회 결과]` `[사용자 작성: 배치 주기]` |
| M4-07 | 제목만 | Iceberg 테이블은 파일 목록을 별도의 메타데이터 파일로 관리한다 | D03 · D19. 카탈로그 = Hive Metastore(목록이 메타데이터 파일 위치를 가리킨다), HDFS, Parquet, Iceberg 1.6.1 |
| M4-08 | 제목만 | Iceberg 적재는 새 데이터를 덧붙이고(append), 적재마다 snapshot이 하나 생긴다 | D19 · D20. snapshot 비유 + 어긋나는 지점 |
| M4-09 | 제목 및 내용 | Iceberg는 commit 한 번으로 새 데이터가 한꺼번에 보인다 | **HTML 시연**(조회 시각 비교) + D18. Hive `_orc`는 ⑤ · ⑥ 두 번의 파일 작업으로 바뀐다. 원자적 commit은 Iceberg 1.6 문서 기준 |
| M4-10 | 제목 및 내용 | Iceberg 테이블은 작은 파일 정리(Compaction)와 오래된 snapshot 정리가 필요하다 | `[사용자 작성: as-is에서 유지보수 작업을 하는지, DAG로 돌리는지]` — DAG라면 M5 · M6에서 다룸 |
| M4-11 | 제목 및 내용 | Hive와 Iceberg는 테이블 구성과 적재 방식이 다르다 | 비교 표: 엔진(Tez / Spark) · 테이블 수(`_raw` · `_temp` · `_orc` / 1개) · 파일 형식(TEXTFILE · ORC / Parquet) · 조회 대상(최근 · 예전이 나뉨 / 하나) · 적재 방식(주기적 교체 / append) · 바뀌는 방식(파일 작업 두 번 / commit 한 번) · 이력(없음 / snapshot) · 유지보수 |
| M4-12 | 제목 및 내용 | Iceberg로 옮기면 테이블 하나로 조회하고, 변환 · 교체 단계 없이 바로 반영된다 | 전환으로 얻는 것: 조회 대상 하나 · ORC 변환 배치 없음 · commit 단위 반영 · snapshot 이력. Iceberg 1.6 문서 기준 |
| M4-13 | 제목 및 내용 | 대신 유지보수 작업과 새로 익힐 운영 방법이 생긴다 | 전환 비용 |
| M4-14 | 제목만 | 전환 과도기라 일부 테이블은 Hive와 Iceberg에 함께 쌓는다 | D21. `[확인 필요: 대상 테이블, 동시 적재 이유, Hive 적재 종료 시점]` |
| M4-15 | 제목 및 내용 | 동시 적재 테이블은 한쪽만 실패해도 Trigger 재실행으로 복구하고, job_history 덕분에 중복 적재되지 않는다 | D06 · D21. Hive 변환 배치도 job_history를 쓴다(사용자 확인) |
| M4-16 | 제목 및 내용 | 정리 | |

### M5. 모니터링 — 화면에서 정상과 비정상 구분하기

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M5-01 | 구역 머리글 | 모니터링 | |
| M5-02 | 제목만 | 화면은 Airflow UI → YARN UI → Spark UI 순서로 본다 | D04. 화면별 역할: 무엇이 언제 / 자원 · 실행 상태 / 진행 상황 |
| M5-03 | 제목 및 내용 | 화면 접속 주소 | `[확인 필요: URL, 로그인 방식, 마스킹 여부]` |
| M5-04 | 제목만 | DAGs 목록 화면에서 최근 실행 결과를 한눈에 보고, 위쪽 경고로 Airflow 자체 문제를 알아챈다 | 캡처. Runs · Recent Tasks 원, Next Run, scheduler 경고 배너 |
| M5-05 | 제목만 | Grid 화면은 행이 Task, 열이 DAG Run, 색이 상태다 | 캡처 + 읽는 법 표시 |
| M5-06 | 제목만 | Task를 누르면 상세와 Log를 볼 수 있다 | 캡처. 메뉴 경로는 2.7.1 실제 화면으로 확정 |
| M5-07 | 제목만 | Browse > Task Instances에서 상태별로 Task를 모아 본다 | 실패 Task 찾기와 M6-16 "실행 중 Task 확인"에 같은 화면을 쓴다. Hostname 열로 어느 서버의 worker인지 본다 |
| M5-08 | 제목 및 내용 | 비정상 신호 | queued에 오래 머묾 / running이 평소보다 김 / failed · upstream_failed. `[확인 필요: "평소" 소요 시간 기준]` |
| M5-09 | 제목만 | YARN UI의 Applications 목록에서 상태와 시각을 보고, 종류로 Spark와 Tez를 구분한다 | 캡처. Application Type(SPARK / TEZ), State, FinalStatus, Queue, Start / Finish |
| M5-10 | 제목 및 내용 | ACCEPTED에 오래 머물러 있으면 자원을 기다리는 중이다 | D12 · D14 |
| M5-11 | 제목만 | Airflow log의 application ID로 YARN에서 해당 작업을 찾는다 | D13. `application_…` ID 위치는 캡처로 확정. `[사용자 작성: Hive SQL Task log에도 application ID가 찍히는지]` |
| M5-12 | 제목만 | Spark UI는 YARN UI의 링크로 들어가고, 진행률 · 소요 시간 · 실패 개수를 본다 | 실행 중: ApplicationMaster / 종료 후: History(Spark History Server 운영). Jobs · Stages 캡처 |
| M5-13 | 제목 및 내용 | 매일 점검 순서 | 체크리스트. `[확인 필요: 점검 시각, 핵심 DAG 목록]` |
| M5-14 | 제목 및 내용 | 정리 | |

### M6. 장애 대응 — 확인하고, 조치하고, 전달한다

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M6-01 | 구역 머리글 | 장애 대응 | |
| M6-02 | 제목 및 내용 | 장애 대응은 확인 → 조치 → 전달 순서로 한다 | 조치 = DAG 재실행, Airflow 프로세스 재시작 |
| M6-03 | 제목만 | 증상을 보고 이 흐름도를 따라간다 | **핵심 도식** D22 + **HTML 시연**(질문에 답하면 분류와 조치가 나온다) |
| M6-04 | 제목만 | Airflow log는 맨 아래 에러부터 거꾸로 읽고, 표시한 곳만 본다 | 캡처에 볼 곳 표시: Task 시작 · 종료, application ID, 최종 결과 줄, 시도 번호(try) |
| M6-05 | 제목 및 내용 | 분류 1 — Spark · Hive SQL 작업 실패: YARN 상태를 확인하고 전달한다 | `[확인 필요: as-is 대표 log 문구]` |
| M6-06 | 제목 및 내용 | 분류 2 — 자원 대기 · 시간 초과: 다른 작업이 끝나기를 기다린다 | `[확인 필요: 기다리는 한도, 전달 시점]` |
| M6-07 | 제목 및 내용 | 분류 3 — 연결 실패: 잠시 뒤 재실행하고, 반복되면 전달한다 | DB, Metastore 등. `[확인 필요: as-is 대표 log 문구]` |
| M6-08 | 제목 및 내용 | 분류 4 — 입력 데이터 미도착: 원천 담당에게 전달한다 | `[확인 필요: as-is에 해당 유형이 있는지]` |
| M6-09 | 제목 및 내용 | 분류 5 — Airflow 자체 문제: Airflow 프로세스면 재시작하고, 그 밖의 프로세스면 전달한다 | D08. M2-09 증상과 연결 — scheduler 경고, queued 적체, 화면 접속 불가. "그 밖" = PostgreSQL · pgpool · redis · redis-sentinel |
| M6-10 | 제목 및 내용 | `_orc` 교체 도중 배치가 실패했을 때 | D17. `[사용자 작성: ⑤ 전 · ⑤와 ⑥ 사이에 실패했을 때의 상태와, 같은 날짜로 Trigger 재실행하면 복구되는지]` |
| M6-11 | 제목 및 내용 | 실패한 DAG는 처리 범위를 PARAM에 넣어 Trigger DAG로 다시 실행한다 | D06. 성공했던 Task까지 처음부터 다시 돌지만 job_history 덕분에 중복 적재되지 않는다(사용자 확인) |
| M6-12 | 제목만 | 처리 범위는 get_jobs Task log에서, 실패 내용은 Hive SQL · Spark Task log에서 확인한다 | 캡처에 해당 줄 표시. `[사용자 작성: get_jobs log에서 범위가 찍히는 줄]` |
| M6-13 | 제목만 | Trigger DAG 절차 | 캡처 단계별: Trigger DAG → PARAM 필드에 날짜 범위 입력 → 실행. 여러 날짜가 실패했으면 그 날짜들을 덮는 범위로. `[사용자 작성: PARAM 필드 이름 · 입력 형식, DAG마다 같은지]` |
| M6-14 | 제목 및 내용 | 이런 경우에는 Trigger하지 않고 전달한다 | 같은 DAG가 아직 실행 중일 때, 재실행 후 같은 증상으로 다시 실패했을 때. `[확인 필요: 원인과 무관하게 Trigger해도 되는지, 횟수 제한]` |
| M6-15 | 제목 및 내용 | 재시작하는 프로세스는 worker · scheduler · webserver · flower이고, 하나씩 지정해서 재시작한다 | D08 · D23. M2-09 증상 → 재시작할 프로세스. 서버 배치(M2-06)로 어느 서버에서 재시작하는지 안내 |
| M6-16 | 제목만 | worker는 실행 중인 Spark Task가 없을 때 재시작한다 | D23. Browse > Task Instances에서 running인 Spark Task(SparkSubmitOperator)와 Hostname을 본다(M5-07). 있으면 재시작하지 않고 전달. `[확인 필요: 실행 중인 Hive SQL Task도 같은 조건인지]` `[확인 필요: 재시작할 worker의 서버에서 도는 Task만 보면 되는지]` |
| M6-17 | 제목 및 내용 | 재시작 명령어 | 프로세스별 명령어 — ansible playbook(대상 지정) 또는 systemctl. `[명령어: 사용자 기재]` + 성공 시 화면(기대 출력). `[확인 필요: playbook과 systemctl 중 하나만 다룰지]` |
| M6-18 | 제목 및 내용 | 재시작 후에는 세 가지를 확인한다 | 경고 배너 사라짐, 새 DAG Run 생성, queued 해소 |
| M6-19 | 제목 및 내용 | 전달할 때는 이 항목을 채운다 | 전달 양식: DAG 이름, 처리 범위(PARAM), Task, 시도 번호, 시각, 상태, log 에러 부분, YARN application ID · 상태, 이미 한 조치. `[확인 필요: 전달 대상 · 채널]` |
| M6-20 | 제목만 | 사례 연습 | `[확인 필요: 과거 장애 사례]` — 사례 수만큼 장 수 늘어남 |
| M6-21 | 제목 및 내용 | 정리 | |

### M7. 마무리

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M7-01 | 제목만 | 장애 대응 요약 | 흐름도(D22) + 조치 절차 + 전달 양식 요약. 인쇄용 한 장도 HTML로 |
| M7-02 | 제목 및 내용 | 용어집 | 이 과정에서 나온 용어 한 줄 정의. 검색 가능 |
| M7-03 | 제목 및 내용 | 질의응답 | |

## 6. 도식 목록 (안)

5절 비고의 `D<번호>`다. 도식 하나를 여러 슬라이드에서 함께 쓴다. archify에는 슬라이드별로 일부만 강조하는 기능이 없으므로(3.2.0), 강조는 슬라이드의 HTML 요점이 맡고 도식은 전체를 보여 준다. 발표 중에는 archify의 '경로'(두 상자 사이 길만 강조)와 Live 흐름 애니메이션을 쓸 수 있다. "dashmotion 후보"는 요청 · 데이터가 이동하는 모습을 움직임으로 보여 주면 이해가 쉬운 도식이다 — 도구는 만들 때 정한다.

**사실 근거** — 확정: 사용자 제공 as-is 사실 / 일반: Airflow 2.7 · Spark 3.5 · Hive 3.1 · Iceberg 1.6 · Hadoop 3.2 문서의 일반 개념 / 사용자 작성 · 확인 필요: 그 내용이 들어올 때까지 도식에 자리표시자를 남긴다.

| ID | 도식 | 형식 | 쓰는 슬라이드 | 사실 근거 | 상태 |
|----|------|------|------|------|------|
| D01 | 과정 지도 — 모듈 순서와 회차 | archify workflow | M0-02, 구역 머리글 | 확정(4절) · 회차는 확인 필요 | |
| D02 | 데이터 흐름 — 원천 → 실행 → 1차 적재 → ORC 변환 → 조회 대상 | archify dataflow · dashmotion 후보 | M1-02 | 확정 · 원천은 확인 필요, Spark 용도는 사용자 작성 | 샘플 `data-flow` |
| D03 | 테이블 = 파일 + 목록 — Hive Metastore, HDFS 파일, Iceberg 메타데이터 파일 | archify architecture | M4-02, M4-07 | 확정(카탈로그 HMS · HDFS) + 일반 | |
| D04 | 화면 지도 — Airflow UI → YARN UI → Spark UI | archify architecture | M5-02 | 확정(도구 목록) + 일반 | |
| D05 | DAG 예시 — Task 순서와 get_jobs · Hive SQL · Spark Task | archify workflow | M2-02 | 사용자 작성(DAG 구성) | |
| D06 | PARAM → get_jobs → job_history → 처리 대상 → 상태 기록 | archify dataflow | M2-03, M2-04, M4-15, M6-11 | 사용자 작성(PARAM · job_history 상태) | |
| D07 | DAG Run 날짜(logical date)와 처리 범위(PARAM)의 차이 | archify timeline (예시 시각) | M2-05 | 일반 + 확정(수동 Trigger) | |
| D08 | Airflow 프로세스 구성 · 서버 3대 배치 · 재시작 범위 | archify architecture · dashmotion 후보(scheduler → redis → worker) | M2-06 ~ M2-09, M6-09, M6-15 | 확정 | 샘플 `airflow-processes`(서버 배치 · redis-sentinel 추가 필요) |
| D09 | Task 상태 전이 — queued → running → success / failed / up_for_retry | archify lifecycle | M2-10 | 일반 | |
| D10 | Spark 작업 구성 — driver 하나와 executor 여럿 | archify architecture | M3-02 | 일반 + 확정(cluster 모드, dynamic allocation 안 씀) | |
| D11 | Tez와 Spark — Hive SQL → TEZ application / Spark 작업 → SPARK application | archify architecture | M3-03, M3-04 | 일반 + 확정(Hive 적재 = Tez, Iceberg 적재 = Spark) | |
| D12 | YARN 자원 배분 — ResourceManager · NodeManager · container · queue | archify architecture | M3-06, M5-10 | 일반 · queue 구성은 확인 필요 | |
| D13 | Airflow Task → YARN application | archify sequence · dashmotion 후보 | M3-07, M5-11 | 확정(SparkSubmitOperator · cluster) · Hive SQL Task 방식은 사용자 작성 | |
| D14 | YARN application 상태 — ACCEPTED → RUNNING → FINISHED, FinalStatus | archify lifecycle | M3-08, M5-10 | 일반 | |
| D15 | Hive 테이블 폴더 — 테이블 = 폴더, `dt` 파티션 = 하위 폴더 | archify tree (예시 경로) | M4-03 | 확정(파티션) · 실제 경로는 확인 필요 | |
| D16 | 조회하는 쪽에서 본 Hive — 최근은 `_raw`, 예전은 `_orc` | archify architecture | M4-05 | 확정 | |
| D17 | Hive 적재 6단계 | archify workflow | M4-06, M6-10 | 확정 · 기록 범위 · ⑤와 ⑥ 사이 · 배치 주기는 사용자 작성 | 샘플 `hive-batch` |
| D18 | 적재 중 조회 — Hive `_orc`의 ⑤ · ⑥과 Iceberg commit | archify timeline (예시 시각) | M4-09 | 확정 + 일반(원자적 commit) | 샘플 `hive-iceberg-timeline` |
| D19 | Iceberg 메타데이터와 snapshot — metadata 파일 → manifest → 데이터 파일 | archify tree | M4-07, M4-08 | 일반 | |
| D20 | Iceberg 적재 — 새 데이터 append, snapshot 하나 추가 | archify workflow | M4-08 | 확정 + 일반 | |
| D21 | Hive · Iceberg 동시 적재 | archify dataflow | M4-14, M4-15 | 확인 필요(대상 테이블 · 이유 · 종료 시점) | |
| D22 | 장애 대응 판단 흐름도 — 증상 → 화면 확인 → 분류 → 조치 또는 전달 | archify workflow | M6-03 ~ M6-10, M7-01 | 장애 사례 · 대표 log 확인 필요 | |
| D23 | worker 재시작 판단 — 실행 중인 Spark Task 확인 → 재시작 또는 전달 | archify workflow | M6-15, M6-16 | 확정 · Hive SQL Task 조건 · 서버별 확인 기준은 확인 필요 | |

"샘플"은 형식만 확인한 것이고 내용은 본 제작 때 다시 쓴다.

**HTML로 만드는 것** — 도식 도구가 아니라 HTML 슬라이드 안에서 만든다.

| 무엇 | 쓰는 슬라이드 | 이유 |
|------|------|------|
| 멈춘 프로세스 시연 — 누르면 증상이 바뀐다 | M2-09 | 조작 시연 (D08을 함께 띄운다) |
| 조회 시각 비교 시연 — 끌어서 Hive · Iceberg 결과를 비교한다 | M4-09 | 조작 시연 (D18을 함께 띄운다) |
| 장애 판단 따라가기 — 질문에 답하면 분류와 조치(또는 전달 양식)가 나온다 | M6-03 | 조작 시연 (D22를 함께 띄운다) |
| Tez · Spark 비교, Hive · Iceberg 비교 | M3-04, M4-11 | 도식이 아니라 표 |
| 장애 대응 요약 · 용어집 — 인쇄 가능한 한 장 + 검색 | M7-01, M7-02 | 교육 후 곁에 두는 자료 |
| 화면 캡처와 그 위의 표시 | M5 전체, M6-04, M6-12, M6-13 | 캡처는 이미지 |

공유 방식: GitHub Pages 게시 + 단일 파일 전달 가능 (2026-10-22). 도식은 발표 HTML 안에 넣어 파일 하나로 유지한다(`samples/archify/embed.py`).

## 7. 실습

`[확인 필요: 실습 포함 여부]` — 포함한다면 제안은 다음과 같다. 모두 **읽기 전용 조회**이고, 조치 실습은 운영 환경에서 하지 않는다.

- 2회차 M5 끝: 실제 Airflow UI에서 오늘 실패한 Task 찾기 → log 열기 → YARN에서 해당 application 찾기
- 2회차 M6 끝: 과거 장애 사례 log를 보고 분류하고, get_jobs log에서 처리 범위를 찾아 전달 양식 채우기 (M6-20)

## 8. 미결 사항 의존표

**해소됨 (2026-10-04 · 10-08)** — 재실행 방식(Trigger + PARAM 날짜 범위), 처리 범위 확인 위치(get_jobs log), SparkSubmitOperator · cluster 모드, Hive 적재 = Hive SQL(Tez), CeleryExecutor와 프로세스 목록 · 개수, job_history로 중복 적재 없음, 재시작 허용 범위, worker 재시작 전 확인, log 경계, 버전, catchup = False, dynamic allocation 안 씀, Spark History Server 운영, Iceberg 구성(HMS · HDFS · Parquet), Hive 테이블 형식 · 파티션. 상세는 `intent.md` Constraints.

**해소됨 (2026-10-24)**

- Hive `_orc` 교체 = 기존 파일 목록 기록 → `hdfs mv` → 기존 파일 `hdfs rm`. 비는 구간 없음(정정)
- Airflow 서버 배치 = 3대(worker.1 · worker.2 · worker.3), redis-sentinel 추가. redis-sentinel은 재시작하지 않고 전달한다
- Flower 화면 제외, 할 수 있는 조치만 다룸(장애 대응 경계 표 · 금지 조치 슬라이드 없음), 슬라이드 표현 규칙
- 발표 형식 = HTML, 도식 = archify 기본 + dashmotion 등

**남은 미결 사항**

| 미결 사항 | 영향받는 슬라이드 | 답에 따라 바뀌는 것 |
|------|------|------|
| 교육 총 시간 · 회차 · 실습 | 2절 회차, 4절 장 수, 7절 | 모듈 분할, 슬라이드 수 |
| 데이터 원천의 종류 | M1-02 | 핵심 도식 |
| Oracle · Trino 도식 표시 여부 | M1-02 | 핵심 도식 |
| Tez → Spark 전환이 진행 · 계획 중인지 | M3-05 | 전환 이점 서술 |
| queue 구성 | M3-06 | YARN 도식 |
| 동시 적재 테이블 · 이유 · 종료 시점 | M4-14 | "과도기" 서술 |
| 접속 URL · 점검 기준 | M5-03, M5-08, M5-13 | 화면 정보, 체크리스트 |
| 화면 캡처 가능 여부 · 마스킹 | M5 전체, M6-04, M6-12, M6-13 | 캡처 사용 여부 |
| 프로세스 멈춤 증상(운영 경험), redis-sentinel 멈춤 증상 | M2-09 | 시연 내용 |
| 과거 장애 사례, 대표 log 문구 | M6-05 ~ M6-09, M6-20 | 분류 예시, 사례 연습 |
| Trigger 조건 · 횟수 제한 | M6-14 | 전달 기준 |
| 실행 중인 Hive SQL Task도 worker 재시작 금지 조건인지, 서버별 확인 기준 | M6-16 | 사전 확인 절차 |
| playbook / systemctl 중 무엇을 다룰지, 재시작 명령어 | M6-17 | 명령어 슬라이드 (명령어는 사용자 기재) |
| 전달 대상 · 채널 | M6-19 | 전달 양식 |

**사용자 작성 (DAG 동작 상세 — Claude가 묻지 않는다)**

| 항목 | 영향받는 슬라이드 | 쓰는 곳 |
|------|------|------|
| ④에서 기록하는 기존 파일의 범위 — 대상 날짜(파티션)만인지 전체인지 | M4-06, M6-10 | Hive 적재 도식 |
| ⑤와 ⑥ 사이(기존 · 새 파일이 함께 있는 동안)의 조회 결과 | M4-06, M4-09 | Hive 적재 도식, 조회 시각 시연 |
| `_orc` 교체 도중 실패했을 때의 상태와 재실행 복구 여부 | M6-10 | 장애 분류 |
| Hive SQL Task의 실행 방식(Operator), log에 application ID가 찍히는지 | M3-07, M5-11 | YARN에서 Tez 작업 찾는 법 |
| Spark를 Iceberg 적재에만 쓰는지 | M1-02, M3-04 | 핵심 도식, Tez · Spark 비교 |
| get_jobs log에서 처리 범위가 찍히는 줄 | M6-12 | 캡처 |
| PARAM 필드 이름 · 입력 형식, DAG마다 같은지 | M6-13 | 절차 캡처 |
| 스케줄 실행 때 범위가 정해지는 방식 | M2-03 | 날짜 개념 설명 |
| job_history 상태 값과 의미 | M2-04, 3절 비유 | 적재 대장 설명 문구 |
| 배치 주기 | M4-06 | Hive 적재 도식 |
| Iceberg 유지보수 작업 여부 | M4-10 | 운영 대상 DAG 추가 여부 |
| DAG 구성(Task 순서) | M2-02 | DAG 예시 도식 |
