import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      // 如果总页数少于等于7，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 如果总页数大于7，显示省略号
      if (currentPage <= 3) {
        // 当前页在前3页
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // 当前页在后3页
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 rounded-md border border-gray-300 text-sm font-medium
          ${currentPage === 1 
            ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
            : 'text-gray-700 hover:bg-gray-50 bg-white'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 页码 */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-4 py-2 rounded-md border border-gray-300 text-sm font-medium
              ${currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-700 hover:bg-gray-50 bg-white'
              }
            `}
          >
            {page}
          </button>
        );
      })}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-3 py-2 rounded-md border border-gray-300 text-sm font-medium
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-700 hover:bg-gray-50 bg-white'
          }
        `}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
