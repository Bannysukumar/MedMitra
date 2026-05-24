from pathlib import Path

tag = "div"
path = Path(__file__).resolve().parents[1] / "src" / "pages" / "admin" / "AdminLogin.jsx"

content = path.read_text(encoding="utf-8")
content = content.replace("</motion>", f"</{tag}>")
content = content.replace("<motion", f"<{tag}")

path.write_text(content, encoding="utf-8")
print(f"Fixed {path}")
