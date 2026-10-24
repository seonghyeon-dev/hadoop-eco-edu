# Hadoop eco 운영 교육자료

현재 운영 중인 **as-is Hadoop eco 시스템**의 데이터 파이프라인(Airflow · Spark · Iceberg)을 **운영 담당자**에게 가르치는 교육자료를 만든다. **당분간 HTML만으로 발표한다**(사용자 2026-10-24). PowerPoint(`.pptx`)는 필요해지면 전환하고, 아래 pptx 규칙은 그때 적용한다.

작업의 배경·범위·미결 사항은 `intent/course/hadoop-eco-ops/intent.md`가 단일 원천이다. 이 파일은 **모든 작업에 적용되는 규칙**만 담는다.

## 교육 범위 — as-is만

| 구분 | 내용 |
|------|------|
| **대상 시스템** | as-is Hadoop eco: Airflow 2.7.1, Spark 3.5.2 on **YARN**, Hive 3.1.2 SQL on **Tez** 0.10.1(Hive 적재 엔진), Hadoop 3.2.3(HDFS·YARN), Iceberg 1.6.1, Hive 테이블(대부분) + Iceberg 테이블(일부, 일부는 Hive와 동시 적재) |
| **메인 기술** | Airflow, Spark, Iceberg. **Hive도 다룬다** — Hive·Iceberg 개념 비교, Hive → Iceberg 전환의 장단점 |
| **교육 내용** | ① 기술·시스템 개념과 구조 ② 모니터링 방법 ③ 장애 대응 |
| **모니터링 도구** | Airflow UI, YARN UI, Spark UI. Flower 화면은 다루지 않는다(사용자 2026-10-24) — flower는 재시작 대상 프로세스로만 남는다 |
| **제외** | to-be(Kubernetes) 시스템 전부 — Spark on K8s, SparkKubernetesOperator, MinIO/S3, S3FileIO 등. **Oracle, Trino** — 운영에서 쓰지만 교육 대상이 아니다. Oracle DB 전환(job_history·HMS 스키마)은 개발자가 교육 전에 수행하며, 교육에서는 배경 설명만 한다 |

- **to-be 혼입 금지.** 형제 저장소 `../spark-tuning`은 to-be(k8s) 기준 설계·튜닝 문서다. Iceberg snapshot, 파티션, Compaction 같은 **엔진 공통 개념**을 설명할 때만 참고하고, 그쪽의 설정값·수치·버전·인프라 구성(k8s, MinIO, Airflow 3.x)은 인용하지 않는다. 참조만 하고 수정하지 않는다
- **Airflow 2.7.1 기준.** 화면 이름·메뉴·용어를 3.x 것으로 쓰지 않는다

## 독자와 대응 범위

- **독자는 운영 담당자다.** 코드를 읽거나 고치지 않는다. 목표는 장애 대응 같은 단순 운영 작업을 스스로 하는 것이다
- **Linux는 초보 수준이고, Linux 사용법은 가르치지 않는다** (SSH 권한은 있다). 터미널 작업은 **복사해 붙여 넣을 명령어 + 성공 시 화면(기대 출력)**으로만 제시한다. 명령어를 조합하거나 고치게 하지 않는다
- **수강자가 하는 조치는 다음뿐이다**: Airflow 프로세스(worker · scheduler · webserver · flower) 재시작(systemctl 또는 ansible playbook), Airflow DAG 재실행(UI에서 Trigger DAG + PARAM에 처리 날짜 입력), Airflow log 확인. PostgreSQL · pgpool · redis · redis-sentinel 재시작과 Spark 작업 실행 중 worker 재시작은 금지
- **Spark 로그 분석은 범위 밖이다.** Spark/YARN/Spark UI는 "상태를 보고 판단·전달하는" 수준까지만 가르치고, 원인 분석은 Airflow log 수준에서 멈춘다. Spark UI·YARN UI에서 로그를 여는 방법, Airflow log에 섞여 나오는 Spark driver log를 읽는 방법은 가르치지 않는다. Tez도 같다 — 이름·역할과 YARN UI 상태까지만 다루고 Tez UI·로그는 다루지 않는다
- **수강자가 할 수 있는 조치만 가르친다** (사용자 2026-10-24). 금지 조치 목록은 슬라이드에 넣지 않는다. 맡지 않는 상황은 "누구에게 무엇을 전달할지"로 안내하고, 조치에 붙는 안전 조건(예: 실행 중인 Spark Task가 있으면 worker를 재시작하지 않는다)은 그 조치의 절차 안에 둔다

## 작성 규칙

