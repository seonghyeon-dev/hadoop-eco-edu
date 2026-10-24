---
title: Hadoop eco 운영 교육자료
status: draft
category: course
originated: 2026-10-04
written: 2026-10-04
approved:
author: Seonghyeon Lee
drafted-by: Claude
---

# Intent: Hadoop eco 운영 교육자료

## Problem statement

- 현재 운영 중인 as-is Hadoop eco 시스템의 데이터 파이프라인을 **운영 조직이 직접 운영**하려 한다. 이들은 코드나 고급 기술은 다루지 않지만, **장애 대응이나 DB 전환 같은 단순 작업은 스스로 하기를 원한다.**
- 그러려면 시스템이 어떻게 생겼는지, 어디를 보면 정상·비정상을 알 수 있는지, 어디까지 손대도 되는지를 수강자 눈높이로 설명한 자료가 필요하다. 지금은 없다.
- 설계·튜닝 작업은 to-be(Kubernetes) 시스템 기준으로 진행되어 왔고(`spark-tuning` 저장소), to-be는 아직 운영 전이라 교육 대상이 아니다.

## Proposed outcome

**산출물**

- PowerPoint(`.pptx`) — 메인. Windows PowerPoint에서 발표한다
- HTML — 보조. 이해를 돕는 시각 자료. 단일 파일로 Windows 브라우저에서 오프라인으로 열린다

**교육을 마친 수강자가 할 수 있어야 하는 것**

1. **개념·구조**
   - 데이터가 어디서 들어와 어떤 경로로 테이블에 쌓이는지를 그림 한 장으로 설명한다
   - Airflow · Spark · YARN · HDFS · Hive · Iceberg가 각각 무슨 역할인지 말할 수 있다
   - **Hive 테이블과 Iceberg 테이블의 차이**를 설명하고, 일부 테이블이 왜 두 곳에 동시에 적재되는지, Hive → Iceberg 전환으로 무엇을 얻고 잃는지 말할 수 있다
2. **모니터링**: Airflow UI · YARN UI · Spark UI에서 정상과 비정상을 구분한다
3. **장애 대응**
   - 허용된 조치(Airflow 프로세스 재시작, DAG 재실행)를 절차대로 수행한다
   - Airflow log를 읽고 증상을 1차 분류한다
   - 맡지 않는 조치는 하지 않고, 담당자에게 필요한 정보를 정리해 전달한다

## Affected users and systems

| 대상 | 내용 |
|------|------|
| 수강자 | 운영 담당자(코드는 다루지 않는다). Linux는 초보 수준, 서버 SSH 접속 권한 있음 [확인 필요: 인원] |
| 발표자 | 사용자 (Windows PC에서 발표·공유) |
| Airflow | 2.7.1, CeleryExecutor. 프로세스: airflow worker · scheduler · webserver · flower, PostgreSQL(metadata DB), pgpool, redis(Celery broker). DAG의 Spark 실행은 SparkSubmitOperator |
| Airflow 프로세스 수 | systemd service 기준 `airflow-worker.service` 3개, `airflow-scheduler.service` 2개, `airflow-webserver.service` 2개, `airflow-flower.service` 1개. Celery 설정(`[celery]`)은 기본값 |
| pgpool | PostgreSQL HA와 커넥션 풀 |
| Hadoop | 3.2.3 (HDFS, YARN) |
| Spark | 3.5.2, 클러스터 매니저 YARN. dynamic allocation 사용 안 함 |
| Hive · Tez | Hive 3.1.2, Tez 0.10.1 |
| Iceberg | 1.6.1 (`iceberg-spark-runtime-3.5_2.13-1.6.1`). 카탈로그는 Hive Metastore |
| 저장소·테이블 | HDFS만 사용. 테이블은 대부분 Hive, 일부 Iceberg. **Hive → Iceberg 전환 과도기** — 최근 전환한 테이블은 아직 Hive에도 동시 적재 중 |
| 파일 형식·파티션 | Hive `_raw`: TEXTFILE, 파티션 `dt`(varchar(8), YYYYMMDD) / Hive `_orc`: ORC, 파티션 `dt` / Hive `_temp`: ORC, 파티션 없음 / Iceberg: Parquet |
| 모니터링 도구 | Airflow UI, YARN UI, Spark UI(Spark History Server 운영 중) |
| Oracle DB | ① `get_jobs`가 조회하는 job_history 테이블 ② HMS(Hive Metastore) 스키마. **교육 전에 다른 버전의 Oracle DB로 전환** — Airflow · Spark · HMS 작업은 개발자가 수행 |
| 교육 대상 아닌 시스템 | Oracle 자체(DB 관리), Trino — 운영에서 사용하지만 다루지 않는다 |
| 제작 환경 | Mac (Claude Code). 발표·공유는 Windows |

