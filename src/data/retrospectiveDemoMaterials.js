/**
 * 战术后验第三层 · 黄金专题示例素材（仅 industryTheme=黄金）
 * - 确定性随机（固定种子）
 * - 叙事：冷启动仅少数机构零星发声 → 公开报道预热 → 热度节点后全员密集投放 → 回落
 * - 日期锚点与近年公开报道对齐（示意）：2026-01-12 现货黄金首度突破约 4600 美元关口、2026-01-26 首度站上约 5000 美元等；窗口内若不含锚点则自动用「距窗口末端」的相对日期代替
 */

const DAY_MS = 24 * 60 * 60 * 1000;

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const toYmd = (ts) => {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseYmdLocal = (ymd) => {
  const [y, mo, da] = String(ymd).split('-').map((x) => parseInt(x, 10));
  return new Date(y, mo - 1, da, 12, 0, 0, 0).getTime();
};

const addDaysYmd = (ymd, delta) => {
  const t = parseYmdLocal(ymd) + delta * DAY_MS;
  return toYmd(t);
};

const pickWeighted = (rand, items) => {
  const total = items.reduce((s, it) => s + it.w, 0);
  let r = rand() * total;
  for (const it of items) {
    r -= it.w;
    if (r <= 0) return it.v;
  }
  return items[items.length - 1].v;
};

/** 与媒体报道常见叙事对应的日历锚点（YYYY-MM-DD） */
const GOLD_NEWS_ANCHORS = [{ date: '2026-01-12' }, { date: '2026-01-26' }];

const INSTITUTION_BASE = [
  { v: '易方达基金', w: 19 },
  { v: '华夏基金', w: 17 },
  { v: '广发基金', w: 14 },
  { v: '南方基金', w: 12 },
  { v: '富国基金', w: 11 },
  { v: '中欧基金', w: 9.5 },
  { v: '交银施罗德基金', w: 9.5 },
  { v: '我司', w: 8 },
];

/** 冷启动阶段仅出现的「早鸟」机构（3～4 家量级，零散发声） */
const EARLY_MOVER_POOL = [
  { v: '华夏基金', w: 1.2 },
  { v: '易方达基金', w: 1.1 },
  { v: '我司', w: 1 },
  { v: '富国基金', w: 0.9 },
];

const bumpWeights = (items, boost) => {
  const map = new Map(items.map((it) => [it.v, it.w]));
  Object.entries(boost).forEach(([k, dw]) => {
    map.set(k, (map.get(k) || 0) + dw);
  });
  return [...map.entries()].map(([v, w]) => ({ v, w: Math.max(0.5, w) }));
};

function resolveAnchors(startYmd, endYmd) {
  const inWin = GOLD_NEWS_ANCHORS.filter((a) => a.date >= startYmd && a.date <= endYmd).map((a) => a.date);
  if (inWin.length >= 2) {
    inWin.sort();
    return { warm: inWin[0], peak: inWin[inWin.length - 1], mode: 'news' };
  }
  if (inWin.length === 1) {
    const peak = inWin[0];
    const warm = addDaysYmd(peak, -14);
    const warmClamped = warm < startYmd ? startYmd : warm;
    return { warm: warmClamped, peak, mode: 'news_partial' };
  }
  const endTs = parseYmdLocal(endYmd);
  const peakYmd = toYmd(endTs - 28 * DAY_MS);
  let warmYmd = addDaysYmd(peakYmd, -16);
  if (warmYmd < startYmd) warmYmd = startYmd;
  if (peakYmd < warmYmd) {
    return { warm: startYmd, peak: addDaysYmd(startYmd, 10), mode: 'synthetic' };
  }
  return { warm: warmYmd, peak: peakYmd, mode: 'synthetic' };
}

/** 距 peak 日的日历天数差（peak 当天为 0） */
function dayIndexFromPeak(ymd, peakYmd) {
  return Math.round((parseYmdLocal(ymd) - parseYmdLocal(peakYmd)) / DAY_MS);
}

/**
 * 单日发文条数：冷期大量 0；预热渐增；峰值窗口全员一起推
 */
function dailyPostCount(ymd, warmYmd, peakYmd, rand) {
  const fromPeak = dayIndexFromPeak(ymd, peakYmd);
  const beforeWarm = ymd < warmYmd;

  if (beforeWarm) {
    if (rand() < 0.82) return 0;
    return 1;
  }

  if (ymd < peakYmd) {
    const fromWarm = Math.round((parseYmdLocal(ymd) - parseYmdLocal(warmYmd)) / DAY_MS);
    const span = Math.max(1, Math.round((parseYmdLocal(peakYmd) - parseYmdLocal(warmYmd)) / DAY_MS));
    const t = fromWarm / span;
    if (rand() < 0.45 - t * 0.25) return 0;
    if (rand() < 0.55) return 1;
    if (rand() < 0.88) return 2;
    return 3;
  }

  if (fromPeak >= 0 && fromPeak <= 12) {
    return 7 + Math.floor(rand() * 9);
  }
  if (fromPeak <= 22) {
    return 3 + Math.floor(rand() * 5);
  }
  if (rand() < 0.35) return 0;
  return 1 + Math.floor(rand() * 3);
}

function channelMix(isBlast, rand) {
  if (!isBlast) {
    return pickWeighted(rand, [
      { v: '公众号', w: 46 },
      { v: '蚂蚁财富号', w: 38 },
      { v: '雪球', w: 10 },
      { v: '小红书', w: 6 },
    ]);
  }
  return pickWeighted(rand, [
    { v: '蚂蚁财富号', w: 42 },
    { v: '公众号', w: 30 },
    { v: '小红书', w: 20 },
    { v: '雪球', w: 8 },
  ]);
}

function typeMix(isBlast, channel, rand) {
  if (!isBlast) {
    return pickWeighted(rand, [
      { v: '长图', w: 42 },
      { v: '推文', w: 42 },
      { v: '视频', w: 16 },
    ]);
  }
  if (channel === '小红书') {
    return pickWeighted(rand, [
      { v: '视频', w: 55 },
      { v: '长图', w: 25 },
      { v: '推文', w: 20 },
    ]);
  }
  return pickWeighted(rand, [
    { v: '视频', w: 38 },
    { v: '长图', w: 31 },
    { v: '推文', w: 31 },
  ]);
}

function viewsRawFor(channel, type, rand) {
  let lo = 4200;
  let hi = 16000;
  if (channel === '蚂蚁财富号') {
    lo = 5500;
    hi = 24000;
  } else if (channel === '小红书') {
    lo = 9000;
    hi = 52000;
  } else if (channel === '公众号') {
    lo = 4800;
    hi = 22000;
  } else if (channel === '雪球') {
    lo = 3200;
    hi = 15000;
  }
  if (type === '视频') {
    lo *= 1.15;
    hi *= 1.35;
  }
  const u = rand();
  const v = rand();
  const skew = Math.pow(u, 0.55) * (hi - lo) + lo;
  const viral = v > 0.93 ? 1.45 + rand() * 0.5 : 1;
  return Math.round(skew * viral);
}

function pickSource(beforeWarm, inBlast, rand) {
  if (beforeWarm) {
    return pickWeighted(rand, EARLY_MOVER_POOL);
  }
  if (!inBlast) {
    if (rand() < 0.62) return pickWeighted(rand, EARLY_MOVER_POOL);
    return pickWeighted(rand, INSTITUTION_BASE);
  }
  let pool = INSTITUTION_BASE;
  if (rand() < 0.22) {
    pool = bumpWeights(INSTITUTION_BASE, { 广发基金: 4, 南方基金: 3.5, 易方达基金: 2 });
  }
  return pickWeighted(rand, pool);
}

function titleFor(ymd, warmYmd, peakYmd, rand) {
  const fromPeak = dayIndexFromPeak(ymd, peakYmd);
  const generic = [
    '金价波动加大，黄金在组合里怎么放？',
    '黄金 ETF 申赎与折溢价：近期提示',
    '美元、实际利率与金价：一张图梳理',
    '定投黄金：纪律比择时更重要',
    '上海金与伦敦金：跟踪与误差',
    '黄金股 vs 黄金 ETF：波动差异说明',
    '个人养老金可投黄金：渠道与费率',
    '风险偏好变化时，黄金常扮演什么角色？',
  ];
  const around4600 = [
    '快讯｜现货金首度触及 4600 美元关口，配置逻辑怎么看？',
    '突破 4600 之后：黄金资产波动与持有建议',
    '4600 美元上方：黄金 ETF 规模与资金流观察',
  ];
  const around5000 = [
    '历史性时刻｜现货金站上 5000 美元，公募黄金产品线陪伴提示',
    '5000 美元关口后：止盈还是再平衡？',
    '金价创新高背后：避险情绪与资金流向',
    '全市场关注｜黄金再创纪录，投资者问答精选',
  ];
  const blast = [
    '热度攀升｜一分钟看懂黄金 ETF 怎么选',
    '蚂蚁端黄金持有体验与费率说明',
    '小红书｜金价创新高，三类误区别踩',
    '雪球周评：技术位、波动率与仓位',
  ];

  if (warmYmd === '2026-01-12' && ymd >= warmYmd && ymd < peakYmd && rand() < 0.55) {
    return around4600[Math.floor(rand() * around4600.length)];
  }
  if (peakYmd === '2026-01-26' && fromPeak >= -2 && fromPeak <= 8 && rand() < 0.6) {
    return around5000[Math.floor(rand() * around5000.length)];
  }
  if (fromPeak >= 0 && fromPeak <= 12 && rand() < 0.45) {
    return blast[Math.floor(rand() * blast.length)];
  }
  return generic[Math.floor(rand() * generic.length)];
}

export function buildRetrospectiveDemoMaterials() {
  const now = Date.now();
  const rand = mulberry32(0x1a8b2026);
  let nid = 1;
  const list = [];

  const endYmd = toYmd(now);
  const startYmd = toYmd(now - 89 * DAY_MS);
  const { warm: warmYmd, peak: peakYmd } = resolveAnchors(startYmd, endYmd);

  for (let dayAgo = 89; dayAgo >= 0; dayAgo--) {
    const t = now - dayAgo * DAY_MS;
    const ymd = toYmd(t);
    if (ymd < startYmd || ymd > endYmd) continue;

    const beforeWarm = ymd < warmYmd;
    const fromPeak = dayIndexFromPeak(ymd, peakYmd);
    const inBlast = fromPeak >= 0 && fromPeak <= 12;

    const n = dailyPostCount(ymd, warmYmd, peakYmd, rand);

    for (let i = 0; i < n; i++) {
      const source = pickSource(beforeWarm, inBlast, rand);
      const channel = channelMix(inBlast, rand);
      const type = typeMix(inBlast, channel, rand);
      const viewsRaw = viewsRawFor(channel, type, rand);
      const title = titleFor(ymd, warmYmd, peakYmd, rand);
      list.push({
        id: `retro-gold-${nid++}`,
        time: ymd,
        title,
        source,
        industryTheme: '黄金',
        type,
        channel,
        viewsRaw,
      });
    }
  }

  return list;
}