- **결과물과 설명은 한글로 쓴다.** 기술 용어는 영어 원어를 쓴다(DAG, Task, Executor, Compaction, snapshot 등 — 한글 음차·번역 금지)
- **처음 쓰는 용어는 그 자리에서 쉬운 말로 설명한다.** 비유를 쓰되, 비유가 실제 동작과 어긋나는 지점이 있으면 함께 적는다
- **화면 기준으로 설명한다.** "어느 화면의 어디를 보면 무엇이 보이고, 그것이 무슨 뜻인지" 순서로 쓴다
- 슬라이드 1장에는 메시지 1개만 담는다
- **슬라이드 제목은 짧은 제목형으로 쓴다** (사용자 2026-10-24). "데이터 적재 흐름", "구성요소별 역할"처럼 쓰고, "구성요소는 각각 한 가지 역할을 맡는다" 같은 설명 문장을 제목으로 쓰지 않는다. 설명은 본문과 시각 자료가 맡는다
- **내용 슬라이드에는 이해를 돕는 시각 자료를 화면 안에 둔다** (사용자 2026-10-24). dashmotion 애니메이션 도식, archify 도식, 아이콘 등 상황에 맞는 것을 쓴다. `D`로 여는 도식은 추가 설명용이고 화면 안 시각 자료를 대신하지 않는다
- **공식 로고와 아이콘을 전체 슬라이드에서 적극 쓴다** (사용자 2026-10-24). 구성요소가 나오면 그 프로젝트의 공식 로고(`deck/logos/`)를, 개념 · 비유에는 아이콘(`deck/icons/`, Lucide)을 붙인다. archify 도식에도 노드의 `brand`로 로고를 단다(Airflow · PostgreSQL · redis는 내장, Spark · Hive · Hadoop · Iceberg는 공식 사이트, Tez는 `https://tez.apache.org/images/ApacheTezIcon.png`에서 `brands capture`)
- **화면에 보이는 장 번호는 `01`~`07`로 쓴다** (사용자 2026-10-24). `M<n>-<nn>`은 제작 · 검토용 ID로만 쓰고 슬라이드 화면에는 보이지 않게 한다
- **비유와 실제 동작이 어긋나는 곳은 비유 뒤에 "단, …"으로 이어 적는다** (사용자 2026-10-24). "다른 점", "실제로는" 같은 꼬리표를 쓰지 않는다
- 커밋 메시지는 한글로 쓴다
- **'비개발자'라는 표현을 쓰지 않는다** (사용자 2026-10-22). 문서에서 독자는 '수강자' 또는 '운영 담당자'로 부른다
- **슬라이드에는 듣는 사람에게 필요한 내용만 둔다** (사용자 2026-10-24). '교육생 · 수강자 · 비개발자' 같은 대상 지칭, 교육 범위 설명("우리는 ~를 보지 않는다"), 교육자용 판단 근거는 슬라이드에 쓰지 않고 발표 메모에만 둔다. 필요 없는 내용은 설명하지 않으면 될 뿐, "이건 몰라도 된다"고 적지 않는다
- **발표 슬라이드에 맞는 표현을 쓴다** (사용자 2026-10-24). "장애가 나면 이 한 장만 보면 된다" 같은 구어 · 광고 문구 대신 "장애 대응 요약"처럼 제목다운 표현을 쓴다

## 사실 출처 규칙

- **as-is 사실(버전, 서버 구성, 서비스 이름, 명령어, 화면, 운영 관행)은 사용자가 제공한 것만 쓴다.** 모르면 추정하지 말고 `[확인 필요: 무엇]` 마커를 남긴 뒤 사용자에게 묻는다
- **명령어(systemctl unit 이름, ansible playbook 명령)는 사용자가 직접 기재한다.** Claude는 자리표시자 `[명령어: 사용자 기재]`만 둔다. 수강자가 그대로 따라 칠 절차라서 틀리면 장애가 난다
- **DAG 동작 상세(PARAM, get_jobs·job_history, 배치 주기, Task 실행 방식 등)는 사용자가 직접 작성한다.** Claude는 묻지 않고 자리표시자 `[사용자 작성: 무엇]`만 둔다
- **교육은 Oracle DB 전환 후에 진행한다.** 화면 캡처·설정·구성 설명은 전환 후 상태 기준이다
- 공식 문서 기반의 일반 개념(예: Airflow task 상태의 의미)은 써도 된다. 단 **Airflow 2.7 / Spark 3.5 / Hive 3.1 / Iceberg 1.6 문서** 기준이어야 한다

## 산출물 규칙 — Mac에서 만들고 Windows에서 발표