## Constraints

사용자 결정 (2026-10-04):

- 교육 대상은 **as-is Hadoop eco 시스템만**이다. to-be(k8s) 시스템은 다루지 않는다
- 메인 기술은 Airflow, Spark, Iceberg. 내용은 개념·구조 / 모니터링 / 장애 대응
- **Hive도 다룬다** — Hive·Iceberg 개념과 비교, Hive → Iceberg 전환의 장단점. 현재는 전환 과도기로, 최근 전환한 테이블은 Hive·Iceberg 동시 적재 중이다
- Oracle, Trino는 교육 대상이 아니다
- **Oracle DB 전환은 개발자가 교육 전에 수행한다 (A안).** 교육은 **전환 후 상태**를 기준으로 하고, DB 전환은 배경 설명만 한다. 화면 캡처·설정 설명도 전환 후 기준으로 맞춘다
- **회사 템플릿을 쉽게 적용할 수 있게 만든다** — 템플릿 파일은 받을 수 없으므로 사용자가 Windows에서 직접 입힌다
- **수강자 대응 범위**
  - 코드에는 관여하지 않는다
  - 허용: Airflow 프로세스 재시작(systemctl 또는 ansible playbook), Airflow DAG 재실행, Airflow log 분석
  - Spark는 난이도가 있어 **Spark 로그까지는 보지 않는다.** Airflow log 수준까지만 확인할 수 있도록 설명한다
  - 난이도가 높거나 위험도가 높아 수강자에게 맡기면 안 되는 조치는 맡기지 않는다
- **Linux 사용법 자체는 가르치지 않는다.** 수강자는 Linux 초보지만 SSH 권한은 있다
- 재시작 명령어(systemctl, ansible playbook)는 **사용자가 추후 직접 기재**한다
- 회사 pptx 템플릿은 있으나 **공유할 수 없다**
- 메인 산출물은 pptx, 보조는 HTML
- 작업 저장소는 `spark-tuning`과 분리한 `hadoop-eco-edu`
- 기존 운영 관행은 필요하면 사용자가 추후 공유한다

사용자 답변 (2026-10-04, Open questions 해소):

- **DAG 재실행은 Airflow UI에서 수동 Trigger**로 한다
- DAG는 Spark를 **SparkSubmitOperator**로 실행한다
- Executor는 **CeleryExecutor**다
- Airflow 관련 프로세스: airflow worker / scheduler / webserver / flower, PostgreSQL, pgpool, redis

사용자 답변 (2026-10-04, 2차):

