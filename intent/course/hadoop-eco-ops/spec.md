---
title: Hadoop eco 운영 교육자료 — 커리큘럼
status: draft
category: course
originated: 2026-10-04
written: 2026-10-04
approved:
author: Seonghyeon Lee
drafted-by: Claude
---

# Spec: Hadoop eco 운영 교육자료 — 커리큘럼

> **초안 상태 안내.** `intent.md`의 Open questions가 아직 일부 열려 있는 상태에서 **커리큘럼 뼈대를 먼저 합의하려고** 쓴 초안이다. 미결 사항에 기대는 슬라이드는 `[확인 필요: …]`로, 사용자가 직접 쓰기로 한 DAG 동작 상세는 `[사용자 작성: …]`로 표시했고, 어떤 미결 사항이 어느 슬라이드에 영향을 주는지는 끝의 "미결 사항 의존표"에 모았다. Claude가 제안한 설계 결정은 "설계 결정" 절에 따로 적었다 — 승인 대상이다.

## 1. 학습 목표

`intent.md`의 Proposed outcome을 모듈에 연결한 것이다.

| # | 수강자가 할 수 있어야 하는 것 | 다루는 모듈 |
|---|------|------|
| 1 | 데이터가 들어와 테이블에 쌓이는 경로를 그림 한 장으로 설명한다 | M1 |
| 2 | Airflow · Spark · Tez · YARN · HDFS · Hive · Iceberg의 역할을 말한다 | M1–M4 |
| 3 | Hive와 Iceberg 테이블의 차이, 동시 적재 이유, 전환의 득실을 말한다 | M4 |
| 4 | Airflow UI · Flower · YARN UI · Spark UI에서 정상과 비정상을 구분한다 | M5 |
| 5 | Airflow log를 읽고 증상을 1차 분류한다 | M6 |
| 6 | 허용된 조치(DAG 재실행, Airflow 프로세스 재시작)를 절차대로 수행한다 | M6 |
| 7 | 맡지 않는 조치는 하지 않고, 담당자에게 필요한 정보를 정리해 전달한다 | M6 |

## 2. 설계 결정 (Claude 제안 — 승인 필요)

| 결정 | 내용 | 이유 |
|------|------|------|
| 모듈 순서 | 구조(M1) → 구성요소별 개념(M2–M4) → 모니터링(M5) → 장애 대응(M6) | 장애 대응은 "어느 층의 문제인가"를 알아야 가능하다. 개념 모듈은 모니터링 화면에서 보게 될 용어만 다룬다 |
| 개념의 깊이 | **화면에 나오는 용어까지만** 설명한다. 화면에 안 나오는 내부 동작은 다루지 않는다 | 독자는 코드를 다루지 않는 운영 담당자, 목표는 운영 |
| 이름이 겹치는 용어 | Airflow의 **Task**와 Spark의 **task**, Airflow **Executor**와 Spark **executor**를 명시적으로 구분하는 슬라이드를 둔다 (M3-09) | 수강자가 가장 헷갈릴 지점 |
| 날짜 개념 | **처리 범위(PARAM)**와 **화면의 DAG Run 날짜(logical date)**를 별도 슬라이드로 구분한다 (M2-04, M2-06) | 재실행은 PARAM에 날짜 범위를 넣어 Trigger한다. 수동 Trigger한 DAG Run의 logical date는 버튼을 누른 시각이라, 화면 날짜만 보고 처리 범위를 판단하면 틀린다 |
| job_history 소개 위치 | Airflow 모듈(M2-05)에서 먼저 소개하고, M4(중복 없음)·M6(재실행)에서 다시 쓴다 | 재실행이 안전한 이유와 PARAM이 하는 일이 모두 job_history에 기대므로 일찍 알아야 한다 |
| Tez | Hive 적재 엔진으로 **이름과 역할만** 다룬다(M3-04). YARN UI에서 Spark 작업과 구분하는 법까지만 가르치고, Tez UI는 다루지 않는다 | Hive 적재는 Spark가 아니라 Hive SQL(Tez)로 한다(사용자 확인). 모니터링 범위는 Spark와 같은 "상태 확인·전달" 수준 |
| 로그 경계 | Spark UI·YARN UI에서 **로그를 여는 방법은 가르치지 않는다.** Airflow log에 섞여 나오는 Spark driver log도 **읽는 방법은 다루지 않고**, "이 부분은 보지 않아도 된다"고만 알려 준다 (M3-10, M6-06). Tez도 같다 | 사용자 결정(2026-10-04) |
| Flower | 모니터링 도구에 **잠정 포함**한다. 슬라이드를 M5-10 한 장에 모아 두어 나중에 빼기 쉽게 한다. 다른 슬라이드는 Flower 없이도 성립하게 쓴다 | 사용자 결정 — 추후 제거 가능. worker 재시작 사전 확인은 Airflow UI로 하므로 Flower가 필수가 아니다 |
| as-is Hive 적재 | `_raw` / `_temp` / `_orc` 세 테이블의 흐름을 구체적으로 그리고, Hive 방식의 한계를 일반론이 아니라 **"`_orc`가 비는 순간"**으로 보여 준다 (M4-06~08) | 실제 운영 구조로 설명해야 Iceberg 전환의 득실이 와닿는다 |
| 장애 대응 구성 | 판단 흐름도 1장을 중심에 두고, 증상 분류 → 허용 조치 → 금지 조치 → 전달 순으로 펼친다 | 실제 대응 순서와 같게 |
| 회차 | 2회차 제안 — 1회차: M0–M4(개념·구조), 2회차: M5–M7(모니터링·장애 대응) | 개념과 실무를 끊어 복습 시간을 둔다. `[확인 필요: 교육 총 시간·회차]` |
| 슬라이드 ID | `M<모듈>-<번호>` (예: M5-06). 원고·pptx·HTML이 같은 ID로 서로를 가리킨다 | 수정 요청과 검수 때 위치 지정 |
| deck 분할 | 회차별 deck인지 단일 deck인지는 plan에서 정한다 | 산출물 위치·형태는 plan 소관 |

