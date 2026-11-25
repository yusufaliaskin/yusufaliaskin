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