- **재실행 방법**: Airflow UI에서 Trigger DAG(config 없이) → PARAM 필드에 처리 날짜 입력. DAG는 처리 대상을 PARAM으로 받는다
- **중복 적재 없음**: job_history를 사용하므로 재실행해도 중복 적재되지 않는다
- **Hive 적재 방식**: Iceberg처럼 새 데이터만 append하지 않는다. `{테이블명}_raw`(TEXT)에 Insert한 뒤, `_raw` 테이블 전체를 ORC로 변환해 `{테이블명}_orc`(ORC)에 덮어쓴다
- **재시작 허용 범위**: Airflow 프로세스(worker · scheduler · webserver · flower)만. PostgreSQL · pgpool · redis는 위험도가 높아 불가
- **Spark 작업이 실행 중이면 worker 재시작 불가**
- **deploy mode는 cluster.** "Spark 로그를 보지 않는다"는 Spark UI까지 가서 로그를 보는 방법을 교육하지 않는다는 뜻이다. Airflow UI에 Spark driver log가 나오기는 하지만, 그것을 보는 방법도 교육 대상이 아니다
- **Flower UI는 일단 포함**하되 추후 제거할 수 있다

사용자 답변 (2026-10-04, 3차):

- **처리 범위 확인**: 실패한 DAG Run이 처리하려던 범위는 Task log에서 확인한다
- **PARAM**: 날짜 범위를 받고, 그 범위로 job_history를 조회한다 (사용자 설명: `spark-tuning`의 Iceberg 방식과 유사. 단 그쪽은 to-be 설계이므로 as-is 필드 이름·형식은 별도 확인)
- **worker 재시작 전 확인**: 실행 중인 Spark Task로 판단한다
- **재시작 방법**: ansible playbook에서 재시작할 프로세스를 지정하거나, systemctl로 개별 처리한다
- **Hive 적재 상세**: `_raw`에는 새 데이터가 계속 추가된다. 배치 주기가 되면 ORC로 변환해 `_temp` 테이블로 옮기고, `_orc`를 완전히 비운 뒤 `_temp`의 데이터 파일을 `hdfs mv`로 `_orc`에 옮긴다. 사용자는 예전 데이터는 `_orc`, 최근 데이터는 `_raw`에서 조회한다
- **job_history 설명 문구**: "어디까지 적재했는지 적어 두는 장부"가 대체로 맞지만 더 적절한 표현 검토 요청 → spec 3절에 "적재 대장" 안 제시

사용자 답변 (2026-10-04, 4차):

- **Hive 적재는 Spark가 아니라 Tez를 쓴다** — Hive SQL로 적재한다
- **`_raw`는 비우지 않는다.** retention 처리 때만 과거 데이터를 삭제한다
- **`_temp` 적재**: 변환 전에 `_temp`를 전부 비우고, `_raw`에서 대상 날짜 데이터를 select해 `_temp`에 쌓는다
- **Hive 변환 배치도 job_history를 쓴다.** Iceberg처럼 avro 경로를 받지 않고, 처리할 날짜만 받아 온다
- **처리 범위 확인 위치**: get_jobs Task log. 실패 내용은 Hive SQL 또는 Spark job에 해당하는 Airflow Task log

사용자 답변 (2026-10-08, 운영서버 정보):

- 버전: Hadoop 3.2.3, Spark 3.5.2, Hive 3.1.2, Tez 0.10.1, Iceberg 1.6.1(`iceberg-spark-runtime-3.5_2.13-1.6.1`), Airflow 2.7.1
- Airflow 프로세스 수: worker 3, scheduler 2, webserver 2, flower 1 (systemd service 이름 `airflow-<프로세스>.service`). `[celery]` 설정은 기본값
- pgpool 용도: PostgreSQL HA와 커넥션 풀
- as-is DAG의 `catchup`은 False
- Spark dynamic allocation은 쓰지 않는다
- Iceberg 카탈로그는 Hive Metastore, 저장소는 HDFS만 쓴다, 파일 형식은 Parquet
- Spark History Server를 운영한다 — 끝난 Spark 작업도 Spark UI로 볼 수 있다
- Hive 테이블: `_raw`(TEXTFILE)·`_orc`(ORC)는 `dt` 파티션(varchar(8), YYYYMMDD), `_temp`(ORC)는 파티션 없음. **중간 테이블 이름은 `_tmp`가 아니라 `_temp`** (정정)
- **DAG 기능 설명은 사용자가 직접 작성한다.** PARAM, get_jobs·job_history, 배치 주기, Hive SQL Task 실행 방식, `_orc` 교체 범위 같은 DAG 동작 상세는 Claude가 묻지 않고 `[사용자 작성: 무엇]` 자리표시자로 둔다

