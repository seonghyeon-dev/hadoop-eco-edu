# 03 DAG별 기능 — 제한된 작업공간 작업 안내

발표 자료의 **03 DAG별 기능** 장은 외부 접속이 제한된 작업공간에서 내부 LLM(GLM 5.3)으로 따로 만든다. 이 문서는 그쪽에서 작업하는 사람과 LLM이 읽는 안내다. 저장소의 `CLAUDE.md`(작업 규칙)가 먼저이고, 이 문서는 그 규칙을 이 장에 맞게 줄여 적은 것이다.

## 1. 작업 환경

- 이 저장소는 그 작업공간에서 **받을 수(clone · pull)는 있지만 올릴 수(push)는 없다.** 그쪽에서 만든 파일은 그쪽에만 남는다
- 공개 저장소(GitHub, GitHub Pages)는 누구나 볼 수 있다. **내부 정보(DAG 이름 · 테이블 이름 · 서버 주소 · 계정 등)가 들어간 파일은 공개 저장소로 옮기지 않는다**
- 공개 저장소의 변경(공통 틀, 다른 장)은 `git pull`로 받는다. 아래 2절의 파일 이름 규칙을 지키면 충돌하지 않는다
- **공개 쪽 발표 파일에는 03 장 내용이 없다(구역 머리글만).** 03 장은 그쪽에서 따로 만들고, 다 만든 뒤 **내부에서 최종 취합**한다 — 7절
- 쓰는 도구
  - **Claude CLI**(모델 GLM 5.3): 저장소 폴더에서 실행하면 `CLAUDE.md`를 자동으로 읽는다. 이 문서도 읽게 한다 — "deck/DAG-작업안내.md를 읽고 시작해"
  - **VS Code Continue**(채팅): `CLAUDE.md`, 이 문서, `deck/src/M1.html`(본보기)을 대화에 첨부하고 시작한다

## 2. 맡는 파일 — 이름 규칙

| 무엇 | 파일 | 공개 저장소에 |
|------|------|------|
| 이 장의 슬라이드 | `deck/src/M3-local-<두 자리 번호>-<짧은 이름>.html` (예: `M3-local-10-ingest.html`) | 올라가지 않는다(`.gitignore`) |
| 이 장의 도식 | `deck/diagrams/D3<n>-local-<이름>.json` · `.html` (D30 ~ D49) | 〃 |
| 이 장의 화면 캡처 | `deck/captures/<이름>-local.png` | 〃 |
| 새로 쓰는 아이콘 | `deck/icons/<이름>-local.svg` (`<svg data-icon="<이름>-local">`) | 〃 |
| 새로 쓰는 로고 | `deck/logos/<이름>-local.png` (`<img data-logo="<이름>-local">`) | 〃 |
| 공개해도 되는 일반 내용 | `deck/src/M3.html` (구역 머리글 등) | 공개 저장소 쪽에서 만든다 |

- 이름에 `-local`이 들어간 파일은 `.gitignore`에 걸려 **커밋되지 않고, `git pull`과 충돌하지 않는다.** 공개 쪽에 이미 있는 아이콘 · 로고(`deck/icons/`, `deck/logos/`)는 그대로 쓰고, 없는 것만 `-local`로 추가한다
- `deck/build.py`는 `M3.html` 다음에 `M3-*.html`을 이름순으로 이어 붙인다. 파일 하나에 슬라이드 여러 장을 넣어도 되고, DAG마다 파일을 나눠도 된다
- **그 밖의 파일(base.css, deck.js, shell.html, build.py, 다른 장의 M<n>.html)은 고치지 않는다.** 바꿀 필요가 있으면 무엇을 왜 바꿔야 하는지 적어 사용자에게 전달한다(사용자가 공개 저장소 쪽에 요청)

## 3. 꼭 지킬 규칙 (CLAUDE.md 요약)

