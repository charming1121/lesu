"""从 ETF曝光次数v1.xlsx 更新 src/data/contentMutationData.js 中的 ETF_EXPOSURE_COUNT_LIST"""
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "assets" / "静态数据" / "ETF曝光次数v1.xlsx"
OUT = ROOT / "src" / "data" / "contentMutationData.js"

wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
ws = wb.active

# 按 code 去重，保留 count 最大的一条
best = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    if not row or row[0] is None:
        continue
    code = str(row[0]).strip()
    name = str(row[1]).strip() if row[1] else ""
    institution = str(row[2]).strip() if row[2] else ""
    detail = str(row[3]).strip() if row[3] else ""
    count = int(round(float(row[4]))) if row[4] is not None else 0
    if code not in best or count > best[code]["count"]:
        best[code] = {"code": code, "name": name, "institution": institution, "detail": detail, "count": count}

items = sorted(best.values(), key=lambda x: -x["count"])
print(f"去重后共 {len(items)} 条")

def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'")

lines = ["export const ETF_EXPOSURE_COUNT_LIST = ["]
for item in items:
    lines.append(
        f"  {{ code: '{esc(item['code'])}', name: '{esc(item['name'])}', institution: '{esc(item['institution'])}', "
        f"detail: '{esc(item['detail'])}', count: {item['count']} }},"
    )
lines.append("];")
new_block = "\n".join(lines)

src = OUT.read_text(encoding="utf-8")
# 替换从 export const ETF_EXPOSURE_COUNT_LIST 到下一个 export const
pattern = r"export const ETF_EXPOSURE_COUNT_LIST = \[[\s\S]*?\];"
if not re.search(pattern, src):
    print("ERROR: 未找到 ETF_EXPOSURE_COUNT_LIST，请检查文件")
    raise SystemExit(1)

new_src = re.sub(pattern, new_block, src)
OUT.write_text(new_src, encoding="utf-8")
print("已写入", OUT)
