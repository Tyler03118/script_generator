import { useState } from 'react';
import type { SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData } from '../types';
import { Brain, LoaderCircle, TriangleAlert } from 'lucide-react';

// 定义联合类型
type FormDataType = SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData;

// 扩展 Window 接口
declare global {
  interface Window {
    getJoinedProductData?: () => Partial<FormDataType>;
  }
}

interface GenerateButtonProps {
  onGenerate: () => void;
  isLoading?: boolean;
  isFormValid?: boolean;
  formData?: FormDataType | null;
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
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // 获取拼接后的产品数据
    const getJoinedProductData = window.getJoinedProductData;
    let finalFormData: FormDataType | null = formData;

    if (getJoinedProductData && formData) {
      const joinedData = getJoinedProductData();
      finalFormData = {
        ...formData,
        ...joinedData
      } as FormDataType;
    }

    console.log('生成脚本参数:', finalFormData);
    onGenerate();
  };

  return (
    <div className="my-2 text-center">
      {showError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm animate-pulse">
          <div className="flex items-center space-x-2">
            <TriangleAlert className='text-red-500'/>
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
              <LoaderCircle className="w-5 h-5 animate-spin"/>
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Brain className='w-5 h-5'/>
              <span> 生成脚本</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