- 한글로 쓰고, 기술 용어는 영어 원어로 쓴다(DAG, Task, PARAM, Operator …)
- **슬라이드 제목은 짧은 제목형**으로 쓴다 — "적재 DAG 구성", "get_jobs의 역할"처럼. "~는 ~한다" 같은 설명 문장을 제목으로 쓰지 않는다
- **화면 안에 시각 자료를 둔다** — 흐름은 움직이는 도식(흐르는 점선 · 이동하는 점), 구성요소는 공식 로고(`<img data-logo="airflow">`), 개념은 아이콘(`<svg data-icon="...">`). 글만 있는 슬라이드를 만들지 않는다
- 화면에 보이는 장 번호는 `03`이다(예: 머리 줄 `03 DAG별 기능`). `M3-..` 슬라이드 ID는 화면에 보이지 않는 제작용 ID다
- 비유가 실제 동작과 어긋나는 곳은 비유 뒤에 "단, …"으로 이어 적는다
- 슬라이드에 "교육생 · 수강자 · 비개발자" 같은 대상 지칭, "~는 몰라도 된다" 같은 범위 설명, 구어 문구("이 한 장만 보면 된다")를 쓰지 않는다. 발표자만 알면 되는 내용은 발표 메모(`<template class="note">`)에 둔다
- **사실은 사용자가 준 것만 쓴다.** 모르면 지어내지 말고 `[확인 필요: 무엇]`을 남긴다. 명령어는 `[명령어: 사용자 기재]` 자리표시자만 둔다
- Airflow 2.7.1 기준으로 쓴다(3.x 화면 · 용어를 쓰지 않는다)
- 이미 확정된 사실(사용자 제공): DAG는 처리 날짜 하나를 PARAM으로 받는다 — `"2026-10-24"` 같은 문자열. get_jobs Task가 그 날짜로 job_history를 조회해 처리 대상을 고르고, job_history 덕분에 다시 실행해도 중복 적재되지 않는다. 처리 날짜는 get_jobs Task log에서 확인한다. Hive 적재는 Hive SQL(Tez), Iceberg 적재는 Spark(SparkSubmitOperator, cluster 모드)
- 수강자가 하는 조치는 DAG 재실행(Trigger DAG + PARAM), Airflow 프로세스 재시작, Airflow log 확인뿐이다. 그 밖의 조치는 "담당자에게 전달"로 안내한다

## 4. 슬라이드 만드는 법

본보기는 `deck/src/M1.html`이다. 슬라이드 한 장의 뼈대:

```html
<section class="slide" data-id="M3-10" data-arch="D30" aria-label="M3-10 적재 DAG 구성">
  <div class="in">
    <div class="head">
      <div class="eb">03 DAG별 기능</div>
      <h2>적재 DAG 구성</h2>
    </div>
    <div class="content">
      <div class="split">
        <div class="dia"><svg viewBox="0 0 660 380"> … 흐름 도식 … </svg></div>
        <ol class="xl">
          <li data-at="1"><span class="no">1</span><b>get_jobs</b><p>설명 …</p></li>
          <li class="acc" data-at="2"><span class="no">2</span><b>…</b><p>…</p></li>
        </ol>
      </div>
      <div class="morebar">
        <span class="hint">상자를 누르면 설명이 열린다</span>
        <button class="more" type="button" data-arch="D30">자세히 — … 도식 <kbd>D</kbd></button>
      </div>
    </div>
    <div class="meta"><span class="id"><b>M3-10</b> · 콘텐츠 2개 · 도식 D30</span><span class="dots"></span></div>
  </div>
  <template class="note"><ul><li>발표 메모 — 진행 순서, 짚을 점</li></ul></template>
</section>
```

쓸 수 있는 요소(스타일은 `deck/src/base.css`에 이미 있다):