## 3. 비유 목록

`CLAUDE.md` 규칙대로, 비유와 함께 **실제 동작과 어긋나는 지점**을 슬라이드에 같이 적는다.

| 개념 | 비유 | 어긋나는 지점 |
|------|------|------|
| Airflow | 작업 일정표를 들고 지시하는 작업반장 | 반장은 상황을 보고 순서를 바꾸지만, Airflow는 DAG에 정해진 순서와 조건대로만 움직인다. 데이터는 직접 만지지 않는다 |
| DAG | 작업 순서도(레시피) | 레시피는 사람이 한 번 따라 하지만, DAG는 정해진 주기마다 반복 실행된다 |
| DAG Run | 그 순서도대로 한 번 돌린 기록 | 어느 범위의 데이터를 처리했는지는 DAG Run 날짜가 아니라 PARAM으로 정해진다 |
| PARAM | 작업 지시서의 "처리할 기간" 칸 | — |
| job_history | **적재 대장** — 들어온 데이터 건마다 처리 상태(대기·처리 중·완료·실패)를 적어 두는 표. 비유: 택배 배송 조회표 | 택배는 사람이 조회만 하지만, job_history는 DAG가 직접 읽고 상태를 고쳐 쓴다. `[사용자 작성: as-is 상태 값과 의미 — 건별 상태 방식이 아니면 표현 수정]` |
| CeleryExecutor | 반장(scheduler)이 작업 지시서를 꽂이(redis)에 꽂으면, 작업자(worker)가 하나씩 가져가 처리하고 결과를 작업 일지(PostgreSQL)에 적는다 | Spark·Hive SQL 작업이면 worker가 직접 계산하지 않는다. YARN에 맡기고 끝날 때까지 지켜본다 — 그래서 지켜보는 도중에 worker를 끄면 안 된다 |
| YARN | 공용 작업장의 자리(장비) 배정 담당 | 실제로 나눠 주는 것은 자리가 아니라 CPU·메모리 묶음(container)이다 |
| Spark | 큰 계산을 여러 사람이 나눠 처리하는 계산팀 (driver = 팀장, executor = 팀원) | 팀원 수와 역량은 실행 전에 정해지고, 실행 중에 팀장이 판단해 바꾸지 않는다 (as-is는 dynamic allocation을 쓰지 않는다) |
| Tez | Hive SQL 주문서를 받아 실제 작업으로 바꿔 돌리는 또 다른 계산팀 | — |
| HDFS | 여러 창고에 나눠 보관하고 복사본을 두는 창고 시스템 | 한 파일도 조각(block) 단위로 쪼개져 여러 창고에 흩어진다 |
| hdfs mv | 서류를 옮기지 않고 캐비닛 이름표만 바꿔 다는 것 | — (HDFS의 이동은 실제로 파일을 복사하지 않아 빠르다) |
| Hive Metastore | 도서관 목록 카드 | 목록 카드가 사라지면 책(파일)은 있어도 찾지 못한다 — 비유와 일치. 단, 목록 카드는 Oracle DB에 저장된다 |
| Hive 적재(as-is) | 새 서류는 임시 서랍(`_raw`)에 계속 쌓고(오래된 것만 주기적으로 버림), 정해진 때마다 해당 날짜 서류를 골라 정리본(`_temp`)을 만든 뒤 캐비닛(`_orc`)을 비우고 정리본을 옮겨 넣는다 | — |
| Iceberg 적재(as-is) | 새 서류만 장부에 덧붙이고 목록을 갱신한다 | 장부 자체도 파일로 저장된다. 장부가 쌓이면 정리(유지보수)가 필요하다 |
| snapshot | 적재가 끝날 때마다 찍는 테이블 전체 사진 | 사진은 내용을 복사하지만, snapshot은 파일을 복사하지 않고 "그 시점의 파일 목록"만 기록한다 |
| Compaction | 흩어진 작은 서류를 큰 묶음으로 다시 철하기 | — |

## 4. 모듈 구성

| 모듈 | 제목 | 장 수(안) | 회차(안) |
|------|------|------|------|
| M0 | 오리엔테이션 | 6 | 1 |
| M1 | 전체 구조 — 데이터가 흐르는 길 | 8 | 1 |
| M2 | Airflow — 언제, 무엇을, 어떤 순서로 | 13 | 1 |
| M3 | Spark · Tez와 YARN — 실제 계산과 자원 배분 | 10 | 1 |
| M4 | HDFS · Hive · Iceberg — 데이터가 쌓이는 곳 | 19 | 1 |
| M5 | 모니터링 — 화면에서 정상과 비정상 구분하기 | 17 | 2 |
| M6 | 장애 대응 — 확인하고, 허용된 것만 하고, 나머지는 전달한다 | 25 | 2 |
| M7 | 마무리 | 4 | 2 |
| | **합계** | **102** | |