사용자 결정 (2026-10-22):

- 자료와 문서에서 **'비개발자'라는 표현을 쓰지 않는다.** 독자는 '수강자' 또는 '운영 담당자'로 부른다
- 작업물은 `spark-tuning`처럼 **MkDocs + GitHub Pages**로 게시해 브라우저에서 본다
- HTML 발표 자료는 **동적·반응형**으로 만든다 — 단계별 펼치기, 움직이는 데이터 흐름, 눌러서 펼치는 설명. 참고: dashmotion(흐름선·이동 점 기법), 사용자 Google Drive 폴더(이 환경에서 접근 불가 — 미확인)

사용자 결정 (2026-10-24):

- HTML 발표 자료는 **`samples/hadoop-eco-ops-sample.html`(9장 샘플) 방식을 기준**으로 만든다
- motion-template 기반 3쪽 샘플은 **폐기**한다 — 3쪽 고정 형식이라 슬라이드·도식을 늘릴 수 없고, 흐름선·인쇄 대응·pptx 대응 메모를 넣을 수 없다

기술·운영 제약:

- Airflow 2.7.1 기준으로 화면·용어를 쓴다. 3.x 화면·용어는 쓰지 않는다
- Linux를 가르치지 않으므로 터미널 작업은 **복사해 붙여 넣을 명령어 + 성공 시 화면(기대 출력)** 형태로만 제시한다. 수강자가 명령어를 조합하거나 고치게 하지 않는다
- 제작은 Mac, 발표는 Windows → pptx 폰트는 Windows 기본 폰트, HTML은 외부 의존성 없는 단일 파일
- `spark-tuning` 문서는 엔진 공통 개념 설명에만 참고하고, to-be 설정값·수치·인프라 구성은 인용하지 않는다

## Open questions

**범위**

- Hive·Iceberg 동시 적재 — 어떤 테이블인지, Hive 적재는 언제 끝나는지(교육 자료에 "과도기" 상태를 어떻게 적을지가 달라진다)
- ~~Iceberg 테이블의 구성~~ → 카탈로그 Hive Metastore, 저장소 HDFS, Parquet (2026-10-08)
- ~~Spark UI를 어디까지 볼 것인가~~ → Spark UI에서 로그를 보는 방법은 교육하지 않는다 (2026-10-04). 상태 확인(진행률·소요 시간·실패 개수)까지만 다룬다
- ~~Spark History Server 운영 여부~~ → 운영 중 (2026-10-08)
- Oracle·Trino를 전체 구조도에 이름만이라도 표시할지, 아예 뺄지

**교육 설계**

- 수강자 인원
- 교육 형태와 분량 — 총 시간, 회차, 실습 포함 여부
- ~~HTML 공유 방식~~ → GitHub Pages 게시 (2026-10-22). 단일 파일·오프라인 조건은 유지한다(파일로도 전달 가능). 저장소와 Pages 사이트는 공개(Public) 상태로 운영한다 — 서버 주소·계정 같은 접속 정보는 올리지 않는다 (2026-10-24)
- 회사 템플릿의 슬라이드 비율 — 사용자 답변 "일반적인 크기"(지금 확인 불가). **16:9로 만들고 시험 deck에서 확인한다.** 비율이 다르면 템플릿을 입힐 때 도식이 늘어나거나 찌그러진다
- 템플릿 적용 방식 검증 — 본 제작 전에 2~3장짜리 시험 deck을 만들어 사용자가 Windows에서 회사 템플릿을 입혀 본다. 레이아웃 매핑이 깨지면 제작 방식을 바꾼다 (`CLAUDE.md` "회사 템플릿 호환" 규칙)

**장애 대응 경계 — Claude 초안, 승인 필요**

