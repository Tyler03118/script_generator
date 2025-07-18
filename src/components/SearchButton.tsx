import { useState } from 'react';
import { ScanSearch, Loader } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { queryIGraphInfo } from '../services/api';

interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
  itemId?: string; // 商品ID属性
  onProductInfoFound?: (productInfo: {
    product_name?: string;
    product_price?: string;
    brand_info?: string;
    sellpoint?: string;
  }) => void; // 新增：商品信息查询成功回调
}

const SearchButton = ({ onClick, className = '', itemId, onProductInfoFound }: SearchButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    // 如果有外部onClick处理器，先调用
    if (onClick) {
      onClick();
    }

    // 检查是否有产品ID
    if (!itemId || itemId.trim() === '') {
      alert('⚠️ 请先输入产品ID再进行搜索');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🚀 开始搜索商品信息，商品ID:', itemId);
      
      // 调用iGraph查询API
      const result = await queryIGraphInfo(itemId);
      
      if (result.status === 'success' && result.data?.原始数据) {
        const productData = result.data.原始数据;
        console.log('✅ 商品信息查询成功:', {
          商品名称: productData.item_name,
          价格: productData.discount_price || productData.daily_price,
          品牌信息: productData.brand_ext_info,
          卖点: productData.selling_points
        });
        
        // 处理 selling_points 数据
        let processedSellpoint = '';
        if (productData.selling_points) {
          try {
            // 尝试解析 JSON 数组
            const sellpointsArray = JSON.parse(productData.selling_points);
            if (Array.isArray(sellpointsArray)) {
              processedSellpoint = sellpointsArray.join(';');
            } else {
              processedSellpoint = productData.selling_points;
            }
          } catch (e) {
            // 如果不是 JSON 格式，直接使用原始数据
            processedSellpoint = productData.selling_points;
          }
        }
        
        // 构造产品信息对象并回调给父组件
        const productInfo = {
          product_name: productData.item_name || '',
          product_price: productData.discount_price || productData.daily_price || '',
          brand_info: productData.brand_ext_info || '',
          sellpoint: processedSellpoint
        };
        
        // 调用回调函数传递商品信息
        if (onProductInfoFound) {
          onProductInfoFound(productInfo);
        }
        
        console.log('📤 商品信息已传递给父组件:', productInfo);
        
      } else if (result.status === 'error' || !result.data?.原始数据) {
        console.warn('⚠️ 未查询到商品信息:', result.message);
        alert('❌ 未查询到商品信息，请检查商品ID是否正确');

      } else {
        console.warn('⚠️ 搜索结果异常:', result);
        alert('❌ 搜索结果异常，请稍后重试');
      }
      
    } catch (error) {
      console.error('❌ 搜索失败:', error);
      alert('❌ 搜索失败，请稍后重试');

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`flex items-center justify-center w-10 h-[42px] bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg border border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <ScanSearch className="w-5 h-5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLoading ? '正在搜索商品信息...' : itemId ? '一键填充产品信息' : '请先输入产品ID'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SearchButton;