레이아웃 이름은 `CLAUDE.md`의 표준 레이아웃(제목 슬라이드 / 제목 및 내용 / 구역 머리글 / 콘텐츠 2개 / 제목만 / 빈 화면)이다. 도식 슬라이드는 "제목만" 위에 PowerPoint 도형으로 그린다.

## 5. 모듈별 슬라이드 목차

"메시지"는 그 슬라이드가 전달할 단 하나의 문장이다.

### M0. 오리엔테이션

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M0-01 | 제목 슬라이드 | Hadoop eco 데이터 파이프라인 운영 교육 | |
| M0-02 | 제목 및 내용 | 교육을 마치면 세 가지를 할 수 있다 — 구조 설명, 화면으로 상태 판단, 정해진 장애 대응 | 학습 목표 요약 |
| M0-03 | 콘텐츠 2개 | 우리가 하는 일과 하지 않는 일은 처음부터 정해져 있다 | 좌: DAG 재실행(Trigger), Airflow 프로세스 재시작, Airflow log 확인 / 우: 코드 수정, Spark·Tez 로그 분석, DB·redis 재시작 등. M6-03의 예고 |
| M0-04 | 제목 및 내용 | 이 교육은 현재 운영 중인 시스템, Oracle DB 전환 후 상태를 기준으로 한다 | DB 전환은 배경 설명만. `[확인 필요: 전환 후 운영자가 알아야 할 변화가 있는지]` |
| M0-05 | 제목 및 내용 | 기술 용어는 영어 원어 그대로 쓴다 — 화면에 그 이름으로 나오기 때문이다 | |
| M0-06 | 제목만 | 과정은 구조 → 개념 → 모니터링 → 장애 대응 순서로 진행된다 | 모듈 지도 도식 |

### M1. 전체 구조 — 데이터가 흐르는 길

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M1-01 | 구역 머리글 | 전체 구조 | |
| M1-02 | 제목만 | 데이터는 Airflow의 지시로 Spark·Tez가 처리해 HDFS 위 테이블에 쌓는다 | **핵심 도식.** 원천 → Airflow → YARN → Spark(Iceberg 적재) / Tez(Hive SQL, Hive 적재) → HDFS → Hive/Iceberg 테이블. 이후 모듈에서 반복 사용. `[확인 필요: 데이터 원천의 종류]` `[사용자 작성: Spark는 Iceberg 적재에만 쓰는지]` `[확인 필요: Oracle·Trino를 도식에 표시할지]` |
| M1-03 | 제목 및 내용 | 구성요소는 각각 한 가지 역할만 맡는다 | 역할 한 줄 + 비유 표 (3절) |
| M1-04 | 제목만 | Airflow는 시키는 쪽이고, 데이터를 직접 만지지 않는다 | M1-02 도식에서 Airflow 강조 |
| M1-05 | 제목만 | YARN은 자원을 나눠 주고, Spark와 Tez는 그 자원으로 계산한다 | |
| M1-06 | 제목만 | 테이블은 HDFS의 파일과 Metastore의 목록이 합쳐진 것이다 | HMS 저장소는 Oracle — 이름만 언급 |
| M1-07 | 제목만 | DAG 하나가 돌면 여러 화면에 각각 흔적이 남는다 | Airflow UI / Flower / YARN UI / Spark UI 위치를 도식에 표시. M5 예고 |
| M1-08 | 제목 및 내용 | 문제가 생기면 먼저 "어느 층의 문제인가"를 본다 | M6 예고 |

### M2. Airflow — 언제, 무엇을, 어떤 순서로

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M2-01 | 구역 머리글 | Airflow | Airflow 2.7.1 기준임을 명시 |
| M2-02 | 제목만 | DAG는 작업의 순서도다 | 화살표 = 순서, 되돌아가는 화살표 없음 |
| M2-03 | 제목 및 내용 | Task는 순서도의 한 칸이고, 앞 칸이 성공해야 다음 칸이 시작된다 | trigger rule 기본값 기준. 예외는 다루지 않음 |
| M2-04 | 제목 및 내용 | DAG는 처리할 날짜 범위를 PARAM으로 받는다 | `[사용자 작성: 스케줄 실행 때 범위가 어떻게 정해지는지 — PARAM을 비우면 기본 범위를 쓰는지]` |
| M2-05 | 제목만 | get_jobs Task가 그 범위로 job_history(적재 대장)를 조회해 처리할 데이터를 고른다 | 도식: PARAM(범위) → get_jobs → 처리 대상 → Hive SQL·Spark Task → 상태 기록. job_history는 Oracle에 있다 — 이름만 언급. Hive 변환 배치는 처리할 날짜를, Iceberg 적재는 처리할 파일 경로를 받아 온다(사용자 확인) — 슬라이드에서는 깊이 다루지 않음. `[사용자 작성: 고르는 상태 값]` |
| M2-06 | 제목만 | 화면에 보이는 DAG Run 날짜(logical date)는 처리 범위와 다를 수 있다 | 타임라인 도식. 수동 Trigger한 DAG Run의 logical date는 버튼을 누른 시각 |
| M2-07 | 제목 및 내용 | DAG는 정해진 주기(schedule)마다 DAG Run을 하나씩 만든다 | catchup 개념 소개. as-is DAG는 `catchup=False` — 멈춰 있던 구간을 한꺼번에 실행하지 않고, 가장 최근 구간의 DAG Run 하나만 만든다 |
| M2-08 | 제목만 | Airflow는 여러 프로세스가 역할을 나눠 함께 움직인다 | 구성 도식(CeleryExecutor): webserver(화면) · scheduler(실행 결정) · redis(작업 대기열) · worker(실제 실행) · flower(worker 상태 화면) · PostgreSQL(metadata DB) · pgpool(PostgreSQL 앞단). 재시작 가능한 4개(webserver·scheduler·worker·flower)와 불가 3개를 색으로 구분. 개수 표시: worker ×3, scheduler ×2, webserver ×2, flower ×1. pgpool = PostgreSQL HA·커넥션 풀 |
| M2-09 | 제목 및 내용 | 프로세스마다 멈췄을 때의 증상이 다르다 | 증상표(Airflow·Celery 일반 동작 기준): scheduler → 새 DAG Run·Task가 시작되지 않고 화면에 경고 배너 / webserver → 화면만 안 열리고 실행은 계속 / worker → Task가 queued에 머묾, 실행 중이던 Task는 실패 처리될 수 있음 / flower → Flower 화면만 안 열리고 실행 영향 없음 / redis → Task가 worker에 전달되지 않음 / PostgreSQL·pgpool → 화면과 scheduler 모두 오류. `[확인 필요: 운영에서 실제로 본 증상과 맞는지]` |
| M2-10 | 제목 및 내용 | Task 상태는 색으로 구분되고, 운영에서 볼 상태는 몇 개뿐이다 | success, running, queued, failed, upstream_failed, up_for_retry, skipped |
| M2-11 | 제목 및 내용 | 실패하면 Airflow가 정해진 횟수만큼 스스로 다시 시도한다 | retries, up_for_retry. 자동 재시도 중에는 손대지 않는다 |
| M2-12 | 제목만 | 재실행은 Trigger DAG로 한다 — Clear, Pause/Unpause와는 다른 기능이다 | 3열 비교 도식. Trigger는 새 DAG Run을 만들어 처음부터 전부 다시 돈다. `[확인 필요: Clear를 금지로 둘지]` |
| M2-13 | 제목 및 내용 | 정리 | |

