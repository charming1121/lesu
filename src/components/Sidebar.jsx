import React from 'react';
import {
  Activity,
  Search,
  ShieldCheck,
  Settings,
} from 'lucide-react';

const Sidebar = ({ currentPage, onPageChange }) => {
  const menuItems = [
    {
      category: '核心功能',
      items: [
        { id: 'monitoring', label: '全网监控', icon: Activity },
        { id: 'material', label: '素材检索', icon: Search },
        { id: 'compliance', label: '合规检测', icon: ShieldCheck },
      ],
    },
    {
      category: '系统管理',
      items: [
        { id: 'settings', label: '账号设置', icon: Settings },
      ],
    },
  ];

  const handleMenuClick = (e, pageId) => {
    e.preventDefault();
    if (onPageChange) {
      onPageChange(pageId);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-white shadow-sm z-10">
      {/* Logo */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100">
        <div className="text-xl font-semibold text-gray-800">
          <span className="text-blue-600">乐素</span>
          <span className="text-gray-500 ml-2 text-sm">LeSu</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="mt-6 px-3">
        {menuItems.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-6">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-3">
              {category.category}
            </div>
            <ul className="space-y-1">
              {category.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href="#"
                      onClick={(e) => handleMenuClick(e, item.id)}
                      className={`
                        flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                        ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <IconComponent
                        className={`w-5 h-5 mr-3 ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      />
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
