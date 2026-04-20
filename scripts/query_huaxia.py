import json, re

content = open('src/data/topicHeatAnalysisStatic.js', encoding='utf-8').read()
match = re.search(r'export const MARKET_TOPIC_DETAILS = (\{.*\});', content, re.DOTALL)
data = json.loads(match.group(1))

TARGET = '华夏基金'

# 1) Per-topic counts
topic_counts = {}
for topic, detail in data.items():
    for inst in detail.get('institutions', []):
        if inst['institution'] == TARGET:
            topic_counts[topic] = inst['count']
            break

sorted_topics = sorted(topic_counts.items(), key=lambda x: -x[1])
print('华夏基金 top 20 topics (count):')
for t, c in sorted_topics[:20]:
    print("  %r: %d" % (t, c))

print()
# 2) Products with code
hua_xia_products = []
for topic, detail in data.items():
    for prod in detail.get('products', []):
        inst = prod.get('institution', '')
        if TARGET in inst and prod.get('code'):
            hua_xia_products.append({
                'code': prod['code'],
                'name': prod['product'],
                'topic': topic,
                'count': prod['count'],
                'ratio': prod['ratio'],
                'platformMix': prod.get('platformMix', []),
            })

seen = {}
for p in hua_xia_products:
    key = p['code']
    if key not in seen or p['count'] > seen[key]['count']:
        seen[key] = p

deduped = sorted(seen.values(), key=lambda x: -x['count'])
print('华夏基金 products with code (%d total), top 10:' % len(deduped))
for p in deduped[:10]:
    platforms = [m['name'] for m in p['platformMix']]
    print("  %s %s | topic=%s count=%d ratio=%s%% platforms=%s" % (
        p['code'], p['name'], p['topic'], p['count'], p['ratio'], platforms))