### M3. Spark · Tez와 YARN — 실제 계산과 자원 배분

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M3-01 | 구역 머리글 | Spark · Tez와 YARN | Hadoop 3.2.3(YARN), Spark 3.5.2, Hive 3.1.2, Tez 0.10.1 |
| M3-02 | 제목만 | Spark는 큰 계산을 쪼개 여러 서버에서 동시에 처리한다 | |
| M3-03 | 제목만 | Spark 작업은 driver 하나와 executor 여럿으로 이루어진다 | 팀장/팀원 비유 + 어긋나는 지점 |
| M3-04 | 제목만 | Hive 적재는 Spark가 아니라 Hive SQL을 Tez로 실행해서 한다 | Tez = Hive SQL을 실제 작업으로 바꿔 돌리는 엔진. 이름과 역할만 |
| M3-05 | 제목만 | YARN은 클러스터의 CPU·메모리를 container 단위로 나눠 준다 | ResourceManager, NodeManager, container. Spark와 Tez가 같은 자원을 나눠 쓴다 |
| M3-06 | 제목 및 내용 | 자원이 모자라면 YARN은 작업을 queue에서 기다리게 한다 | `[확인 필요: queue 구성]` |
| M3-07 | 제목만 | Spark Task와 Hive SQL Task는 각각 YARN application을 띄운다 | 연결 관계 도식. SparkSubmitOperator(cluster 모드 — driver도 YARN 위에서 돈다) → SPARK application / Hive SQL Task → TEZ application. worker는 끝날 때까지 지켜본다. `[사용자 작성: Hive SQL Task의 실행 방식(Operator), Task 하나에 application 하나인지]` |
| M3-08 | 제목만 | YARN application은 ACCEPTED → RUNNING → FINISHED 순서로 상태가 바뀐다 | State와 FinalStatus(SUCCEEDED/FAILED/KILLED) 구분 |
| M3-09 | 콘텐츠 2개 | Airflow의 Task·Executor와 Spark의 task·executor는 이름만 같고 다른 것이다 | 혼동 방지 전용 슬라이드 |
| M3-10 | 제목 및 내용 | 우리는 Spark·Tez 로그를 보지 않는다 — 상태만 확인하고 전달한다 | Spark UI·YARN UI의 로그 링크, Airflow log의 Spark driver 부분은 다루지 않는다 |

