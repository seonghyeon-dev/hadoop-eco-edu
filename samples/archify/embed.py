"""발표 HTML에 archify 도식을 넣는다.

samples/hadoop-eco-ops-sample.html 안의
<script type="application/gzip-base64" id="arch-…" data-src="archify/….html"></script>
마다 data-src 파일을 gzip + base64로 채운다. archify 도식을 다시 렌더링한 뒤 실행한다.

    python3 samples/archify/embed.py
"""
import base64
import gzip
import pathlib
import re

DECK = pathlib.Path(__file__).resolve().parent.parent / 'hadoop-eco-ops-sample.html'
SLOT = re.compile(r'(<script type="application/gzip-base64"[^>]*\bdata-src="([^"]+)"[^>]*>)(.*?)(</script>)', re.S)


def fill(m):
    src = DECK.parent / m.group(2)
    data = base64.b64encode(gzip.compress(src.read_bytes(), mtime=0)).decode('ascii')
    print(f'  {m.group(2)}  {src.stat().st_size // 1024} KB → {len(data) // 1024} KB')
    return m.group(1) + data + m.group(4)


text = DECK.read_text(encoding='utf-8')
text, n = SLOT.subn(fill, text)
DECK.write_text(text, encoding='utf-8')
print(f'도식 {n}개를 넣었다: {DECK.name} ({DECK.stat().st_size // 1024} KB)')
