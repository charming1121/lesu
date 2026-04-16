import React, { useMemo, useState } from 'react';
import xiaohongshuLogo from '../../assets/渠道logo/小红书.png';
import antWealthLogo from '../../assets/渠道logo/蚂蚁.png';
import wechatLogo from '../../assets/渠道logo/微信.png';
import xueqiuLogo from '../../assets/渠道logo/雪球.png';
import douyinLogo from '../../assets/渠道logo/抖音.png';
import {
  TOPIC_SURGE_ALERTS,
  NEW_EMERGING_TOPICS,
  INSTITUTION_RESOURCE_FOCUS,
  OPERATIONS_DIAGNOSIS_DATA,
} from '../data/contentMutationData';

const RADAR_TABS = ['市场雷达', '运营诊断'];

const PLATFORM_ICON_META = {
  小红书: { logo: xiaohongshuLogo },
  蚂蚁财富号: { logo: antWealthLogo },
  微信公众号: { logo: wechatLogo },
  雪球: { logo: xueqiuLogo },
  抖音: { logo: douyinLogo },
};

const TOPIC_RADAR_META = {
  黄金概念: { channels: ['蚂蚁财富号', '微信公众号', '雪球'], bestFormat: '多图', lifecycle: '高峰期' },
  AI应用: { channels: ['抖音', '小红书', '微信公众号'], bestFormat: '视频', lifecycle: '高峰期' },
  创新药: { channels: ['微信公众号', '小红书', '蚂蚁财富号'], bestFormat: '图文', lifecycle: '上升期' },
  液冷服务器: { channels: ['抖音', '微信公众号', '蚂蚁财富号'], bestFormat: '视频', lifecycle: '上升期' },
  具身智能: { channels: ['抖音', '小红书'], bestFormat: '视频', lifecycle: '萌芽期' },
  'AI Agent': { channels: ['微信公众号', '抖音'], bestFormat: '图文', lifecycle: '萌芽期' },
  高股息再平衡: { channels: ['蚂蚁财富号', '雪球'], bestFormat: '图文', lifecycle: '萌芽期' },
};

const CONTENT_SUPPLY_METRICS = [
  { label: '总内容量', value: '6,842', sub: '近7天 +12%' },
  { label: '活跃机构数', value: '26', sub: '较上周 +3' },
  { label: '日均发布', value: '977', sub: '峰值周三 1,124' },
  { label: '高互动内容占比', value: '18.6%', sub: '较上周 +2.1%' },
];

const FORMAT_DISTRIBUTION = [
  { name: '多图', value: 41, color: 'bg-emerald-500' },
  { name: '视频', value: 37, color: 'bg-sky-500' },
  { name: '长图文', value: 22, color: 'bg-amber-500' },
];

const PRODUCT_TOPIC_HINTS = {
  广发人工智能ETF: 'AI应用',
  易方达人工智能ETF: 'AI应用',
  华夏数字经济混合: 'AI应用',
  广发黄金ETF: '黄金概念',
  博时黄金ETF联接: '黄金概念',
  广发创新药ETF: '创新药',
  汇添富创新药混合: '创新药',
  南方算力产业股票: '液冷服务器',
  广发通信设备ETF: 'CPO/光模块',
};

const levelClass = {
  高产品化: 'bg-emerald-100 text-emerald-700',
  中产品化: 'bg-amber-100 text-amber-700',
  低产品化: 'bg-slate-100 text-slate-600',
};

const DIAGNOSIS_TABS = ['热点响应', '内容供给', '产品承接', '内容产品化进程'];