### M4. HDFS · Hive · Iceberg — 데이터가 쌓이는 곳

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M4-01 | 구역 머리글 | HDFS · Hive · Iceberg | |
| M4-02 | 제목만 | HDFS는 파일을 조각내 여러 서버에 복사본과 함께 보관한다 | block, replication |
| M4-03 | 제목만 | 테이블 = 파일 + 목록이고, 목록은 Hive Metastore가 관리한다 | |
| M4-04 | 제목만 | Hive 테이블은 HDFS의 폴더 하나에 파일을 모아 둔 것이다 | 테이블 = 폴더. 파티션은 하위 폴더로 짧게 언급 — as-is `_raw`·`_orc`는 `dt=YYYYMMDD` 파티션(날짜별 하위 폴더), `_temp`는 파티션 없음 |
| M4-05 | 콘텐츠 2개 | TEXT는 글자 그대로 저장하고, ORC는 열 단위로 압축해 빨리 읽게 저장한다 | 파일 형식 비교. `_raw`·`_orc` 이름의 뜻. as-is: `_raw`=TEXTFILE, `_temp`·`_orc`=ORC |
| M4-06 | 제목만 | as-is Hive 데이터는 `_raw`와 `_orc` 두 테이블에 나뉘어 있다 — 최근 데이터는 `_raw`, 예전 데이터는 `_orc`에서 조회한다 | 조회하는 쪽에서 본 도식. `_raw`는 비우지 않고, retention 처리 때만 과거 데이터를 지운다 |
| M4-07 | 제목만 | 새 데이터는 `_raw`에 계속 추가되고, 배치 주기마다 `_temp`를 거쳐 `_orc`로 옮겨진다 | **as-is 적재 도식(5단계, Hive SQL)**: ① `_raw`(TEXT)에 계속 Insert ② 배치 주기에 `_temp`를 전부 비움 ③ `_raw`에서 대상 날짜 데이터를 select해 `_temp`(ORC)에 쌓음 ④ `_orc`를 비움 ⑤ `_temp`의 파일을 `hdfs mv`로 `_orc`에 옮김. `_temp`는 파티션이 없고 `_orc`는 `dt` 파티션이다. `[사용자 작성: ④에서 비우는 범위 — 대상 날짜(dt 파티션)만인지, _orc 전체인지]` `[사용자 작성: 배치 주기]` |
| M4-08 | 제목만 | `_orc`를 비우고 옮겨 넣는 사이에는 `_orc` 조회 결과가 비거나 모자란다 | Hive 방식의 한계를 as-is 사례로. ④~⑤ 사이 구간을 타임라인으로 강조. `hdfs mv`는 복사가 아니라 빨라서 그 구간을 줄이지만 없애지는 못한다 |
| M4-09 | 제목만 | Iceberg 테이블은 파일 목록을 별도의 메타데이터 파일로 관리한다 | as-is: 카탈로그 = Hive Metastore(Hive 테이블과 같은 목록에 등록되고, 목록은 메타데이터 파일 위치를 가리킨다), 저장 위치 = HDFS, 데이터 파일 = Parquet, Iceberg 1.6.1 |
| M4-10 | 제목만 | Iceberg 적재는 새 데이터만 덧붙인다(append) | M4-07과 같은 모양의 도식으로 대비 — 테이블 하나, 단계 하나 |
| M4-11 | 제목만 | 적재가 끝날 때마다 snapshot이 하나 생긴다 | 비유 + 어긋나는 지점 |
| M4-12 | 제목 및 내용 | Iceberg는 적재가 완전히 끝나야 결과가 보이므로, `_orc`처럼 비는 순간이 없다 | 원자적 커밋. M4-08과 대비 |
| M4-13 | 제목 및 내용 | Iceberg 테이블은 작은 파일 정리(Compaction)와 오래된 snapshot 정리가 필요하다 | append를 반복하면 작은 파일·snapshot이 쌓인다. `[사용자 작성: as-is에서 유지보수 작업을 하는지, DAG로 돌리는지]` — DAG라면 M5·M6에서 다룸 |
| M4-14 | 제목 및 내용 | Hive와 Iceberg는 테이블 구성과 적재 방식이 다르다 | 비교 표: 엔진(Tez/Hive SQL vs Spark) / 테이블 수(`_raw`·`_temp`·`_orc` vs 1개) / 파일 형식(TEXTFILE·ORC vs Parquet) / 조회 대상(최근·예전이 나뉨 vs 하나) / 적재 방식(주기적 교체 vs append) / 읽기 일관성 / 이력 / 유지보수 |
| M4-15 | 제목 및 내용 | Iceberg로 바꾸면 테이블 하나로 조회하고, 옮겨 넣는 단계 없이 비는 순간 없이 반영된다 | |
| M4-16 | 제목 및 내용 | 대신 유지보수 작업과 운영 복잡도가 늘어난다 | |
| M4-17 | 제목만 | 지금은 전환 과도기라 일부 테이블은 Hive와 Iceberg에 함께 쌓는다 | `[확인 필요: 대상 테이블, 동시 적재 이유, Hive 적재 종료 시점]` |
| M4-18 | 제목 및 내용 | 동시 적재 테이블은 한쪽만 실패해도 Trigger 재실행으로 복구하며, job_history 덕분에 중복 적재되지 않는다 | M2-05 복습. Hive 변환 배치도 job_history를 쓴다(사용자 확인) |
| M4-19 | 제목 및 내용 | 정리 | |