사용자 기준("난이도가 높거나 위험도가 높으면 맡기지 않는다")을 적용한 초안이다. 운영 관행이 공유되면 갱신한다.

| 구분 | 조치 | 비고 |
|------|------|------|
| 허용 | Airflow UI · Flower · YARN UI · Spark UI 조회 | 읽기만. 로그 링크는 열지 않는다. Flower는 잠정 |
| 허용 | DAG 재실행 — Airflow UI Trigger DAG + PARAM에 처리 날짜 입력 | 확정(2026-10-04). job_history로 중복 적재 없음. [확인 필요: 실패 원인과 무관하게 해도 되는지, 횟수 제한] |
| 금지 후보 | 실패한 Task의 Clear | 재실행 방식이 Trigger로 확정되어 교육에서 쓰지 않는 기능. [확인 필요: 금지로 둘지] |
| 허용 | Airflow 프로세스 재시작 — worker · scheduler · webserver · flower | 확정(2026-10-04). [명령어: 사용자 기재]. [확인 필요: 어떤 증상일 때] |
| 금지 | Spark 작업 실행 중 worker 재시작 | 확정(2026-10-04) |
| 금지 | PostgreSQL · pgpool · redis 재시작 | 확정(2026-10-04) — 위험도 높음 |
| 허용 | Airflow log 확인과 증상 분류 | |
| 금지 | DAG 파일·코드 수정 | 확정 (코드 관여 금지) |
| 금지 후보 | Mark Success / Mark Failed | 실제로 처리되지 않은 데이터가 처리된 것으로 기록될 위험 |
| 금지 후보 | 과거 날짜 대량 재실행(backfill), DAG Run 삭제 | 중복 적재·부하 위험 |
| 금지 후보 | Airflow Variables · Connections · Pool 수정 | 전체 DAG에 영향 |
| 금지 후보 | DAG Pause/Unpause | 아래 설명 참조 |
| 금지 후보 | YARN application kill | 실행 중인 적재 중단 |
| 금지 후보 | HDFS 파일 삭제·이동, Hive/Iceberg 테이블 조작 | 데이터 유실 |

**DAG Pause/Unpause는 재실행이 아니다** (2026-10-04 사용자 질문에 대한 정리)

- **Pause**: scheduler가 그 DAG의 **새 DAG Run을 만들지 않게** 멈춘다. 이미 실행 중인 Task를 죽이지 않으며, 실패한 Task를 다시 돌리지도 않는다
- **Unpause**: scheduler가 다시 스케줄을 시작한다. 실패한 Task를 다시 돌리지 않는다. **위험은 여기에 있다** — DAG의 `catchup`이 켜져 있으면 멈춰 있던 동안 지나간 구간의 DAG Run을 **한꺼번에 만들어 실행**한다. 오래 멈췄다 풀면 사실상 대량 backfill이 된다
- **재실행**은 다른 기능이다
  - **Clear**: 특정 DAG Run(특정 날짜·구간)의 Task를 지우고 다시 실행한다. 실패한 날짜를 그대로 다시 처리한다
  - **Trigger DAG**: 지금 시각 기준으로 **새 수동 DAG Run을 하나 만든다.** 실패한 구간을 다시 처리하는 것이 아니다
