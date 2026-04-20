"""
临时脚本：检查联合运营产品在多渠道Excel中的匹配率
"""
import re
import openpyxl
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

with open(ROOT / 'src/data/contentMutationData.js', encoding='utf-8') as f:
    src = f.read()

start = src.find('JOINT_OPERATION_SHELF_LIST')
names_raw = re.findall(r"name: '([^']+)'", src[start:])
joint_names = set(names_raw)
print(f'Joint operation products: {len(joint_names)}')

wb = openpyxl.load_workbook(ROOT / 'assets/静态数据/多渠道产品热度列表.xlsx', read_only=True, data_only=True)
ws = wb.worksheets[0]
name_lookup = {}
for row in ws.iter_rows(min_row=2, values_only=True):
    if row and row[1]:
        name_lookup[str(row[1]).strip()] = row
wb.close()

matched = [n for n in joint_names if n in name_lookup]
unmatched = [n for n in joint_names if n not in name_lookup]
print(f'Matched in Excel: {len(matched)}')
print(f'Unmatched: {len(unmatched)}')
print('Sample unmatched:', unmatched[:5])