### M5. 모니터링 — 화면에서 정상과 비정상 구분하기

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M5-01 | 구역 머리글 | 모니터링 | |
| M5-02 | 제목만 | 화면은 Airflow UI → Flower → YARN UI → Spark UI 순서로 본다 | 화면별 역할: 무엇이 언제 / worker 상태 / 자원·실행 상태 / 진행 상황 |
| M5-03 | 제목 및 내용 | 화면의 접속 주소 | `[확인 필요: URL, 로그인 방식, 마스킹 여부]` |
| M5-04 | 제목만 | DAGs 목록 화면에서 최근 실행 결과를 한눈에 본다 | 캡처. Runs·Recent Tasks 원, Pause 토글, Next Run |
| M5-05 | 제목만 | 화면 위에 scheduler 경고가 보이면 Airflow 자체에 문제가 있다 | 캡처(경고 배너). M6-11, M6-17과 연결 |
| M5-06 | 제목만 | Grid 화면은 행이 Task, 열이 DAG Run, 색이 상태다 | 캡처 + 읽는 법 주석 |
| M5-07 | 제목만 | Task를 누르면 상세와 Log를 볼 수 있다 | 캡처. 메뉴 경로는 2.7.1 실제 화면으로 확정 |
| M5-08 | 제목만 | Browse > Task Instances에서 상태별로 Task를 모아 볼 수 있다 | 상태 필터. 실패 Task 찾기와 M6-18 "실행 중 Task 확인"에 같은 화면을 쓴다 |
| M5-09 | 제목 및 내용 | 이런 모습이면 비정상이다 | queued에 오래 머묾 / running이 평소보다 김 / failed·upstream_failed. `[확인 필요: "평소" 소요 시간 기준]` |
| M5-10 | 제목만 | Flower에서는 worker가 살아 있는지(Online) 본다 | 캡처. **잠정 — 제거 가능** |
| M5-11 | 제목만 | YARN UI의 Applications 목록에서 상태와 시각을 보고, 종류로 Spark와 Tez를 구분한다 | 캡처. Application Type(SPARK/TEZ), State, FinalStatus, Queue, Start/Finish. 로그 링크는 다루지 않음 |
| M5-12 | 제목 및 내용 | ACCEPTED에 오래 머물러 있으면 자원을 기다리는 중이다 | |
| M5-13 | 제목만 | Airflow log의 application ID로 YARN에서 해당 작업을 찾는다 | Spark Task log에 찍히는 `application_…` ID. 위치는 캡처로 확정. `[사용자 작성: Hive SQL Task log에도 application ID가 찍히는지]` |
| M5-14 | 제목만 | Spark UI는 YARN UI의 링크로 들어간다 | 실행 중: ApplicationMaster / 종료 후: History. Tez 작업은 YARN UI 상태까지만 본다. as-is는 Spark History Server를 운영하므로 끝난 작업도 볼 수 있다 |
| M5-15 | 제목만 | Spark UI에서는 진행률, 소요 시간, 실패 개수만 본다 | Jobs/Stages 캡처. Executors 탭의 로그(stdout/stderr)는 열지 않는다 |
| M5-16 | 제목 및 내용 | 매일 점검은 이 순서로 한다 | 체크리스트. `[확인 필요: 점검 시각, 핵심 DAG 목록]` |
| M5-17 | 제목 및 내용 | 정리 | |

### M6. 장애 대응 — 확인하고, 허용된 것만 하고, 나머지는 전달한다

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M6-01 | 구역 머리글 | 장애 대응 | |
| M6-02 | 제목 및 내용 | 장애 대응의 원칙은 확인 → 허용된 조치 → 전달이다 | |
| M6-03 | 제목 및 내용 | 할 수 있는 조치와 하면 안 되는 조치는 정해져 있다 | 허용·금지 표. **intent의 경계 초안 승인 후 확정** |
| M6-04 | 제목만 | 증상을 보고 이 흐름도를 따라간다 | **핵심 도식.** 증상 → 화면 확인 → 분류 → 조치 또는 전달 |
| M6-05 | 제목만 | Airflow log는 맨 아래 에러부터 거꾸로 읽는다 | 캡처. 시도 번호(try) 구분 |
| M6-06 | 제목만 | Airflow log에 섞여 나오는 Spark 부분은 읽지 않아도 된다 | 캡처에 "볼 곳"과 "보지 않을 곳"을 표시. 볼 곳: Task 시작·종료, application ID, 최종 결과 줄 |
| M6-07 | 제목 및 내용 | 분류 1 — Spark·Hive SQL 작업 실패: YARN 상태를 확인하고 전달한다 | `[확인 필요: as-is 대표 log 문구]` |
| M6-08 | 제목 및 내용 | 분류 2 — 자원 대기·시간 초과: 다른 작업이 끝나기를 기다린다 | `[확인 필요: 기다리는 한도, 전달 시점]` |
| M6-09 | 제목 및 내용 | 분류 3 — 연결 실패: 잠시 뒤 재실행하고, 반복되면 전달한다 | DB, Metastore 등. `[확인 필요: as-is 대표 log 문구]` |
| M6-10 | 제목 및 내용 | 분류 4 — 입력 데이터 미도착: 원천 담당에게 전달한다 | `[확인 필요: as-is에 해당 유형이 있는지]` |
| M6-11 | 제목 및 내용 | 분류 5 — Airflow 자체 문제: Airflow 프로세스면 재시작, DB·redis면 전달한다 | M2-09 증상표와 연결 — scheduler 경고, queued 적체, 화면 접속 불가 |
| M6-12 | 제목 및 내용 | `_orc`를 비운 뒤 옮겨 넣기 전에 배치가 실패하면 `_orc`에 데이터가 빠져 있다 | M4-07의 ④ 이후 ⑤ 전에 실패한 경우. 조회하는 사용자에게 바로 영향. `[사용자 작성: 이 경우 같은 날짜로 Trigger 재실행하면 복구되는지, 바로 전달해야 하는지]` |
| M6-13 | 제목 및 내용 | 실패한 DAG는 처리 범위를 PARAM에 넣어 Trigger DAG로 다시 실행한다 | 성공했던 Task까지 처음부터 다시 돌지만 job_history 덕분에 중복 적재되지 않는다(사용자 확인) |
| M6-14 | 제목만 | 처리 범위는 get_jobs Task log에서, 실패 내용은 Hive SQL·Spark Task log에서 확인한다 | 캡처에 해당 줄 표시. `[사용자 작성: get_jobs log에서 범위가 찍히는 줄 — 캡처로 확정]` |
| M6-15 | 제목만 | Trigger DAG는 이 순서로 누른다 | 캡처 단계별: Trigger DAG → PARAM 필드에 날짜 범위 입력 → 실행. config는 쓰지 않는다. 여러 날짜가 실패했으면 그 날짜들을 덮는 범위로 넣는다. `[사용자 작성: PARAM 필드 이름·입력 형식, DAG마다 같은지]` |
| M6-16 | 제목 및 내용 | 이런 경우에는 Trigger하지 않고 전달한다 | 후보: 같은 DAG가 아직 실행 중일 때, 재실행 후 같은 증상으로 다시 실패했을 때. `[확인 필요: 원인과 무관하게 Trigger해도 되는지, 횟수 제한]` |
| M6-17 | 제목 및 내용 | 재시작할 수 있는 것은 Airflow 프로세스 4개뿐이고, 하나씩 지정해서 재시작한다 | worker · scheduler · webserver · flower. PostgreSQL · pgpool · redis는 재시작하지 않고 전달(확정). M2-09 증상표 → 재시작할 프로세스 |
| M6-18 | 제목만 | worker는 실행 중인 Spark Task가 없을 때만 재시작한다 | 사전 확인: Browse > Task Instances에서 running 상태인 Spark Task(SparkSubmitOperator)가 없는지 본다(M5-08). 있으면 재시작하지 않고 전달. `[확인 필요: 실행 중인 Hive SQL Task도 같은 조건인지]` `[확인 필요: worker가 여러 대면 해당 worker의 Task만 보면 되는지 — worker 3대가 같은 Celery queue(기본값)를 받으므로, Task Instance의 Hostname으로 worker를 구분한다]` |
| M6-19 | 제목 및 내용 | 재시작은 이 명령어를 그대로 복사해 붙여 넣는다 | 프로세스별 명령어 4종 — ansible playbook(대상 프로세스 지정) 또는 systemctl. `[명령어: 사용자 기재]` + 성공 시 화면(기대 출력). `[확인 필요: 교육에서 playbook과 systemctl 중 하나만 가르칠지]` |
| M6-20 | 제목 및 내용 | 재시작 후에는 세 가지를 확인한다 | 경고 배너 사라짐, 새 DAG Run 생성, queued 해소 |
| M6-21 | 제목 및 내용 | Airflow 화면에서 하면 안 되는 조치와 그 이유 | Mark Success/Failed, backfill, DAG Run 삭제, Pause/Unpause, Variables·Connections·Pool 수정, Clear `[확인 필요: 금지 여부]` |
| M6-22 | 제목 및 내용 | Airflow 밖에서 하면 안 되는 조치와 그 이유 | PostgreSQL·pgpool·redis 재시작(확정), Spark Task 실행 중 worker 재시작(확정), YARN application kill, HDFS 파일 삭제·이동, 테이블 조작, 코드 수정 |
| M6-23 | 제목 및 내용 | 담당자에게는 이 항목을 채워 전달한다 | 전달 양식: DAG 이름, 처리 범위(PARAM), Task, 시도 번호, 시각, 상태, log 에러 부분, YARN application ID·상태, 이미 한 조치. `[확인 필요: 전달 대상·채널]` |
| M6-24 | 제목만 | 사례 연습 | `[확인 필요: 과거 장애 사례]` — 사례 수만큼 장 수 늘어남 |
| M6-25 | 제목 및 내용 | 정리 | |