- ~~as-is DAG들의 `catchup` 설정~~ → **False** (2026-10-08). Unpause해도 멈춰 있던 구간을 한꺼번에 실행하지 않고, 가장 최근 구간의 DAG Run 하나만 만든다(Airflow 2.7 문서의 catchup 동작). 대량 backfill 위험은 없지만 Unpause 직후 DAG Run이 바로 하나 생길 수 있다
- ~~교육에서 말하는 "DAG 재실행"이 Clear인지 Trigger인지~~ → **수동 Trigger로 확정** (2026-10-04)
- ~~Trigger로 실패한 날짜가 복구되는가~~ → 처리 대상을 PARAM으로 받으므로 Trigger 때 날짜를 입력해 복구한다 (2026-10-04)
- ~~재실행해도 중복 적재되지 않는가~~ → job_history로 중복 없음 (2026-10-04)
- ~~Trigger DAG와 w/ config 중 무엇을 쓰는지~~ → Trigger DAG, config 없이 PARAM 필드에 날짜 입력 (2026-10-04)
- ~~실패한 DAG Run이 처리하려던 날짜를 어디서 확인하는가~~ → get_jobs Task log (2026-10-04). [사용자 작성: 범위가 찍히는 줄 — 캡처로 확정]
- ~~여러 날짜가 실패하면 날짜마다 Trigger하는지~~ → PARAM이 날짜 범위라 범위 하나로 넣는다 (2026-10-04)
- [사용자 작성] PARAM 필드 이름, 입력 형식, DAG마다 같은지
- [사용자 작성] 스케줄 실행 때 PARAM이 어떻게 정해지는지(기본값)

**as-is 사실 (사용자 제공 대기)**

- ~~Spark 마이너 버전, Hive·Tez 버전, Iceberg 파일 형식~~ → 해소 (2026-10-08, Constraints 참조)
- ~~Airflow 구성 — Executor 종류, 프로세스 목록~~ → 해소 (2026-10-04, Constraints 참조)
- ~~worker 수, pgpool 용도, systemctl unit 이름~~ → 해소 (2026-10-08, Constraints 참조). 서버별 배치는 교육에 필요하지 않아 묻지 않는다
- ~~재시작 허용 범위, Spark 작업 중 worker 재시작, deploy mode, Flower 포함 여부~~ → 해소 (2026-10-04, Constraints 참조)
- ~~worker 재시작 전 판단 기준, playbook 재시작 범위, Hive 조회 대상~~ → 해소 (2026-10-04, Constraints 참조)
- worker가 여러 대일 때 재시작 전 확인 범위 — 해당 worker의 Task만 보면 되는지. Celery queue가 기본값이라 3대 모두 같은 queue를 받으므로, 어느 Task가 어느 worker에서 도는지는 Task Instance의 Hostname으로 구분해야 한다
- 교육에서 playbook과 systemctl 중 무엇을 가르칠지
- ~~`_raw` 누적 여부, 변환 범위, 변환 배치의 job_history 사용~~ → 해소 (2026-10-04, Constraints 참조)
- ~~Hive 파티션 사용 여부~~ → `_raw`·`_orc`는 `dt` 파티션, `_temp`는 없음 (2026-10-08)
- 실행 중인 Hive SQL Task도 worker 재시작 금지 조건인지 — worker가 Hive SQL 실행도 지켜보므로 Spark Task와 같은 위험이 있을 수 있다
- 재시작 명령어 (systemctl, ansible playbook) — 사용자 기재 예정
- 에스컬레이션 경로 — 누구에게, 어떤 정보(DAG 이름, Task, 시각, log 일부)를 전달하는지
- 과거 장애 사례와 기존 운영 관행
- 화면 캡처 확보 방법 — 운영 화면을 캡처해도 되는지, 마스킹이 필요한 정보(서버 주소, 계정 등)

**DAG 동작 상세 (사용자 작성 — Claude가 묻지 않는다)**

- `_orc`를 비우는 범위 — 대상 날짜(`dt` 파티션)만인지 `_orc` 전체인지
- `_orc`를 비운 뒤 `hdfs mv`로 옮겨 넣기 전에 배치가 실패했을 때 같은 날짜로 Trigger 재실행하면 복구되는지
- 배치 주기
- Hive SQL Task의 실행 방식(Operator), log에 YARN application ID가 찍히는지
- Spark를 Iceberg 적재에만 쓰는지
- job_history의 상태 값과 의미, get_jobs가 고르는 조건
- Iceberg 유지보수(Compaction, snapshot 정리) 작업 여부

**산출물 관리**

- 생성된 pptx·HTML을 저장소에 커밋할지, 별도 위치에 둘지
