---
title: Hadoop eco 운영 교육자료 (비개발자 대상)
status: draft
category: course
originated: 2026-10-04
written: 2026-10-04
approved:
author: Seonghyeon Lee
drafted-by: Claude
---

# Intent: Hadoop eco 운영 교육자료 (비개발자 대상)

## Problem statement

- 현재 운영 중인 as-is Hadoop eco 시스템의 데이터 파이프라인을 **비개발자 조직이 직접 운영**하려 한다. 이들은 개발 역량이 없어 코드나 고급 기술은 다룰 수 없지만, **장애 대응이나 DB 전환 같은 단순 작업은 스스로 하기를 원한다.**
- 그러려면 시스템이 어떻게 생겼는지, 어디를 보면 정상·비정상을 알 수 있는지, 어디까지 손대도 되는지를 비개발자 눈높이로 설명한 자료가 필요하다. 지금은 없다.
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
| 수강자 | 비개발자. Linux는 초보 수준, 서버 SSH 접속 권한 있음 [확인 필요: 인원] |
| 발표자 | 사용자 (Windows PC에서 발표·공유) |
| Airflow | 2.7.1 |
| Spark | 3.x, 클러스터 매니저 YARN [확인 필요: 마이너 버전] |
| 저장소·테이블 | HDFS. 테이블은 대부분 Hive, 일부 Iceberg. **Hive → Iceberg 전환 과도기** — 최근 전환한 테이블은 아직 Hive에도 동시 적재 중 |
| 모니터링 도구 | Airflow UI, YARN UI, Spark UI |
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
- **비개발자 대응 범위**
  - 코드에는 관여하지 않는다
  - 허용: Airflow 프로세스 재시작(systemctl 또는 ansible playbook), Airflow DAG 재실행, Airflow log 분석
  - Spark는 난이도가 있어 **Spark 로그까지는 보지 않는다.** Airflow log 수준까지만 확인할 수 있도록 설명한다
  - 난이도가 높거나 위험도가 높아 비개발자에게 맡기면 안 되는 조치는 맡기지 않는다
- **Linux 사용법 자체는 가르치지 않는다.** 수강자는 Linux 초보지만 SSH 권한은 있다
- 재시작 명령어(systemctl, ansible playbook)는 **사용자가 추후 직접 기재**한다
- 회사 pptx 템플릿은 있으나 **공유할 수 없다**
- 메인 산출물은 pptx, 보조는 HTML
- 작업 저장소는 `spark-tuning`과 분리한 `hadoop-eco-edu`
- 기존 운영 관행은 필요하면 사용자가 추후 공유한다

기술·운영 제약:

- Airflow 2.7.1 기준으로 화면·용어를 쓴다. 3.x 화면·용어는 쓰지 않는다
- Linux를 가르치지 않으므로 터미널 작업은 **복사해 붙여 넣을 명령어 + 성공 시 화면(기대 출력)** 형태로만 제시한다. 수강자가 명령어를 조합하거나 고치게 하지 않는다
- 제작은 Mac, 발표는 Windows → pptx 폰트는 Windows 기본 폰트, HTML은 외부 의존성 없는 단일 파일
- `spark-tuning` 문서는 엔진 공통 개념 설명에만 참고하고, to-be 설정값·수치·인프라 구성은 인용하지 않는다

## Open questions

**범위**

- Hive·Iceberg 동시 적재 — 어떤 테이블인지, Hive 적재는 언제 끝나는지(교육 자료에 "과도기" 상태를 어떻게 적을지가 달라진다)
- Iceberg 테이블의 구성 — 카탈로그(Hive Metastore인지), 저장 위치(HDFS인지)
- Spark UI를 어디까지 볼 것인가 — Spark 로그는 제외로 확정했다. Spark UI도 "실행 중 / 실패 / 소요 시간" 확인 수준에서 멈추는지
- Oracle·Trino를 전체 구조도에 이름만이라도 표시할지, 아예 뺄지

**교육 설계**

- 수강자 인원
- 교육 형태와 분량 — 총 시간, 회차, 실습 포함 여부
- HTML 공유 방식 — 파일 전달인지, 사내 서버 게시인지
- 회사 템플릿의 슬라이드 비율 — 사용자 답변 "일반적인 크기"(지금 확인 불가). **16:9로 만들고 시험 deck에서 확인한다.** 비율이 다르면 템플릿을 입힐 때 도식이 늘어나거나 찌그러진다
- 템플릿 적용 방식 검증 — 본 제작 전에 2~3장짜리 시험 deck을 만들어 사용자가 Windows에서 회사 템플릿을 입혀 본다. 레이아웃 매핑이 깨지면 제작 방식을 바꾼다 (`CLAUDE.md` "회사 템플릿 호환" 규칙)

**장애 대응 경계 — Claude 초안, 승인 필요**

사용자 기준("난이도가 높거나 위험도가 높으면 맡기지 않는다")을 적용한 초안이다. 운영 관행이 공유되면 갱신한다.

| 구분 | 조치 | 비고 |
|------|------|------|
| 허용 | Airflow UI · YARN UI · Spark UI 조회 | 읽기만 |
| 허용 | 실패한 Task의 Clear(재실행) | [확인 필요: 실패 원인과 무관하게 해도 되는지, 횟수 제한] |
| 허용 | Airflow 프로세스 재시작 | [명령어: 사용자 기재]. [확인 필요: 어떤 증상일 때] |
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
- [확인 필요] as-is DAG들의 `catchup` 설정. 이 값에 따라 Unpause의 위험도가 달라진다
- [확인 필요] 교육에서 말하는 "DAG 재실행"이 Clear인지 Trigger인지, 둘 다인지. 데이터 구간을 처리하는 DAG라면 실패 복구는 Clear가 맞다

**as-is 사실 (사용자 제공 대기)**

- Spark 마이너 버전
- Airflow 구성 — Executor 종류, 서버 대수, 프로세스 목록(scheduler, webserver, worker 등)과 systemctl unit 이름
- 재시작 명령어 (systemctl, ansible playbook) — 사용자 기재 예정
- 에스컬레이션 경로 — 누구에게, 어떤 정보(DAG 이름, Task, 시각, log 일부)를 전달하는지
- 과거 장애 사례와 기존 운영 관행
- 화면 캡처 확보 방법 — 운영 화면을 캡처해도 되는지, 마스킹이 필요한 정보(서버 주소, 계정 등)

**산출물 관리**

- 생성된 pptx·HTML을 저장소에 커밋할지, 별도 위치에 둘지