### M7. 마무리

| ID | 레이아웃 | 메시지 | 비고 |
|----|------|------|------|
| M7-01 | 구역 머리글 | 마무리 | |
| M7-02 | 제목만 | 장애가 나면 이 한 장만 보면 된다 | 퀵 레퍼런스 (흐름도 + 허용 조치 + 전달 양식 요약) |
| M7-03 | 제목 및 내용 | 용어집 | 이 과정에서 나온 용어 한 줄 정의 |
| M7-04 | 제목 및 내용 | 질의응답 | |

## 6. 보조 HTML (제안)

pptx로 표현하기 어렵거나, 교육 후에도 곁에 두고 볼 자료만 HTML로 만든다. 모두 단일 파일·오프라인.

| ID | 내용 | 연결 슬라이드 |
|----|------|------|
| H1 | 데이터 흐름 도식 — 구성요소를 누르면 역할·비유·관련 화면이 펼쳐진다 | M1-02, M1-03 |
| H2 | 장애 대응 판단 흐름도 — 질문에 답하며 따라가면 분류와 조치(또는 전달 양식)가 나온다 | M6-04 ~ M6-23 |
| H3 | 퀵 레퍼런스·용어집 — 인쇄 가능한 한 장 + 검색 가능한 용어집 | M7-02, M7-03 |

공유 방식: GitHub Pages 게시 + 단일 파일 전달 가능 (2026-10-22)

## 7. 실습

`[확인 필요: 실습 포함 여부]` — 포함한다면 제안은 다음과 같다. 모두 **읽기 전용 조회**이고, 조치 실습은 운영 환경에서 하지 않는다.

- 2회차 M5 끝: 실제 Airflow UI에서 오늘 실패한 Task 찾기 → log 열기 → YARN에서 해당 application 찾기
- 2회차 M6 끝: 과거 장애 사례 log를 보고 분류하고, get_jobs log에서 처리 범위를 찾아 전달 양식 채우기 (M6-24)

## 8. 미결 사항 의존표

**해소됨 (2026-10-04 사용자 답변)**