- **pptx 폰트는 Windows 기본 폰트를 쓴다**(`맑은 고딕` 등). Mac에만 있는 폰트(Apple SD Gothic Neo 등)를 쓰면 발표 PC에서 글자가 바뀌어 레이아웃이 깨진다
- pptx 생성은 `anthropic-skills:pptx` 스킬을 쓴다. 스킬의 시각 QA(슬라이드 → 이미지 렌더링 → 확인)에 필요한 로컬 도구는 아래 "도구" 절을 따른다
- **HTML은 단일 파일, 외부 의존성 없이 만든다.** CDN·웹폰트를 쓰지 않는다. 파일 하나만 전달받아 Windows 브라우저에서 오프라인으로 열려야 한다
- **HTML 발표 자료는 동적·반응형으로 만든다** (사용자 2026-10-22). 슬라이드 안의 내용은 → 키로 한 단계씩 펼치고, 질문이 나올 만한 곳은 눌러서 펼치게 한다. 단 **움직임 없이도 내용이 다 전달돼야 한다** — 좁은 화면·인쇄·움직임 줄이기 설정에서는 모든 단계를 펼친 정지 화면으로 보인다
- **도식은 시각화 도구로 만든다** (사용자 2026-10-24). archify를 기본으로 하고, 흐름을 움직임으로 보여 줘야 이해가 쉬운 곳은 dashmotion 등 상황에 맞는 도구를 적극 쓴다. 슬라이드에는 요점을 HTML로 두고, 자세한 설명은 `D`(또는 '자세히' 버튼)로 archify 도식을 전체 화면으로 열어 한다. archify 도식은 `samples/archify/`의 JSON을 고쳐 다시 렌더링한 뒤 `embed.py`로 발표 HTML 안에 넣는다 — 발표 파일은 여전히 하나다. 누르거나 끌어서 조작하는 시연은 HTML로 둔다
- HTML의 동적 표현마다 발표 메모에 **pptx 대응**(PowerPoint 애니메이션 '나타내기' 순서, 슬라이드 분할 + '모핑' 전환 등)을 적는다. pptx로 전환할 때 HTML에서만 되는 표현을 무엇으로 바꿀지 정해 두려는 것이다

### 회사 템플릿 호환

pptx로 전환할 때 적용한다. 회사 pptx 템플릿은 공유받을 수 없다. 사용자가 Windows PowerPoint에서 직접 입히므로, **템플릿을 입혔을 때 내용이 그대로 따라오도록** 만든다.

- **표준 레이아웃을 쓴다** — 제목 슬라이드 / 제목 및 내용 / 구역 머리글 / 콘텐츠 2개 / 제목만 / 빈 화면. 레이아웃을 새로 만들지 않는다. 템플릿을 입힐 때 PowerPoint가 레이아웃 이름으로 짝을 짓기 때문이다
- **제목과 본문 텍스트는 placeholder에 넣는다.** 텍스트 상자를 직접 배치하면 템플릿의 글꼴·위치를 따라가지 않는다. 도식 안의 라벨만 예외다
- **배경·로고·장식선·쪽 번호 스타일은 넣지 않는다.** 템플릿이 담당한다
- **색과 글꼴은 테마 값(테마 색 `accent1~6`, 테마 글꼴)을 참조한다.** hex 색·글꼴 이름을 슬라이드에 직접 박으면 템플릿을 입혀도 바뀌지 않는다. 테마 글꼴은 Windows 기본 폰트로 둔다
- **도식은 PowerPoint 도형으로 그린다**(이미지 금지 — 템플릿 색을 못 따라가고 수정도 안 된다). 화면 캡처만 이미지로 넣는다
- 슬라이드 비율은 **16:9**로 만든다. 회사 템플릿 비율은 미확인("일반적인 크기") — 시험 deck에서 확인한다
- 본 제작 전에 2~3장짜리 시험 deck으로 사용자가 템플릿 적용을 검증한다. 템플릿 적용 방법(PowerPoint 메뉴 순서)은 산출물과 함께 안내 문서로 제공한다

## 도구