| 요소 | 쓰임 |
|------|------|
| `data-at="k"` | → 키 k번째 단계에서 나타난다. `data-dim="k"`는 k단계 전까지 흐리게 |
| `.split` + `.xl` | 왼쪽 그림, 오른쪽 단계별 설명 (M1-02) |
| `.ovw` · `.ovr` · `.chain` · `.chip` | 줄 단위 요약과 이름표 칩 |
| `.cards` · `.card` | 카드 묶음 (M1-03) |
| `.steplist` (`li data-goto="k"`) | 누르면 그 단계로 가는 단계 목록 |
| `.hot data-info="키"` + `<template data-info="키" data-title="이름">` | 누르면 설명이 열린다 |
| `<img data-logo="airflow">` · SVG 안 `<image data-logo="spark" …/>` | 공식 로고 — `deck/logos/` (airflow, spark, hive, tez, iceberg, hadoop) |
| `<svg data-icon="이름"></svg>` | 아이콘 — `deck/icons/`. 새 아이콘은 npm `lucide-static`의 `icons/`에서 복사(ISC) |
| 인라인 SVG 흐름 | `.flow c-acc`(흐르는 점선) + `<circle class="dot"><animateMotion path="…"/></circle>`(이동하는 점). 점의 `path`는 연결선의 `d`와 같게. M1-02 참조 |

## 5. 도식 (D30 ~ D49)

- **archify**(자세히 보기 `D`): `git clone https://github.com/tt-a1i/archify` 후
  ```
  node <archify>/archify/bin/archify.mjs finalize <type> deck/diagrams/D30-local-이름.json deck/diagrams/D30-local-이름.html --quality showcase
  ```
  JSON의 `meta.output`은 `deck/diagrams/D30-local-이름.html`, `meta.locale`은 `ko`. 형식(workflow · dataflow · architecture 등)과 작성법은 archify의 `archify/SKILL.md`. 노드에 `"brand": "apache-airflow"`(내장: apache-airflow, postgresql, redis)로 로고를 단다. 자동 검사(browser-check)에는 Chrome이 필요하다
- **dashmotion 방식**: 화면 안 흐름 도식은 인라인 SVG로 직접 그린다(4절). 점선 주기와 `stroke-dashoffset` 변화량을 맞추고, 점은 연결선 위로만 움직이게 한다

## 6. 빌드와 확인

```
python3 deck/build.py          # deck/hadoop-eco-ops-1.html이 만들어진다 (03 장 포함)
```

브라우저로 `deck/hadoop-eco-ops-1.html`을 열어 확인한다 — `→` 단계, `D` 도식, `N` 발표 메모(슬라이드 ID가 보인다), `O` 전체 보기.

확인 목록:

- [ ] 제목이 짧은 제목형인가
- [ ] 슬라이드마다 화면 안에 시각 자료(도식 · 로고 · 아이콘)가 있는가
- [ ] 글자가 넘치거나 겹치지 않는가 (넓은 화면 · 좁은 화면)
- [ ] 모르는 사실을 지어내지 않고 `[확인 필요: …]`로 남겼는가
- [ ] 슬라이드 본문에 대상 지칭 · 범위 설명 · 구어 문구가 없는가
- [ ] `-local` 이름 규칙을 지켜 공개 저장소 파일을 건드리지 않았는가

## 7. 최종 취합 (내부)

03 장을 다 만들면 내부에서 다음 순서로 최종본을 만든다. 공개 저장소에는 올리지 않는다.

1. 내부 작업공간에서 `git pull` — 다른 장이 완성된 공개 쪽 최신을 받는다. `-local` 파일은 그대로 남는다
2. `git status`로 확인한다 — 공개 쪽 파일을 고친 것이 없어야 한다. 있으면 `git checkout -- <파일>`로 되돌리고, 바꿔야 했던 내용은 사용자에게 전달한다
3. `python3 deck/build.py` — `deck/hadoop-eco-ops-1.html`에 03 장 슬라이드가 머리글 다음에 들어간다
4. 브라우저로 열어 6절의 확인 목록을 다시 본다. 공개 쪽 공통 틀(스타일 · 엔진)이 그사이 바뀌었으면 03 장 화면이 달라질 수 있으니 03 장은 한 장씩 다시 본다
5. 최종본 `deck/hadoop-eco-ops-1.html` · `deck/hadoop-eco-ops-2.html`을 내부 배포 위치로 복사한다. 파일 하나로 오프라인에서 열린다