- DAG 재실행 = Airflow UI에서 Trigger DAG, config 없이 PARAM 필드에 입력. PARAM은 **날짜 범위**이고, get_jobs Task가 그 범위로 job_history를 조회한다
- 처리 범위는 get_jobs Task log, 실패 내용은 Hive SQL·Spark Task log에서 확인한다
- Spark 실행 = SparkSubmitOperator, deploy mode = cluster
- **Hive 적재 = Hive SQL(Tez).** Spark를 쓰지 않는다
- Executor = CeleryExecutor. Airflow 관련 프로세스 = airflow worker·scheduler·webserver·flower, PostgreSQL, pgpool, redis
- 재실행해도 job_history로 중복 적재 없음. Hive 변환 배치도 job_history를 쓰며, 처리할 날짜만 받아 온다(Iceberg처럼 파일 경로를 받지 않음)
- Hive 적재 흐름 = `_raw`(TEXT)에 새 데이터 계속 추가(retention 때만 과거 삭제) → 배치 주기에 `_temp`를 비우고 `_raw`의 대상 날짜 데이터를 select해 `_temp`(ORC)에 쌓음 → `_orc`를 비움 → `_temp` 파일을 `hdfs mv`로 `_orc`에 이동. 사용자는 예전 데이터를 `_orc`, 최근 데이터를 `_raw`에서 조회. Iceberg 적재 = 새 데이터 append
- 재시작 허용 = Airflow 프로세스(worker·scheduler·webserver·flower)만. PostgreSQL·pgpool·redis 불가. 재시작은 playbook에서 대상 프로세스를 지정하거나 systemctl로 개별 처리
- worker 재시작 전 확인 = 실행 중인 Spark Task. 있으면 재시작 불가
- Spark 로그 = Spark UI에서 로그를 보는 방법은 교육하지 않음. Airflow log의 Spark driver log도 보는 방법은 교육 대상 아님
- Flower = 잠정 포함, 추후 제거 가능

**해소됨 (2026-10-08 운영서버 정보)**

- 버전 = Hadoop 3.2.3, Spark 3.5.2, Hive 3.1.2, Tez 0.10.1, Iceberg 1.6.1, Airflow 2.7.1
- Airflow 프로세스 = worker 3, scheduler 2, webserver 2, flower 1 (`airflow-<프로세스>.service`). Celery 설정 기본값. pgpool = HA·커넥션 풀
- catchup = False, Spark dynamic allocation 안 씀, Spark History Server 운영
- Iceberg = 카탈로그 Hive Metastore, HDFS, Parquet
- Hive = `_raw`(TEXTFILE)·`_orc`(ORC)는 `dt` 파티션(varchar(8), YYYYMMDD), `_temp`(ORC)는 파티션 없음. 중간 테이블 이름은 `_temp`(정정)
- **DAG 동작 상세는 사용자가 직접 작성한다** — 아래 "사용자 작성" 표

**남은 미결 사항**

| 미결 사항 | 영향받는 슬라이드 | 답에 따라 바뀌는 것 |
|------|------|------|
| 실행 중인 Hive SQL Task도 worker 재시작 금지 조건인지 | M6-18, M6-22 | 사전 확인 절차 |
| worker 여러 대일 때 사전 확인 범위 | M6-18 | 사전 확인 절차 |
| 교육에서 playbook / systemctl 중 무엇을 가르칠지 | M6-19 | 명령어 슬라이드 수 |
| 장애 대응 허용·금지 경계 승인 (Clear 금지 여부 포함) | M0-03, M6-03, M6-16, M6-21, M6-22 | 표 내용, 금지 슬라이드 항목 |
| 재시작 명령어 | M6-19 | 사용자 기재 |
| 동시 적재 테이블·이유·종료 시점 | M4-17 | "과도기" 서술 |
| Oracle·Trino 도식 표시 여부 | M1-02 | 핵심 도식 |
| 교육 총 시간·회차·실습 | 2절 회차, 4절 장 수, 7절 | 모듈 분할, 슬라이드 수 |
| 에스컬레이션 경로 | M6-23 | 전달 양식 |
| 과거 장애 사례, 대표 log 문구 | M6-07~11, M6-24 | 분류 예시, 사례 연습 |
| 화면 캡처 가능 여부·마스킹 | M5 전체, M6-05, M6-06, M6-14, M6-15 | 캡처 사용 여부 |
| 접속 URL·점검 기준 | M5-03, M5-09, M5-16 | 화면 정보, 체크리스트 |

**사용자 작성 (DAG 동작 상세 — Claude가 묻지 않는다)**

| 항목 | 영향받는 슬라이드 | 쓰는 곳 |
|------|------|------|
| `_orc`를 비우는 범위 — 대상 날짜(파티션)만인지 전체인지 | M4-07, M4-08, M6-12 | Hive 적재 도식, "비는 순간"의 범위 |
| `_orc`를 비운 뒤 옮겨 넣기 전에 실패하면 재실행으로 복구되는지 | M6-12 | 장애 분류 슬라이드의 조치 |
| Hive SQL Task의 실행 방식(Operator), log에 application ID가 찍히는지 | M3-07, M5-13 | YARN에서 Tez 작업 찾는 법 |
| Spark를 Iceberg 적재에만 쓰는지 | M1-02 | 핵심 도식 |
| get_jobs log에서 처리 범위가 찍히는 줄 | M6-14 | 캡처 |
| PARAM 필드 이름·입력 형식, DAG마다 같은지 | M6-15 | 절차 캡처 |
| 스케줄 실행 때 범위가 정해지는 방식 | M2-04 | 날짜 개념 설명 |
| job_history 상태 값과 의미 | M2-05, 3절 비유 | 적재 대장 설명 문구 |
| 배치 주기 | M4-07 | Hive 적재 도식 |
| Iceberg 유지보수 작업 여부 | M4-13 | 운영 대상 DAG 추가 여부 |
