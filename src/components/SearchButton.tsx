import { useState } from 'react';
import { ScanSearch, Loader } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { queryIGraphInfo } from '../services/api';

interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
  itemId?: string; // 商品ID属性
  isGeneratingScript?: boolean; // 新增：是否正在生成直播脚本
  onProductInfoFound?: (productInfo: {
    product_name?: string;
    product_price?: string;
    brand_info?: string;
    sellpoint?: string;
  }) => void; // 商品信息查询成功回调
}

const SearchButton = ({ onClick, className = '', itemId, isGeneratingScript = false, onProductInfoFound }: SearchButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    // 如果正在生成脚本，则不执行搜索
    if (isGeneratingScript) {
      return;
    }

    // 如果有外部onClick处理器，先调用
    if (onClick) {
      onClick();
    }

    // 检查是否有产品ID
    if (!itemId || itemId.trim() === '') {
      toast.warning('请先输入产品ID再进行搜索');
      return;
    }

    setIsLoading(true);
    
    try {
      
      // 调用iGraph查询API
      const result = await queryIGraphInfo(itemId);
      
      if (result.status === 'success' && result.data?.原始数据) {
        const productData = result.data.原始数据;
        
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
            console.error('❌ selling_points 不是 JSON 格式', e);
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
        
        
        // 显示成功通知
        toast.success('🎉 产品信息已自动填充!', {
          description: `商品名称: ${productData.item_name || '未获取到'}`
        });
        
      } else if (result.status === 'error' || !result.data?.原始数据) {
        toast.error('未查询到商品信息', {
          description: '此ID暂未被录入到知识库'
        });

      } else {
        toast.error('搜索结果异常', {
          description: '请稍后重试'
        });
      }
      
    } catch (error) {
      console.error('❌ 搜索失败:', error);
      toast.error('搜索失败', {
        description: '请稍后重试'
      });

    } finally {
      setIsLoading(false);
    }
  };

  // 按钮是否禁用：正在搜索或正在生成脚本时禁用
  const isDisabled = isLoading || isGeneratingScript;

  // 根据状态显示不同的 tooltip 文本
  const getTooltipText = () => {
    if (isGeneratingScript) {
      return '正在生成直播脚本，请稍候...';
    }
    if (isLoading) {
      return '正在搜索商品信息...';
    }
    if (!itemId) {
      return '请先输入产品ID';
    }
    return '一键填充产品信息';
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleSearch}
            disabled={isDisabled}
            className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg border border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <ScanSearch className="w-5 h-5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SearchButton;