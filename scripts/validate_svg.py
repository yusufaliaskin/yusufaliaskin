from pathlib import Path
from xml.etree import ElementTree as ET
root=Path("cards/motion-v4")
files=sorted(root.glob("*.svg"))
assert len(files)==40, f"Expected 40 SVGs, got {len(files)}"
for file in files:
    tree=ET.parse(file)
    svg=tree.getroot()
    assert svg.tag=="{http://www.w3.org/2000/svg}svg",file
    assert svg.find("{http://www.w3.org/2000/svg}g").get("class")=="section-entry",file
for suffix in ("","-mobile"):
    assert (root/f"footer-nav-linkedin{suffix}.svg").is_file()
print(f"Validated XML and staged root: {len(files)} SVG files, both LinkedIn variants present")

import re
for readme in Path(".").glob("README*.md"):
    content=readme.read_text(encoding="utf-8")
    refs=re.findall(r'(?:src|srcset)="\./cards/motion-v4/([^"]+)"',content)
    assert set(refs)=={f.name for f in files}, f"Incomplete image references: {readme}"
    assert content.count('width="24%"')==4,readme
    assert content.count('width="19%"')==5,readme
print("Validated all README image references and compact footer dimensions")

# Browser image decoding: SVGs are loaded through img, as on GitHub.
import shutil
import subprocess
import tempfile
from html import escape
chrome=shutil.which("google-chrome") or shutil.which("chromium") or shutil.which("chromium-browser")
assert chrome, "Chromium/Chrome is required for browser smoke test"
with tempfile.TemporaryDirectory() as tmp:
    page=Path(tmp)/"profile-images.html"
    images="".join(f'<img src="{escape(f.resolve().as_uri(),quote=True)}" onload="this.dataset.result=\'ok\'" onerror="this.dataset.result=\'error\'">' for f in files)
    page.write_text("<!doctype html><meta charset='utf-8'>"+images,encoding="utf-8")
    result=subprocess.run([chrome,"--headless","--no-sandbox","--disable-dev-shm-usage","--disable-gpu","--allow-file-access-from-files",f"--user-data-dir={tmp}/chrome","--virtual-time-budget=10000","--dump-dom",page.as_uri()],capture_output=True,text=True,timeout=50)
    assert result.returncode==0,result.stderr[-1000:]
    assert result.stdout.count('data-result="ok"')==len(files),result.stdout[-2000:]
    assert 'data-result="error"' not in result.stdout
print(f"Chromium image decoding passed: {len(files)} SVGs")
