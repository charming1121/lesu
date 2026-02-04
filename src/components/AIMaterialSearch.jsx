import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, Loader2, ChevronRight } from 'lucide-react';
import DeconstructedCard from './DeconstructedCard';
import MaterialDetail from './MaterialDetail';
import { getLabeledMaterials } from '../data/labeledMaterialsData';
import { extractKeywords, searchMaterials } from '../utils/nlpQuery';

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
  const [showDetail, setShowDetail] = useState(false);
  const [labeledMaterials, setLabeledMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 加载标签数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const materials = await getLabeledMaterials();
        console.log('[AIMaterialSearch] 加载素材数据:', materials.length, '条');
        if (materials.length > 0) {
          console.log('[AIMaterialSearch] 前3个素材:', materials.slice(0, 3).map(m => ({
            id: m.id,
            title: m.title?.substring(0, 20),
            视觉风格: m.视觉风格
          })));
        }
        setLabeledMaterials(materials);
      } catch (error) {
        console.error('[AIMaterialSearch] Failed to load labeled materials:', error);
        setLabeledMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 建议芯片
  const suggestionChips = [
    '科技风格的相关素材',
    '热点解读的长图',
    '产品宣传的海报',
    '新能源行业的素材',
  ];

  // 生成 AI 摘要
  const generateAISummary = (extractedKeywords, results) => {
    const parts = [];
    
    if (results.length === 0) {
      return '抱歉，没有找到相关素材。请尝试调整搜索关键词。';
    }

    parts.push(`我找到了 ${results.length} 条相关素材`);

    const filters = [];
    if (extractedKeywords.visualStyle) filters.push(`视觉风格：${extractedKeywords.visualStyle}`);
    if (extractedKeywords.materialPositioning) filters.push(`物料定位：${extractedKeywords.materialPositioning}`);
    if (extractedKeywords.materialType) filters.push(`物料类型：${extractedKeywords.materialType}`);
    if (extractedKeywords.industryTheme) filters.push(`行业主题：${extractedKeywords.industryTheme}`);
    if (extractedKeywords.pushTiming) filters.push(`推送时机：${extractedKeywords.pushTiming}`);
    if (extractedKeywords.sellingPoint) filters.push(`核心卖点：${extractedKeywords.sellingPoint}`);
    
    if (filters.length > 0) {
      parts.push(`筛选条件：${filters.join('、')}`);
    }

    parts.push('以下是精选推荐：');

    return parts.join('，') + '。';
  };

  // 生成 AI 思考过程
  const generateThinkingSteps = (extractedKeywords) => {
    const steps = ['分析查询意图...'];
    
    const extracted = [];
    if (extractedKeywords.visualStyle) extracted.push(`视觉风格：${extractedKeywords.visualStyle}`);
    if (extractedKeywords.materialPositioning) extracted.push(`物料定位：${extractedKeywords.materialPositioning}`);
    if (extractedKeywords.materialType) extracted.push(`物料类型：${extractedKeywords.materialType}`);
    if (extractedKeywords.industryTheme) extracted.push(`行业主题：${extractedKeywords.industryTheme}`);
    if (extractedKeywords.pushTiming) extracted.push(`推送时机：${extractedKeywords.pushTiming}`);
    if (extractedKeywords.sellingPoint) extracted.push(`核心卖点：${extractedKeywords.sellingPoint}`);
    
    if (extracted.length > 0) {
      steps.push(`提取关键词：${extracted.join('、')}`);
    }
    
    if (extractedKeywords.keywords.length > 0) {
      steps.push(`其他关键词：${extractedKeywords.keywords.join('、')}`);
    }
    
    steps.push('匹配相关素材...');
    
    return steps;
  };

  const handleSearch = async () => {
    if (!query.trim() || loading) return;

    setIsSearching(true);
    setAiThinking(true);
    setCurrentSearch(null);
    setCurrentPage(1);

    // 提取关键词
    const extractedKeywords = extractKeywords(query);
    const thinkingSteps = generateThinkingSteps(extractedKeywords);

    // 先显示思考过程
    setCurrentSearch({
      query,
      extractedKeywords,
      results: [],
      summary: '',
      thinkingSteps,
    });

    // 模拟 AI 思考过程
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 搜索素材
    let results = [];
    if (labeledMaterials.length > 0) {
      results = searchMaterials(labeledMaterials, extractedKeywords);
      
      // 调试信息
      console.log('=== 搜索调试 ===');
      console.log('查询:', query);
      console.log('提取的关键词:', extractedKeywords);
      console.log('总素材数:', labeledMaterials.length);
      console.log('搜索结果数:', results.length);
      if (labeledMaterials.length > 0) {
        console.log('前3个素材的视觉风格:', labeledMaterials.slice(0, 3).map(m => ({
          id: m.id,
          title: m.title?.substring(0, 20),
          视觉风格: m.视觉风格
        })));
      }
      if (results.length > 0) {
        console.log('前3个结果:', results.slice(0, 3).map(m => ({
          id: m.id,
          title: m.title?.substring(0, 20),
          视觉风格: m.视觉风格
        })));
      }
      console.log('==============');
    }
    
    const summary = generateAISummary(extractedKeywords, results);

    setAiThinking(false);
    setCurrentSearch({
      query,
      extractedKeywords,
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
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
    setSelectedMaterial(null);
  };
  
  // 分页计算
  const paginatedResults = useMemo(() => {
    if (!currentSearch || !currentSearch.results) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentSearch.results.slice(startIndex, endIndex);
  }, [currentSearch, currentPage, itemsPerPage]);
  
  const totalPages = currentSearch ? Math.ceil(currentSearch.results.length / itemsPerPage) : 0;

  const isInitialState = !currentSearch && searchHistory.length === 0;

  // 如果显示详情页，直接渲染详情组件
  if (showDetail && selectedMaterial) {
    return <MaterialDetail material={selectedMaterial} onBack={handleBackToList} />;
  }

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
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => {
                    setIsInputFocused(true);
                    if (searchHistory.length > 0) {
                      setShowHistoryDropdown(true);
                    }
                  }}
                  onBlur={() => {
                    // 延迟隐藏，允许点击历史记录项
                    setTimeout(() => {
                      setIsInputFocused(false);
                      setShowHistoryDropdown(false);
                    }, 200);
                  }}
                  placeholder="试试问：查找上周支付宝上热门的红利ETF海报..."
                  className="flex-1 px-4 py-4 text-base focus:outline-none bg-transparent"
                />
                <div className="flex items-center gap-2">
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
              
              {/* 搜索历史下拉框 */}
              {showHistoryDropdown && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                  <div className="py-2">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(item.query);
                          setShowHistoryDropdown(false);
                          setIsInputFocused(false);
                          setTimeout(() => handleSearch(), 100);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                      >
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{item.query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
              <div className="flex-1 relative">
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-2 flex items-center">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => {
                      setIsInputFocused(true);
                      if (searchHistory.length > 0) {
                        setShowHistoryDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      // 延迟隐藏，允许点击历史记录项
                      setTimeout(() => {
                        setIsInputFocused(false);
                        setShowHistoryDropdown(false);
                      }, 200);
                    }}
                    placeholder="继续提问或搜索..."
                    className="flex-1 px-4 py-3 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                
                {/* 搜索历史下拉框 */}
                {showHistoryDropdown && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg overflow-hidden z-20">
                    <div className="py-2">
                      {searchHistory.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(item.query);
                            setShowHistoryDropdown(false);
                            setIsInputFocused(false);
                            setTimeout(() => handleSearch(), 100);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                        >
                          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-700 flex-1 truncate">{item.query}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

          {/* 当前搜索结果 */}
          {currentSearch && (
            <div className="space-y-6">
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

              {/* 素材网格 - 使用与全网竞品情报流相同的展示方式 */}
              {!aiThinking && currentSearch.results.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">
                      共找到 <span className="text-blue-600 font-semibold">{currentSearch.results.length}</span> 条相关素材
                      {totalPages > 1 && (
                        <span className="ml-2 text-xs text-gray-500">
                          · 第 <span className="text-blue-600 font-semibold">{currentPage}</span> / {totalPages} 页
                        </span>
                      )}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {paginatedResults.map((material) => (
                      <DeconstructedCard
                        key={material.id}
                        material={material}
                        onClick={handleMaterialClick}
                        activeTab="全部"
                      />
                    ))}
                  </div>
                  
                  {/* 分页控件 */}
                  {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        上一页
                      </button>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        第 {currentPage} / {totalPages} 页
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        下一页
                      </button>
                    </div>
                  )}
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

    </div>
  );
};

export default AIMaterialSearch;