| 도구 | 용도 | 상태 |
|------|------|------|
| `pptxgenjs` (npm) | pptx 생성 | 미설치 |
| LibreOffice | pptx → PDF (시각 QA) | 미설치 |
| Poppler (`pdftoppm`) | PDF → 이미지 (시각 QA) | 미설치 |
| `markitdown[pptx]`, `pillow`, `defusedxml`, `lxml` (pip) | 내용 추출·검증 | 미설치 |
| `mkdocs-material`, `mkdocs-same-dir` (pip, `requirements-docs.txt`) | 문서 사이트 빌드 | GitHub Actions에서 설치 |
| [archify](https://github.com/tt-a1i/archify) 3.2.0 | 도식 렌더링 (`node bin/archify.mjs finalize <type> <json> <html> --quality showcase`). Node 18 이상, 자동 검사에 Chrome 필요. 결과 HTML에 렌더러 코드가 들어간다(MIT) | 저장소 밖에 clone해서 쓴다 |
| [Lucide](https://lucide.dev) (`lucide-static`) | 슬라이드 아이콘. 쓰는 SVG만 `deck/icons/`에 복사 | 필요할 때 npm 패키지에서 복사 |
| [dashmotion](https://github.com/csthink/dashmotion) | 흐름 애니메이션 도식 (Claude skill, 단일 HTML/SVG). 결과물에 코드가 들어가면 MIT 고지 | 미설치 — 처음 쓸 때 설치 여부 확인 |

- LibreOffice는 없는 폰트를 대체해 그린다. QA 미리보기를 믿으려면 pptx에 지정한 폰트를 Mac에도 설치해야 한다

## 작업 흐름

- **intent → spec → plan.** `intent/<분류>/<slug>/` 폴더에 `intent.md`(왜·제약·미결) → `spec.md`(확정 내용) → `plan.md`(제작 순서)를 둔다. 작성 규칙은 `intent/README.md`
- 하나 보여주고 승인받고 다음으로 간다
- 저장소에 새 파일·폴더를 만들기 전에 위치와 이름을 사용자에게 확인한다
- **03 DAG별 기능 장은 외부 접속이 제한된 작업공간에서 내부 LLM(GLM 5.3)으로 따로 만든다** (사용자 2026-10-24). 그쪽은 이 저장소를 받을 수만 있고 올릴 수 없다. 그쪽 파일은 `-local` 이름(`.gitignore`)으로 두어 공개 저장소에 섞이지 않는다 — 안내는 `deck/DAG-작업안내.md`. 이 저장소에서는 `-local` 파일을 만들지 않는다
- **작업물은 MkDocs + GitHub Pages로 게시한다** (사용자 2026-10-22, `spark-tuning`과 같은 방식). `main`에 push하면 `.github/workflows/docs.yml`이 `mkdocs build --strict`로 빌드해 배포한다. 새 문서는 `mkdocs.yml`의 `nav`에 추가하고, 깨진 링크가 있으면 빌드가 실패한다. `samples/`의 HTML은 변환 없이 그대로 게시된다

## 파일 구조

```
├── CLAUDE.md
├── README.md                         # 문서 사이트 홈 (MkDocs index)
├── mkdocs.yml                        # MkDocs Material 설정 (docs_dir = 저장소 루트)
├── requirements-docs.txt             # 문서 사이트 빌드 의존성
├── assets/extra.css                  # 문서 사이트 스타일 보정 (맑은 고딕, 한글 줄바꿈, 표 폭)
├── .github/workflows/docs.yml        # main push 시 GitHub Pages 배포
├── .gitignore
├── intent/
│   ├── README.md                     # intent/spec/plan 작성 규칙과 목록
│   └── course/
│       └── hadoop-eco-ops/
│           ├── intent.md             # 교육 과정 전체의 intent
│           ├── spec.md               # 커리큘럼 spec (79장, 2026-10-24 승인)
│           └── plan.md               # 제작 계획 — 산출물 위치, 제작 순서, 검수
├── deck/                             # 발표 자료 본편 (plan.md 1절)
│   ├── hadoop-eco-ops-1.html         # 개념편 M0–M5 — build.py가 만든 결과, 직접 고치지 않는다
│   ├── hadoop-eco-ops-2.html         # 실무편 M6–M8 — 〃
│   ├── build.py                      # 모듈 원본을 이어 붙이고 도식 · 캡처를 넣는다. 파일 분할은 PARTS에서
│   ├── DAG-작업안내.md               # 03 DAG별 기능 장을 제한된 작업공간에서 만드는 안내
│   ├── src/                          # base.css · deck.js · shell.html(공통 틀), M<n>.html(모듈 원본)
│   ├── diagrams/                     # D<번호>-<이름>.json(도식 입력) · .html(렌더링 결과)
│   ├── icons/                        # 슬라이드 아이콘 (Lucide, ISC — LICENSE 포함). 쓰는 것만 복사해 둔다
│   ├── logos/                        # 프로젝트 공식 로고 (ASF 상표, 출처는 logos/README.md)
│   └── captures/                     # 화면 캡처 (마스킹한 것만)
└── samples/
    ├── hadoop-eco-ops-sample.html    # HTML 발표 샘플 8장 — 개요는 HTML, 도식은 archify(D 키). 샘플일 뿐, 내용은 다시 고친다
    └── archify/                      # archify 도식 — <이름>.json(입력)을 고쳐 <이름>.html로 렌더링
        ├── airflow-processes.*       # Airflow 프로세스 구성과 서버 배치 (architecture)
        ├── data-flow.*               # 데이터가 테이블에 쌓이는 길 (dataflow)
        ├── hive-batch.*              # Hive 적재 6단계 (workflow)
        ├── hive-iceberg-timeline.*   # 적재 중 조회 — Hive와 Iceberg (timeline, 예시 시각)
        └── embed.py                  # 렌더링한 도식을 발표 HTML 안에 넣는다
```

산출물 폴더(원고·pptx·HTML·이미지)는 `plan.md`에서 정한다.
