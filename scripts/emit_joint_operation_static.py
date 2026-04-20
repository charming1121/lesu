"""从 assets/静态数据/联合运营-产品展位透出.xlsx 生成 JOINT_OPERATION_SHELF_LIST 并写入
src/data/contentMutationData.js 中的对应常量（替换原有手写数据）。
重新生成：python scripts/emit_joint_operation_static.py
"""
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "assets" / "静态数据" / "联合运营-产品展位透出.xlsx"
OUT = ROOT / "src" / "data" / "contentMutationData.js"

# 基金公司名称关键词映射（从基金名称前缀推断）
INSTITUTION_KEYWORDS = [
    ("工银瑞信基金", ["工银瑞信"]),
    ("兴证全球基金", ["兴全"]),
    ("富国基金", ["富国"]),
    ("广发基金", ["广发"]),
    ("建信基金", ["建信"]),
    ("永赢基金", ["永赢"]),
    ("德邦基金", ["德邦"]),
    ("博时基金", ["博时"]),
    ("易方达基金", ["易方达"]),
    ("华夏基金", ["华夏"]),
    ("南方基金", ["南方"]),
    ("嘉实基金", ["嘉实"]),
    ("汇添富基金", ["汇添富"]),
    ("招商基金", ["招商"]),
    ("鹏华基金", ["鹏华"]),
    ("景顺长城基金", ["景顺长城"]),
    ("平安基金", ["平安"]),
    ("国泰基金", ["国泰"]),
    ("浦银安盛基金", ["浦银安盛"]),
    ("万家基金", ["万家"]),
    ("东方基金", ["东方红", "东方"]),
    ("中欧基金", ["中欧"]),
    ("银华基金", ["银华"]),
    ("长城基金", ["长城"]),
    ("大成基金", ["大成"]),
    ("上投摩根基金", ["上投摩根"]),
    ("华安基金", ["华安"]),
    ("诺安基金", ["诺安"]),
    ("中银基金", ["中银"]),
    ("民生加银基金", ["民生加银"]),
    ("农银汇理基金", ["农银汇理"]),
    ("国投瑞银基金", ["国投瑞银"]),
    ("兴业基金", ["兴业"]),
    ("天弘基金", ["天弘"]),
    ("金信基金", ["金信"]),
    ("鹏扬基金", ["鹏扬"]),
    ("财通基金", ["财通"]),
    ("红土创新基金", ["红土创新"]),
    ("中信保诚基金", ["中信保诚"]),
    ("华泰柏瑞基金", ["华泰柏瑞"]),
    ("国联基金", ["国联"]),
    ("东证资管", ["东方红"]),
    ("交银施罗德基金", ["交银"]),
    ("申万菱信基金", ["申万菱信"]),
    ("泰达宏利基金", ["泰达宏利"]),
    ("摩根基金", ["摩根"]),
    ("安信基金", ["安信"]),
    ("中泰资管", ["中泰"]),
    ("光大保德信基金", ["光大保德信"]),
    ("宝盈基金", ["宝盈"]),
    ("中海基金", ["中海"]),
    ("浙商基金", ["浙商"]),
    ("创金合信基金", ["创金合信"]),
    ("华富基金", ["华富"]),
    ("前海开源基金", ["前海开源"]),
    ("九泰基金", ["九泰"]),
    ("中融基金", ["中融"]),
]


def guess_institution(name: str) -> str:
    for institution, keywords in INSTITUTION_KEYWORDS:
        for kw in keywords:
            if name.startswith(kw):
                return institution
    return "--"


def main():
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    rows = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or row[0] is None:
            continue
        name = str(row[0]).strip()
        count = int(row[1]) if row[1] is not None else 0
        institution = guess_institution(name)
        rows.append({"name": name, "code": "--", "institution": institution, "count": count})
    wb.close()

    # 构建新的 JOINT_OPERATION_SHELF_LIST JS 块
    lines = ["export const JOINT_OPERATION_SHELF_LIST = ["]
    for i, r in enumerate(rows):
        sep = "," if i < len(rows) - 1 else ""
        lines.append(
            f"  {{ code: '--', name: '{r['name']}', institution: '{r['institution']}', "
            f"detail: '联合运营-产品展位透出', count: {r['count']} }}{sep}"
        )
    lines.append("];")
    new_block = "\n".join(lines)

    # 替换 contentMutationData.js 中的旧常量
    src = OUT.read_text(encoding="utf-8")
    pattern = r"export const JOINT_OPERATION_SHELF_LIST = \[[\s\S]*?\];"
    if not re.search(pattern, src):
        print("ERROR: JOINT_OPERATION_SHELF_LIST not found in target file")
        return
    new_src = re.sub(pattern, new_block, src)
    OUT.write_text(new_src, encoding="utf-8")
    print(f"Written {len(rows)} rows -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
