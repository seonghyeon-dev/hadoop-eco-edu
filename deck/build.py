"""발표 HTML을 만든다.

deck/src/의 모듈 원본(M1.html …)을 PARTS 순서대로 이어 붙이고, 그 파일에서 쓰는
도식(data-arch="D02" → deck/diagrams/D02-*.html), 화면 캡처(data-capture="파일" →
deck/captures/파일), 아이콘(<svg data-icon="이름" …></svg> → deck/icons/이름.svg, Lucide · ISC),
공식 로고(<img data-logo="이름"> · SVG 안 <image data-logo="이름"> → deck/logos/이름.*)만 골라 파일 안에 넣는다. 결과는 오프라인에서 열리는 파일 하나다.

    python3 deck/build.py

파일을 합치거나 나눌 때는 PARTS만 고친다.

도식은 빌드 전에 렌더링해 둔다 — archify(저장소 밖에 clone):
    node <archify>/archify/bin/archify.mjs finalize <type> deck/diagrams/D02-data-flow.json \\
        deck/diagrams/D02-data-flow.html --quality showcase
"""
import base64
import gzip
import json
import pathlib
import re
import sys

DECK = pathlib.Path(__file__).resolve().parent
SRC = DECK / 'src'

# 발표 파일 → (상단 막대에 보이는 이름, 이어 붙일 모듈 순서)
PARTS = {
    'hadoop-eco-ops-1.html': ('개념편', ['M0', 'M1', 'M2', 'M3', 'M4']),
    'hadoop-eco-ops-2.html': ('실무편', ['M5', 'M6', 'M7']),
}

MOD_STYLE = re.compile(r'<style data-module>.*?</style>\n?', re.S)
MOD_SCRIPT = re.compile(r'<script data-module>.*?</script>\n?', re.S)
ARCH = re.compile(r'data-arch="(D\d+)"')
CAPTURE = re.compile(r'<img([^>]*?)\bdata-capture="([^"]+)"')
ICON = re.compile(r'<svg data-icon="([a-z0-9-]+)"([^>]*)></svg>')
ICON_BODY = re.compile(r'<svg[^>]*>(.*?)</svg>', re.S)
LOGO = re.compile(r'<(img|image)([^>]*?)\bdata-logo="([a-z0-9-]+)"')
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg'}


def diagram(key):
    found = sorted(DECK.glob(f'diagrams/{key}-*.html'))
    if not found:
        sys.exit(f'도식이 없다: deck/diagrams/{key}-*.html — 먼저 렌더링한다')
    html = found[0]
    spec = html.with_suffix('.json')
    title = json.loads(spec.read_text(encoding='utf-8'))['meta']['title'] if spec.exists() else key
    data = base64.b64encode(gzip.compress(html.read_bytes(), mtime=0)).decode('ascii')
    return f'<script type="application/gzip-base64" id="arch-{key}" data-title="{title}">{data}</script>', len(data)


def capture(m):
    path = DECK / 'captures' / m.group(2)
    if not path.exists():
        sys.exit(f'캡처가 없다: {path.relative_to(DECK.parent)}')
    mime = 'image/png' if path.suffix.lower() == '.png' else 'image/jpeg'
    data = base64.b64encode(path.read_bytes()).decode('ascii')
    return f'<img{m.group(1)}src="data:{mime};base64,{data}" data-capture="{m.group(2)}"'


def icon(m):
    path = DECK / 'icons' / f'{m.group(1)}.svg'
    if not path.exists():
        sys.exit(f'아이콘이 없다: deck/icons/{m.group(1)}.svg — Lucide(lucide-static)에서 복사해 둔다')
    body = re.sub(r'\s+', ' ', ICON_BODY.search(path.read_text(encoding='utf-8')).group(1)).strip()
    cls = 'ico-in' if ' x=' in m.group(2) else 'ico-svg'  # SVG 도식 안의 아이콘은 x · y · width · height 속성으로 크기를 정한다
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"{m.group(2)}>{body}</svg>')


def logo_data(name):
    found = [f for f in sorted(DECK.glob(f'logos/{name}.*')) if f.suffix in MIME]
    if not found:
        sys.exit(f'로고가 없다: deck/logos/{name}.* — deck/logos/README.md 참조')
    return f'data:{MIME[found[0].suffix]};base64,' + base64.b64encode(found[0].read_bytes()).decode('ascii')


def logos_block(body):
    # 같은 로고가 여러 번 나와도 파일에는 한 번만 넣는다. deck.js가 열 때 <img> · <image>에 채운다
    names = sorted(set(m.group(3) for m in LOGO.finditer(body)))
    data = {name: logo_data(name) for name in names}
    return f'<script type="application/json" id="logos">{json.dumps(data)}</script>' if data else ''


def build(name, part, modules):
    shell = (SRC / 'shell.html').read_text(encoding='utf-8')
    slides, styles, scripts, missing = [], [], [], []
    for mod in modules:
        path = SRC / f'{mod}.html'
        if not path.exists():
            missing.append(mod)
            continue
        text = path.read_text(encoding='utf-8')
        styles += MOD_STYLE.findall(text)
        scripts += MOD_SCRIPT.findall(text)
        slides.append(MOD_SCRIPT.sub('', MOD_STYLE.sub('', text)).strip())
    if not slides:
        return print(f'{name}: 만든 모듈이 없어 건너뛴다')
    body = '\n\n'.join(slides)
    body = CAPTURE.sub(capture, body)
    body = ICON.sub(icon, body)
    keys = sorted(set(ARCH.findall(body)))
    blocks, size = [], 0
    for key in keys:
        block, n = diagram(key)
        blocks.append(block)
        size += n
    out = (shell
           .replace('{{TITLE}}', f'Hadoop eco 운영 교육 — {part}')
           .replace('{{PART}}', part)
           .replace('{{BASE_CSS}}', (SRC / 'base.css').read_text(encoding='utf-8').strip())
           .replace('{{MODULE_STYLES}}', ''.join(styles).strip())
           .replace('{{SLIDES}}', body)
           .replace('{{DIAGRAMS}}', '\n'.join(blocks + [logos_block(body)]))
           .replace('{{DECK_JS}}', (SRC / 'deck.js').read_text(encoding='utf-8').strip())
           .replace('{{MODULE_SCRIPTS}}', ''.join(scripts).strip()))
    (DECK / name).write_text(out, encoding='utf-8')
    note = f' (아직 없는 모듈: {", ".join(missing)})' if missing else ''
    print(f'{name}: 슬라이드 {body.count(chr(60) + "section class=" + chr(34) + "slide")}장, '
          f'도식 {len(keys)}개 {" ".join(keys)}, {(DECK / name).stat().st_size // 1024} KB{note}')


for name, (part, modules) in PARTS.items():
    build(name, part, modules)