const OperationsInsight = () => {
  const [activeTab, setActiveTab] = useState('市场雷达');
  const [diagnosisTab, setDiagnosisTab] = useState('热点响应');

  const topicHeatRank = useMemo(
    () =>
      [...TOPIC_SURGE_ALERTS, ...NEW_EMERGING_TOPICS.map((item) => ({
        topic: item.topic,
        currentShare: item.share,
        change: Math.round(item.growth / 10),
      }))]
        .map((item, index) => {
          const meta = TOPIC_RADAR_META[item.topic] || {
            channels: ['微信公众号', '抖音'],
            bestFormat: '图文',
            lifecycle: '上升期',
          };
          return {
            topic: item.topic,
            heat: Math.max(55, Math.min(95, Math.round(item.currentShare * 1.9))),
            mom: item.change,
            channels: meta.channels,
            bestFormat: meta.bestFormat,
            lifecycle: meta.lifecycle,
            rank: index + 1,
          };
        })
        .sort((a, b) => b.heat - a.heat)
        .slice(0, 6),
    []
  );

  const contentProductHot = useMemo(() => {
    const mention = INSTITUTION_RESOURCE_FOCUS.flatMap((item) =>
      item.contentPush.map((product, index) => ({
        product,
        value: 180 - index * 14 + item.contentPush.length * 22,
        change: 9 + (item.institution.length % 6) + index * 3,
        tags: ['内容异动联动', item.institution],
      }))
    )
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);

    const mainPush = INSTITUTION_RESOURCE_FOCUS.map((item) => {
      const mainPushProduct = item.mainPush?.product || item.contentPush[0];
      const mainPushCode = item.mainPush?.code || '--';
      const investment = item.mainPush?.investment || 20;
      const mainPushPlatforms = item.mainPush?.platforms || ['微信公众号'];
      return {
        product: mainPushProduct,
        code: mainPushCode,
        institution: item.institution,
        platforms: mainPushPlatforms,
        value: investment,
        change: Math.max(6, Math.round(investment * 0.45)),
        tags: ['机构主推'],
      };
    })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    return { mention, mainPush };
  }, []);

  const shelfHeat = useMemo(() => {
    const mainPushMetaMap = new Map(
      INSTITUTION_RESOURCE_FOCUS.map((item) => [item.mainPush?.product, { code: item.mainPush?.code }])
    );

    const exposure = INSTITUTION_RESOURCE_FOCUS.flatMap((item) => {
      const records = item.antShelfRecords?.length
        ? item.antShelfRecords
        : item.antShelf.map((product, index) => ({
            product,
            shelfNames: (item.antShelfSlots || []).slice(index, index + 2).length
              ? (item.antShelfSlots || []).slice(index, index + 2)
              : ['稳健榜单'],
          }));

      return records.map((record, index) => ({
        product: record.product,
        code: mainPushMetaMap.get(record.product)?.code || '--',
        institution: item.institution,
        platforms: ['蚂蚁财富号'],
        shelfNames: record.shelfNames || ['稳健榜单'],
        value: 65 + records.length * 6 - index * 4,
        growth: 8 + (item.institution.length % 6) + index * 2,
      }));
    })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const growth = [...exposure]
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 4);

    return { exposure, growth };
  }, []);

  const shelfInstitutionSplit = useMemo(() => {
    const total = INSTITUTION_RESOURCE_FOCUS.reduce((sum, item) => sum + item.antShelf.length, 0);
    return INSTITUTION_RESOURCE_FOCUS.map((item) => ({
      name: item.institution,
      value: Math.round((item.antShelf.length / Math.max(total, 1)) * 100),
    }));
  }, []);

  const productizationResults = useMemo(() => {
    const hotspotTopics = new Set(TOPIC_SURGE_ALERTS.map((item) => item.topic));
    const topicHeatMap = new Map(topicHeatRank.map((item) => [item.topic, item.heat]));
    const shelfMap = new Map(shelfHeat.exposure.map((item) => [item.product, item]));

    const rows = contentProductHot.mainPush
      .filter((item) => shelfMap.has(item.product))
      .map((item) => {
        const shelfItem = shelfMap.get(item.product);
        const topic = PRODUCT_TOPIC_HINTS[item.product] || item.tags?.[0] || 'AI应用';
        const topicHeat = topicHeatMap.get(topic) || 68;
        const score = Math.min(95, Math.round(topicHeat * 0.45 + item.change * 2 + shelfItem.growth * 1.8));
        const level = score >= 78 ? '高产品化' : score >= 62 ? '中产品化' : '低产品化';
        const contentStyle = `${TOPIC_RADAR_META[topic]?.bestFormat || '图文'} + 对比拆解`;
        const validateWatchlist = `+${(item.change * 0.7 + shelfItem.growth * 0.5).toFixed(1)}%`;
        const validateHolders = `+${Math.max(1.2, item.change * 0.28).toFixed(1)}%`;
        const resonance = score >= 78 ? '多平台共振' : score >= 62 ? '双平台共振' : '单平台验证';

        return {
          topic,
          product: item.product,
          code: item.code,
          institution: item.institution,
          contentStyle,
          contentPlatforms: item.platforms,
          shelfNames: shelfItem.shelfNames,
          shelfPlatform: '蚂蚁财富号',
          change: item.change,
          shelfGrowth: shelfItem.growth,
          validateWatchlist,
          validateHolders,
          resonance,
          score,
          level,
        };
      })
      .filter((item) => hotspotTopics.has(item.topic))
      .sort((a, b) => b.score - a.score);

    return rows;
  }, [contentProductHot.mainPush, shelfHeat.exposure, topicHeatRank]);
  const formatRingStyle = useMemo(() => {
    const [first, second, third] = FORMAT_DISTRIBUTION;
    return {
      background: `conic-gradient(
        #10b981 0% ${first.value}%,
        #0ea5e9 ${first.value}% ${first.value + second.value}%,
        #f59e0b ${first.value + second.value}% 100%
      )`,
    };
  }, []);
  const diagnosisMetrics = useMemo(() => {
    const hotResponseRows = (OPERATIONS_DIAGNOSIS_DATA.highValueHotspots || []).map((item) => {
      const gapCount = item.industryMainChannels.filter((channel) => !item.coveredChannels.includes(channel)).length;
      const mainCovered = item.industryMainChannels.slice(0, 2).every((channel) => item.coveredChannels.includes(channel));
      const channelTag =
        item.coveredChannels.length >= 4
          ? '覆盖充分'
          : mainCovered
            ? '主阵地已覆盖'
            : item.coveredChannels.length === 0
              ? '主阵地缺失'
              : gapCount >= 2
                ? '渠道错配'
                : '主阵地缺失';
      return {
        ...item,
        gapCount,
        channelTag,
      };
    });
    const coveredCount = hotResponseRows.filter((item) => item.status === '已及时响应').length;
    const laggedCount = hotResponseRows.filter((item) => item.status === '滞后响应').length;
    const uncoveredCount = hotResponseRows.filter((item) => item.status === '未响应').length;
    const responseRate = Math.round(((coveredCount + laggedCount * 0.5) / Math.max(hotResponseRows.length, 1)) * 100);
    const avgLag = (
      hotResponseRows
        .filter((item) => item.status !== '不建议响应')
        .reduce((sum, item) => sum + item.lagDays, 0) / Math.max(hotResponseRows.filter((item) => item.status !== '不建议响应').length, 1)
    ).toFixed(1);
    const carryCoveredRate = Math.round(
      (hotResponseRows.filter((item) => item.productCarryScore >= 70 && item.status !== '未响应').length / Math.max(hotResponseRows.filter((item) => item.productCarryScore >= 70).length, 1)) * 100
    );

    const supply = OPERATIONS_DIAGNOSIS_DATA.contentSupply || {};
    const ownTotal = supply.ownTotal || 0;
    const industryTotal = supply.industryTotal || 0;
    const ownByChannel = supply.byChannel || [];
    const ownFormat = supply.byFormat || [];
    const activeOwn = supply.activeOwn || 0;
    const activeIndustry = supply.activeIndustry || 0;
    const topicSupplyRows = supply.topicSupplyRows || [];

    const acceptanceRows = OPERATIONS_DIAGNOSIS_DATA.productAcceptanceRows || [];
    const matchedCount = acceptanceRows.filter((item) => item.contentHit && item.shelfHit).length;
    const productAcceptanceRate = Math.round((matchedCount / Math.max(acceptanceRows.length, 1)) * 100);
    const gapList = acceptanceRows
      .filter((item) => !item.resonance)
      .sort((a, b) => b.gap - a.gap)
      .slice(0, 5);

    const topicProductizationRows = OPERATIONS_DIAGNOSIS_DATA.topicProductizationRows || [];
    const highProductization = topicProductizationRows.filter((item) => item.level === '高产品化');
    const lowProductization = topicProductizationRows.filter((item) => item.level === '低产品化');
    const macroVsProduct = OPERATIONS_DIAGNOSIS_DATA.macroVsProduct || { macro: 0, product: 0 };

    return {
      hotResponseRows,
      coveredCount,
      laggedCount,
      uncoveredCount,
      responseRate,
      avgLag,
      carryCoveredRate,
      ownTotal,
      industryTotal,
      ownByChannel,
      ownFormat,
      activeOwn,
      activeIndustry,
      topicSupplyRows,
      acceptanceRows,
      productAcceptanceRate,
      gapList,
      topicProductizationRows,
      highProductization,
      lowProductization,
      macroVsProduct,
    };
  }, []);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900">运营洞察</h2>
          <p className="mt-1 text-sm text-slate-500">从市场热度、内容供给、推品承接到需求验证，追踪运营动作与结果。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RADAR_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                activeTab === tab ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {activeTab === '市场雷达' && (
        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm text-slate-600">
              本周热度主线由 <span className="font-semibold text-slate-900">黄金概念 + AI应用</span> 主导，AI相关话题环比上升最快，短视频渠道贡献最高。
            </div>
            <div className="-mx-1 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-3 px-1">
                {topicHeatRank.map((item) => (
                  <article
                    key={item.topic}
                    className="w-[280px] shrink-0 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-900">{item.topic}</div>
                      <div className="text-sm text-rose-600">+{item.mom}%</div>
                    </div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <span>热度分：{item.heat}</span>
                      <span>最佳形式：{item.bestFormat}</span>
                      <span className="inline-flex items-center gap-1">
                        渠道：
                        {item.channels.map((platform) => {
                          const logo = PLATFORM_ICON_META[platform]?.logo;
                          return (
                            <span
                              key={`${item.topic}-${platform}`}
                              className="inline-flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                              title={platform}
                              aria-label={platform}
                            >
                              {logo ? (
                                <img src={logo} alt={platform} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-[9px] text-slate-400">-</span>
                              )}
                            </span>
                          );
                        })}
                      </span>
                      <span>{item.lifecycle}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-slate-900">内容供给概览</div>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {CONTENT_SUPPLY_METRICS.map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{item.value}</div>
                  <div className="text-xs text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-3 text-xs text-slate-500">内容形式分布</div>
              <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[200px_1fr]">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full" style={formatRingStyle}>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-center">
                    <div>
                      <div className="text-xs text-slate-500">素材结构</div>
                      <div className="text-sm font-semibold text-slate-900">近7天</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {FORMAT_DISTRIBUTION.map((item) => (
                    <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                          {item.name}
                        </span>
                        <span className="font-semibold text-slate-900">{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">内容推品热度</div>
                <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">主推视图</div>
              </div>
              <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
                {contentProductHot.mainPush.map((item) => (
                  <div key={item.product} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                        <span>{item.product}</span>
                        <span className="inline-flex items-center gap-1">
                          {item.platforms.map((platform) => {
                            const logo = PLATFORM_ICON_META[platform]?.logo;
                            return (
                              <span
                                key={`${item.product}-${platform}`}
                                className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                                title={platform}
                                aria-label={platform}
                              >
                                {logo ? (
                                  <img src={logo} alt={platform} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[9px] text-slate-400">-</span>
                                )}
                              </span>
                            );
                          })}
                        </span>
                      </span>
                      <span className="text-sm text-rose-600">+{item.change}%</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>基金代码 {item.code}</span>
                      <span>·</span>
                      <span>{item.institution}</span>
                      <span className="inline-flex rounded-full bg-rose-100 px-2 py-0.5 text-[11px] text-rose-700">机构主推</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">货架推品热度</div>
                <div className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">曝光量视角</div>
              </div>
              <div className="max-h-[420px] space-y-2.5 overflow-y-auto pr-1">
                {shelfHeat.exposure.map((item) => (
                  <div key={item.product} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-900">
                        <span>{item.product}</span>
                        <span className="inline-flex items-center gap-1">
                          {item.platforms.map((platform) => {
                            const logo = PLATFORM_ICON_META[platform]?.logo;
                            return (
                              <span
                                key={`${item.product}-${platform}`}
                                className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white"
                                title={platform}
                                aria-label={platform}
                              >
                                {logo ? (
                                  <img src={logo} alt={platform} className="h-full w-full object-cover" />
                                ) : (
                                  <span className="text-[9px] text-slate-400">-</span>
                                )}
                              </span>
                            );
                          })}
                        </span>
                      </span>
                      <span className="text-sm text-rose-600">+{item.growth}%</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>基金代码 {item.code}</span>
                      <span>·</span>
                      <span>{item.institution}</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">货架：{item.shelfNames.join(' / ')}</div>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-900">内容产品化进程结果</div>
            <div className="mb-3 text-xs text-slate-500">
              从高热话题出发，筛选“内容主推 + 支付宝货架承接”同时成立的产品，作为产品化进程最高的落地结果。
            </div>
            <div className="space-y-2.5">
              {productizationResults.map((item) => (
                <article key={`${item.topic}-${item.product}`} className="rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="inline-flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700">热点：{item.topic}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${levelClass[item.level]}`}>{item.level}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">进程分 {item.score}</div>
                  </div>

                  <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-[1.2fr_auto_1fr_auto_1fr_auto_1fr] lg:items-center">
                    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2">
                      <div className="text-[11px] text-slate-500">内容表达</div>
                      <div className="mt-1 text-sm text-slate-700">{item.contentStyle}</div>
                      <div className="mt-1 flex flex-wrap items-center gap-1">
                        {item.contentPlatforms.map((platform) => {
                          const logo = PLATFORM_ICON_META[platform]?.logo;
                          return (
                            <span key={`${item.product}-content-${platform}`} className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white" title={platform}>
                              {logo ? <img src={logo} alt={platform} className="h-full w-full object-cover" /> : <span className="text-[9px] text-slate-400">-</span>}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="text-center text-slate-300">→</div>
                    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2">
                      <div className="text-[11px] text-slate-500">货架承接（支付宝）</div>
                      <div className="mt-1 text-sm text-slate-700">{item.shelfNames.join(' / ')}</div>
                      <div className="mt-1 text-xs text-rose-600">货架增速 +{item.shelfGrowth}%</div>
                    </div>
                    <div className="text-center text-slate-300">→</div>
                    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2">
                      <div className="text-[11px] text-slate-500">落地产品</div>
                      <div className="mt-1 text-sm font-medium text-slate-900">{item.product}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.code} · {item.institution}</div>
                    </div>
                    <div className="text-center text-slate-300">→</div>
                    <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2">
                      <div className="text-[11px] text-slate-500">需求验证热度</div>
                      <div className="mt-1 text-xs text-slate-700">加自选 {item.validateWatchlist}</div>
                      <div className="mt-0.5 text-xs text-slate-700">持有人 {item.validateHolders}</div>
                      <div
                        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                          item.resonance.includes('多平台')
                            ? 'bg-emerald-100 text-emerald-700'
                            : item.resonance.includes('双平台')
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {item.resonance}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>

        </section>
      )}

      {activeTab === '运营诊断' && (
        <section className="space-y-4">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">运营健康度概览</div>
            <p className="mt-1 text-xs text-slate-500">
              结合市场异动与机构资源投放，点击下方诊断维度，查看对应的运营分析内容。
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {DIAGNOSIS_TABS.map((tab) => {
                const active = diagnosisTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setDiagnosisTab(tab)}
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="text-base font-semibold">{tab}</div>
                    <div className={`mt-2 text-xs ${active ? 'text-slate-200' : 'text-slate-500'}`}>
                      点击查看该维度的运营诊断详情
                    </div>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            {diagnosisTab === '热点响应' && (
              <>
                <div className="text-sm font-semibold text-slate-900">热点响应</div>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">高价值热点响应率</div><div className="mt-1 text-lg font-semibold text-emerald-700">{diagnosisMetrics.responseRate}%</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">高价值未响应数</div><div className="mt-1 text-lg font-semibold text-rose-700">{diagnosisMetrics.uncoveredCount}</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">滞后响应数</div><div className="mt-1 text-lg font-semibold text-amber-700">{diagnosisMetrics.laggedCount}</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">平均响应时差</div><div className="mt-1 text-lg font-semibold text-slate-900">{diagnosisMetrics.avgLag} 天</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">可承接热点覆盖率</div><div className="mt-1 text-lg font-semibold text-sky-700">{diagnosisMetrics.carryCoveredRate}%</div></div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">高价值热点优先级矩阵</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.hotResponseRows.map((item) => (
                        <div key={`matrix-${item.topic}`} className="rounded-md border border-slate-200 bg-white px-2.5 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-medium text-slate-900">{item.topic}</div>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                              item.status === '已及时响应'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.status === '滞后响应'
                                  ? 'bg-amber-100 text-amber-700'
                                  : item.status === '未响应'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-slate-100 text-slate-600'
                            }`}>{item.status}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            X(行业热度): {item.industryHeat} · Y(产品承接价值): {item.productCarryScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">渠道缺口视图</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.hotResponseRows.map((item) => (
                        <div key={`channel-gap-${item.topic}`} className="rounded-md border border-slate-200 bg-white px-2.5 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-xs font-medium text-slate-700">{item.topic}</div>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] ${
                              item.channelTag === '覆盖充分'
                                ? 'bg-emerald-100 text-emerald-700'
                                : item.channelTag === '主阵地已覆盖'
                                  ? 'bg-sky-100 text-sky-700'
                                  : item.channelTag === '主阵地缺失'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-700'
                            }`}>{item.channelTag}</span>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            行业主阵地：{item.industryMainChannels.join(' / ')}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            我方覆盖：{item.coveredChannels.length ? item.coveredChannels.join(' / ') : '未覆盖'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                  <div className="mb-2 text-xs font-medium text-slate-700">热点响应诊断表</div>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                    <table className="min-w-[1100px] w-full text-xs">
                      <thead className="bg-slate-50 text-slate-500">
                        <tr className="border-b border-slate-200">
                          <th className="px-2 py-2 text-left">话题</th>
                          <th className="px-2 py-2 text-left">行业热度等级</th>
                          <th className="px-2 py-2 text-left">生命周期</th>
                          <th className="px-2 py-2 text-left">产品承接度</th>
                          <th className="px-2 py-2 text-left">我方状态</th>
                          <th className="px-2 py-2 text-left">响应时差</th>
                          <th className="px-2 py-2 text-left">覆盖渠道</th>
                          <th className="px-2 py-2 text-left">关联产品数</th>
                          <th className="px-2 py-2 text-left">诊断标签</th>
                        </tr>
                      </thead>
                      <tbody>
                        {diagnosisMetrics.hotResponseRows.map((item, index) => (
                          <tr
                            key={`diag-row-${item.topic}`}
                            className={`border-b border-slate-100 text-slate-700 transition hover:bg-sky-50/40 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                          >
                            <td className="px-2 py-2 font-medium">{item.topic}</td>
                            <td className="px-2 py-2">{item.industryHeatLevel}</td>
                            <td className="px-2 py-2">{item.lifecycle}</td>
                            <td className="px-2 py-2">{item.productCarryScore}</td>
                            <td className="px-2 py-2">{item.status}</td>
                            <td className="px-2 py-2">{item.status === '不建议响应' ? '-' : `${item.lagDays} 天`}</td>
                            <td className="px-2 py-2">{item.coveredChannels.length ? item.coveredChannels.join(' / ') : '未覆盖'}</td>
                            <td className="px-2 py-2">{item.relatedProductCount}</td>
                            <td className="px-2 py-2">
                              <span className={`rounded-full px-2 py-0.5 ${
                                item.diagnosisTag === '及时覆盖'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : item.diagnosisTag === '滞后补位'
                                    ? 'bg-amber-100 text-amber-700'
                                    : item.diagnosisTag === '高价值缺位'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-slate-100 text-slate-600'
                              }`}>{item.diagnosisTag}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {diagnosisTab === '内容供给' && (
              <>
                <div className="text-sm font-semibold text-slate-900">内容供给</div>
                <p className="mt-1 text-xs text-slate-500">回答问题：同样的话题，我的内容投入够不够、结构对不对。</p>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">双列对比卡</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-md bg-white px-2.5 py-2"><span className="text-slate-500">内容总量</span><span className="font-medium text-slate-900">{diagnosisMetrics.ownTotal} / {diagnosisMetrics.industryTotal}</span></div>
                      <div className="flex items-center justify-between rounded-md bg-white px-2.5 py-2"><span className="text-slate-500">活跃机构</span><span className="font-medium text-slate-900">{diagnosisMetrics.activeOwn} / {diagnosisMetrics.activeIndustry}</span></div>
                      <div className="flex items-center justify-between rounded-md bg-white px-2.5 py-2"><span className="text-slate-500">内容量差距</span><span className="font-medium text-amber-700">{diagnosisMetrics.industryTotal - diagnosisMetrics.ownTotal}</span></div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">形式分布环图（简化）</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.ownFormat.map((item) => (
                        <div key={`format-${item.name}`} className="rounded-md bg-white px-2.5 py-2 text-xs">
                          <div className="mb-1 flex items-center justify-between text-slate-500"><span>{item.name}</span><span>我方 {item.own}% / 行业 {item.industry}%</span></div>
                          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-sky-500" style={{ width: `${item.own}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">渠道堆叠图（简化）</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.ownByChannel.map((row) => (
                        <div key={`channel-${row.channel}`} className="text-xs">
                          <div className="mb-1 flex items-center justify-between text-slate-500"><span>{row.channel}</span><span>我方 {row.own}% / 行业 {row.industry}%</span></div>
                          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${row.own}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">供给强弱热力表</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.topicSupplyRows.map((row) => {
                        const intensity = row.ownSupply / Math.max(row.industrySupply, 1);
                        const tone = intensity >= 0.9 ? 'bg-emerald-100 text-emerald-700' : intensity >= 0.75 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700';
                        return <div key={`supply-${row.topic}`} className="flex items-center justify-between rounded-md bg-white px-2.5 py-2 text-xs"><span className="text-slate-600">{row.topic}</span><span className={`rounded-full px-2 py-0.5 ${tone}`}>我方{row.ownSupply} / 行业{row.industrySupply}</span></div>;
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {diagnosisTab === '产品承接' && (
              <>
                <div className="text-sm font-semibold text-slate-900">产品承接</div>
                <p className="mt-1 text-xs text-slate-500">回答问题：我推的产品，是否被货架和渠道结果真正接住。</p>
                <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 lg:col-span-2"><div className="text-xs text-slate-500">产品承接率</div><div className="mt-1 text-xl font-semibold text-emerald-700">{diagnosisMetrics.productAcceptanceRate}%</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">内容+货架一致</div><div className="mt-1 text-xl font-semibold text-slate-900">{diagnosisMetrics.acceptanceRows.filter((item) => item.contentHit && item.shelfHit).length}</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">共振产品</div><div className="mt-1 text-xl font-semibold text-emerald-700">{diagnosisMetrics.acceptanceRows.filter((item) => item.resonance).length}</div></div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"><div className="text-xs text-slate-500">承接缺口</div><div className="mt-1 text-xl font-semibold text-rose-700">{diagnosisMetrics.gapList.length}</div></div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_1fr]">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">状态矩阵（内容推品 + 货架推品）</div>
                    <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                      {diagnosisMetrics.acceptanceRows.map((item) => (
                        <div key={`matrix-${item.product}`} className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs">
                          <span className="text-slate-700">{item.product}</span>
                          <span className="inline-flex items-center gap-1.5">
                            <span className={`rounded-full px-2 py-0.5 ${item.contentHit ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>内容</span>
                            <span className={`rounded-full px-2 py-0.5 ${item.shelfHit ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>货架</span>
                            <span className={`rounded-full px-2 py-0.5 ${item.resonance ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.label}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">承接缺口榜 / 四象限</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.gapList.map((item) => (
                        <div key={`gap-${item.product}`} className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs">
                          <div className="flex items-center justify-between"><span className="font-medium text-slate-700">{item.product}</span><span className="text-rose-700">缺口 {item.gap}</span></div>
                          <div className="mt-1 text-slate-500">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {diagnosisTab === '内容产品化进程' && (
              <>
                <div className="text-sm font-semibold text-slate-900">内容产品化进程</div>
                <p className="mt-1 text-xs text-slate-500">回答问题：我的内容是否已经从话题表达进入产品表达。</p>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr]">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">我方 vs 行业对比条形图（产品化率）</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.topicProductizationRows.map((item) => (
                        <div key={`rate-${item.topic}`}>
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-500"><span>{item.topic}</span><span>我方 {item.ownRate}% / 行业 {item.industryRate}%</span></div>
                          <div className="h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-indigo-500" style={{ width: `${item.ownRate}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">宏观内容 vs 产品内容占比</div>
                    <div className="rounded-md bg-white px-2.5 py-2 text-xs text-slate-600">
                      <div className="flex items-center justify-between"><span>宏观内容</span><span>{diagnosisMetrics.macroVsProduct.macro}%</span></div>
                      <div className="mt-1 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-slate-500" style={{ width: `${diagnosisMetrics.macroVsProduct.macro}%` }} /></div>
                      <div className="mt-2 flex items-center justify-between"><span>产品内容</span><span>{diagnosisMetrics.macroVsProduct.product}%</span></div>
                      <div className="mt-1 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${diagnosisMetrics.macroVsProduct.product}%` }} /></div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">重点话题产品映射深度：{diagnosisMetrics.topicProductizationRows.map((item) => `${item.topic}(${item.depth})`).join('、')}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">高产品化话题榜</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.highProductization.map((item) => (
                        <div key={`high-${item.topic}`} className="flex items-center justify-between rounded-md bg-white px-2.5 py-2 text-xs"><span className="text-slate-700">{item.topic}</span><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">{item.ownRate}%</span></div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="mb-2 text-xs font-medium text-slate-700">低产品化话题榜</div>
                    <div className="space-y-2">
                      {diagnosisMetrics.lowProductization.map((item) => (
                        <div key={`low-${item.topic}`} className="flex items-center justify-between rounded-md bg-white px-2.5 py-2 text-xs"><span className="text-slate-700">{item.topic}</span><span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">{item.ownRate}%</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </article>
        </section>
      )}
    </div>
  );
};

export default OperationsInsight;
