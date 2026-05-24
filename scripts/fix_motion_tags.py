from pathlib import Path

tag = "motion"
replacement = "div"

root = Path(__file__).resolve().parents[1] / "src"
fixed = []

for path in root.rglob("*.jsx"):
    text = path.read_text(encoding="utf-8")
    if f"<{tag}" not in text and f"</{tag}>" not in text:
        continue
    new_text = text.replace(f"</{tag}>", f"</{replacement}>").replace(f"<{tag}", f"<{replacement}")
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        fixed.append(str(path.relative_to(root.parent)))

print("Fixed files:")
for f in fixed:
    print(" -", f)
if not fixed:
    print(" (none)")
