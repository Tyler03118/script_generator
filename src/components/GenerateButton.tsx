import { useState } from 'react';
import type { SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData } from '../types';

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading?: boolean;
  isFormValid?: boolean;
  formData?: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null;
}

export default function GenerateButton({ 
  onGenerate, 
  isLoading = false, 
  isFormValid = false,
  formData = null 
}: GenerateButtonProps) {
  const [showError, setShowError] = useState(false);

  const handleClick = () => {
    if (!isFormValid) {
      setShowError(true);
      // 3秒后隐藏错误提示
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // 获取拼接后的产品数据
    const getJoinedProductData = (window as typeof window & { getJoinedProductData?: () => any }).getJoinedProductData;
    let finalFormData = formData;

    if (getJoinedProductData) {
      const joinedData = getJoinedProductData();
      finalFormData = {
        ...formData,
        ...joinedData
      };
    }

    // 表单有效，输出参数并调用生成函数
    console.log('生成脚本参数:', finalFormData);
    onGenerate();
  };

  return (
    <div className="mt-2 text-center">
      {/* 错误提示 */}
      {showError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm animate-pulse">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">请先填写所有必填信息！</span>
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`font-medium py-4 px-12 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:transform-none cursor-pointer disabled:cursor-not-allowed ${
          isFormValid 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 active:from-blue-700 active:to-purple-800 text-white'
            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
        } ${isLoading ? 'from-gray-400 to-gray-500' : ''}`}
      >
        <div className="flex items-center space-x-2">
          {isLoading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>生成脚本</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
} 