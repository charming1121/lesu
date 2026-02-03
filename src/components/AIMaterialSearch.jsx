import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Filter, Loader2, ChevronRight } from 'lucide-react';
import MaterialCard from './MaterialCard';
import MaterialModal from './MaterialModal';
import AssetCardSkeleton from './AssetCardSkeleton';
import { allMaterials } from '../data/materialsData';

/**
 * AI 素材检索页面 (AI Material Search)
 * 类似 Perplexity AI / Glean / ChatGPT Search 的生成式搜索界面
 */
const AIMaterialSearch = () => {
  const [query, setQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [currentSearch, setCurrentSearch] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // 建议芯片
  const suggestionChips = [
    '近期热门ETF海报',
    '基金经理路演视频',
    '一季度策略长图',
    '红利低波相关素材',
  ];

  // 模拟 AI 意图解析（从用户查询中提取筛选条件）
  const parseQueryIntent = (queryText) => {
    const intent = {
      keywords: [],
      platform: null,
      contentType: null,
      theme: null,
    };

    const lowerQuery = queryText.toLowerCase();

    // 平台识别
    if (lowerQuery.includes('微信') || lowerQuery.includes('公众号')) {
      intent.platform = '公众号';
    } else if (lowerQuery.includes('蚂蚁') || lowerQuery.includes('支付宝')) {
      intent.platform = '蚂蚁财富号';
    } else if (lowerQuery.includes('小红书')) {
      intent.platform = '小红书';
    }

    // 内容形式识别
    if (lowerQuery.includes('视频') || lowerQuery.includes('路演')) {
      intent.contentType = '视频';
    } else if (lowerQuery.includes('长图') || lowerQuery.includes('海报')) {
      intent.contentType = '长图';
    } else if (lowerQuery.includes('推文') || lowerQuery.includes('文章')) {
      intent.contentType = '推文';
    }

    // 主题识别
    if (lowerQuery.includes('红利') || lowerQuery.includes('低波')) {
      intent.theme = '红利低波';
    } else if (lowerQuery.includes('etf') || lowerQuery.includes('新发')) {
      intent.theme = 'ETF新发';
    } else if (lowerQuery.includes('宽基') || lowerQuery.includes('指数')) {
      intent.theme = '宽基/指数';
    } else if (lowerQuery.includes('业绩') || lowerQuery.includes('榜单')) {
      intent.theme = '业绩/榜单';
    }

    // 关键词提取
    const keywords = queryText
      .split(/[\s，,、]+/)
      .filter((word) => word.length > 1)
      .slice(0, 3);
    intent.keywords = keywords;

    return intent;
  };

  // 根据意图过滤素材
  const filterByIntent = (intent) => {
    let results = [...allMaterials];

    // 关键词搜索
    if (intent.keywords.length > 0) {
      results = results.filter((item) => {
        const searchText = `${item.source} ${item.summary} ${item.title} ${item.tags.join(' ')}`.toLowerCase();
        return intent.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()));
      });
    }

    // 平台筛选
    if (intent.platform) {
      results = results.filter((item) => {
        if (intent.platform === '公众号') {
          return item.channel === '公众号';
        }
        return item.channel && item.channel.includes(intent.platform);
      });
    }

    // 内容形式筛选
    if (intent.contentType) {
      const contentTypeMap = {
        视频: '视频',
        长图: '长图',
        推文: '推文',
      };
      const mappedType = contentTypeMap[intent.contentType] || intent.contentType;
      results = results.filter((item) => item.type === mappedType);
    }

    // 主题筛选
    if (intent.theme) {
      results = results.filter((item) => item.category === intent.theme);
    }

    return results;
  };

  // 生成 AI 摘要
  const generateAISummary = (intent, results) => {
    const parts = [];
    
    if (results.length === 0) {
      return '抱歉，没有找到相关素材。请尝试调整搜索关键词。';
    }

    parts.push(`我找到了 ${results.length} 条相关素材`);

    if (intent.platform) {
      parts.push(`来自 ${intent.platform}`);
    }

    if (intent.contentType) {
      parts.push(`内容形式为 ${intent.contentType}`);
    }

    if (intent.theme) {
      parts.push(`主题为 ${intent.theme}`);
    }

    parts.push('以下是精选推荐：');

    return parts.join('，') + '。';
  };

  // 生成 AI 思考过程
  const generateThinkingSteps = (intent) => {
    const steps = ['分析查询意图...'];
    
    if (intent.keywords.length > 0) {
      steps.push(`提取关键词：${intent.keywords.join('、')}`);
    }
    
    const filters = [];
    if (intent.platform) filters.push(intent.platform);
    if (intent.contentType) filters.push(intent.contentType);
    if (intent.theme) filters.push(intent.theme);
    
    if (filters.length > 0) {
      steps.push(`筛选条件：${filters.join('、')}`);
    }
    
    steps.push('匹配相关素材...');
    
    return steps;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setAiThinking(true);
    setCurrentSearch(null);

    // 解析查询意图
    const intent = parseQueryIntent(query);
    const thinkingSteps = generateThinkingSteps(intent);

    // 先显示思考过程
    setCurrentSearch({
      query,
      intent,
      results: [],
      summary: '',
      thinkingSteps,
    });

    // 模拟 AI 思考过程
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 过滤结果
    const results = filterByIntent(intent);
    const summary = generateAISummary(intent, results);

    setAiThinking(false);
    setCurrentSearch({
      query,
      intent,
      results,
      summary,
      thinkingSteps,
    });

    // 添加到搜索历史
    setSearchHistory((prev) => [{ query, timestamp: Date.now() }, ...prev.slice(0, 4)]);
    setIsSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    // 自动触发搜索
    setTimeout(() => {
      handleSearch();
    }, 100);
  };

  const handleMaterialClick = (material) => {
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMaterial(null);
  };

  const isInitialState = !currentSearch && searchHistory.length === 0;

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* 初始状态：居中搜索体验 */}
      {isInitialState ? (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4">
          {/* 问候语 */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              今天想找什么基金营销素材？
            </h1>
            <p className="text-gray-500">使用自然语言描述您的需求，AI 将为您智能匹配</p>
          </div>

          {/* 核心搜索框 */}
          <div className="w-full max-w-3xl mb-6">
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="试试问：查找上周支付宝上热门的红利ETF海报..."
                className="flex-1 px-4 py-4 text-base focus:outline-none bg-transparent"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="高级筛选"
                >
                  <Filter className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!query.trim() || isSearching}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md disabled:shadow-none"
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>搜索</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 建议芯片 */}
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
            {suggestionChips.map((chip, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(chip)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 搜索/响应状态：流式视图 */
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* 顶部搜索框（固定） */}
          <div className="sticky top-16 z-10 bg-white border-b border-gray-200 pb-4 mb-6 -mx-6 px-6">
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative bg-gray-50 rounded-xl border border-gray-200 p-2 flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="继续提问或搜索..."
                  className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent"
                />
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Filter className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <button
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium rounded-xl transition-all flex items-center gap-2"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="mb-6 space-y-4">
              {searchHistory.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Search className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-2">{item.query}</div>
                      {/* 这里可以显示该查询的结果摘要 */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 当前搜索结果 */}
          {currentSearch && (
            <div className="space-y-6">
              {/* 用户查询 */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{currentSearch.query}</div>
                  </div>
                </div>
              </div>

              {/* AI 思考指示器 */}
              {aiThinking && currentSearch && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm text-gray-600">正在分析...</span>
                      </div>
                      {currentSearch.thinkingSteps && currentSearch.thinkingSteps.length > 0 && (
                        <div className="space-y-1.5 mt-3">
                          {currentSearch.thinkingSteps.map((step, idx) => (
                            <div key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AI 摘要 */}
              {!aiThinking && currentSearch.summary && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-800 leading-relaxed">
                        {currentSearch.summary}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 智能网格 - 素材卡片 */}
              {!aiThinking && currentSearch.results.length > 0 && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">精选素材</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {currentSearch.results.slice(0, 12).map((item) => {
                      const material = {
                        ...item,
                        imagePath: `${item.path}${item.imageId}.jpg`,
                      };
                      return (
                        <MaterialCard
                          key={item.id}
                          imagePath={material.imagePath}
                          source={item.source}
                          time={item.time}
                          material={material}
                          onClick={handleMaterialClick}
                          className="w-full"
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 后续建议 */}
              {!aiThinking && currentSearch.results.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-3">相关查询建议：</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setQuery('按互动量排序');
                        handleSearch();
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 flex items-center gap-1 transition-colors"
                    >
                      按互动量排序
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setQuery('显示视频格式');
                        handleSearch();
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 flex items-center gap-1 transition-colors"
                    >
                      显示视频格式
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setQuery('最新发布的素材');
                        handleSearch();
                      }}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs text-gray-700 flex items-center gap-1 transition-colors"
                    >
                      最新发布的素材
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* 无结果状态 */}
              {!aiThinking && currentSearch.results.length === 0 && (
                <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
                  <div className="text-gray-400 mb-2">未找到相关素材</div>
                  <div className="text-sm text-gray-500">请尝试调整搜索关键词或使用不同的表达方式</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 模态框 */}
      {isModalOpen && selectedMaterial && (
        <MaterialModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          material={selectedMaterial}
        />
      )}
    </div>
  );
};

export default AIMaterialSearch;
