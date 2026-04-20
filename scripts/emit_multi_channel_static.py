"""从 assets/静态数据/多渠道产品热度列表.xlsx 生成 src/data/multiChannelProductHeatStatic.js。
只抽取「货架产品列表」（基金货架 + ETF曝光位 + 联合运营）+ 「内容推品」涉及的产品，
其余 27000+ 条数据不写入 JS，保持文件体积可控。
重新生成：python scripts/emit_multi_channel_static.py
"""
import json
import re
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
EXCEL = ROOT / "assets" / "静态数据" / "多渠道产品热度列表.xlsx"
OUT = ROOT / "src" / "data" / "multiChannelProductHeatStatic.js"
MUTATION_DATA = ROOT / "src" / "data" / "contentMutationData.js"


def to_num(v):
    if v is None or v == "" or v == "-":
        return 0
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0


def collect_product_keys():
    """收集所有货架列表中的产品名称和代码，用于过滤 Excel"""
    src = MUTATION_DATA.read_text(encoding="utf-8")
    names = set()
    codes = set()

    for pattern in ["SHELF_EXPOSURE_PRODUCT_LIST", "ETF_EXPOSURE_COUNT_LIST", "JOINT_OPERATION_SHELF_LIST"]:
        start = src.find(f"export const {pattern}")
        end = src.find("];", start) + 2
        block = src[start:end]
        for n in re.findall(r"name: '([^']+)'", block):
            names.add(n.strip())
        for c in re.findall(r"code: '([^'-][^']*)'", block):
            if c.strip() != "--":
                codes.add(c.strip())

    return names, codes


def main():
    target_names, target_codes = collect_product_keys()
    print(f"Target products: {len(target_names)} names, {len(target_codes)} codes")

    wb = openpyxl.load_workbook(EXCEL, read_only=True, data_only=True)
    ws = wb.worksheets[0]
    # 列顺序：fund_code, fund_name, company, 当前持有, 当前自选,
    #          持仓达人数量, 达人实盘总金额, 当日购买笔数, 理财通购买笔数,
    #          周浏览, 周搜索, 周持仓达人数量变化, 周达人实盘金额变化,
    #          周帖子提及数, 周人均定投次数, 周出现在榜单的次数, 周自选人数变化, 周持有人数变化
    results = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not row or (row[0] is None and row[1] is None):
            continue
        code = str(row[0] or "").strip()
        name = str(row[1] or "").strip()
        institution = str(row[2] or "").strip()

        if not (name in target_names or (code and code in target_codes)):
            continue

        results.append({
            "product": name,
            "code": code or "--",
            "institution": institution or "--",
            # 当前自选 → latestWatchlist
            "latestWatchlist": to_num(row[4]),
            # 周自选人数变化 → recentWatchlist
            "recentWatchlist": to_num(row[16]),
            # 当前持有 → holderCount
            "holderCount": to_num(row[3]),
            # 周持有人数变化 → holderWeeklyChange
            "holderWeeklyChange": to_num(row[17]),
            # 周持仓达人数量变化 → influencerHolderChange
            "influencerHolderChange": to_num(row[11]),
            # 周达人实盘金额变化 → influencerAmountChange
            "influencerAmountChange": to_num(row[12]),
            # 周人均定投次数 → avgSipCount
            "avgSipCount": to_num(row[14]),
            # 周出现在榜单的次数 → eastmoneyRankAppear
            "eastmoneyRankAppear": to_num(row[15]),
            # 当日购买笔数 → purchaseCount
            "purchaseCount": to_num(row[7]),
        })

    wb.close()

    lines = [
        "// 来源：assets/静态数据/多渠道产品热度列表.xlsx（仅提取货架列表相关产品）",
        "// 重新生成：python scripts/emit_multi_channel_static.py",
        "export const MULTI_CHANNEL_PRODUCT_HEAT_STATIC = [",
    ]
    for i, r in enumerate(results):
        sep = "," if i < len(results) - 1 else ""
        lines.append(
            f"  {{ product: {json.dumps(r['product'], ensure_ascii=False)}, "
            f"code: {json.dumps(r['code'], ensure_ascii=False)}, "
            f"institution: {json.dumps(r['institution'], ensure_ascii=False)}, "
            f"latestWatchlist: {r['latestWatchlist']}, "
            f"recentWatchlist: {r['recentWatchlist']}, "
            f"holderCount: {r['holderCount']}, "
            f"holderWeeklyChange: {r['holderWeeklyChange']}, "
            f"influencerHolderChange: {r['influencerHolderChange']}, "
            f"influencerAmountChange: {r['influencerAmountChange']}, "
            f"avgSipCount: {r['avgSipCount']}, "
            f"eastmoneyRankAppear: {r['eastmoneyRankAppear']}, "
            f"purchaseCount: {r['purchaseCount']} }}{sep}"
        )
    lines.append("];")
    lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Written {len(results)} products -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
