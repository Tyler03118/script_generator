import { useState, useEffect, useCallback, useRef } from 'react';
import { Speech, Drum, ShoppingCart, Video, Info } from "lucide-react"
import type { ScriptType, SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData } from '../types'
import { Calendar24 } from "@/components/ui/calendarTime"
import ProductList from './ProductList'

// 定义ProductListRef接口
interface ProductListRef {
  getJoinedProductData: () => {
    product_id: string;
    product_name: string;
    product_price: string;
    product_spec: string;
    sellpoint: string;
  };
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface RequiredInfoFormProps {
  activeTab: ScriptType;
  onDataChange?: (data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  triggerValidation?: boolean;
}

export default function RequiredInfoForm({ 
  activeTab,
  onDataChange,
  onValidationChange,
  triggerValidation = false
}: RequiredInfoFormProps) {

  const productListRef = useRef<ProductListRef>(null);
  const [isProductListValid, setIsProductListValid] = useState(false);
  
  // 单人推品表单数据
  const [singleProductData, setSingleProductData] = useState<SingleProductFormData>({
    product_name: '',
    product_id: '',
    product_spec: '',
    product_price: '',
    cpv: '',
    sellpoint: '',
    brand_name: '',
    live_topic: '',
    live_time: '',
    live_type: '',
    anchor_name: '',
    product_type: '',
    sessions: '',
    props: '',
    user_portrait: '',
    live_video_transcript: ''
  });

  // 嘉宾互动表单数据
  const [guestInteractionData, setGuestInteractionData] = useState<GuestInteractionFormData>({
    product_name: '',
    product_id: '',
    product_spec: '',
    product_price: '',
    cpv: '',
    sellpoint: '',
    brand_name: '',
    live_topic: '',
    live_time: '',
    live_type: '',
    anchor_name: '',
    product_type: '',
    sessions: '',
    props: '',
    user_portrait: '',
    guests: ''
  });

  // 商品卖点表单数据
  const [sellingPointData, setSellingPointData] = useState<ProductSellingPointFormData>({
    product_name: '',
    product_id: '',
    product_spec: '',
    product_price: '',
    cpv: '',
    sellpoint: '',
    retail_price: '',
    discount: '',
    mechanism: '',
    logistics: '',
    pr_date: '',
    brand_info: '',
    display: '',
    intro: ''
  });

  // 处理品牌信息更新
  const handleBrandInfoUpdate = useCallback((brandInfo: string) => {
    if (activeTab === '单人推品') {
      setSingleProductData(prev => ({ ...prev, brand_name: brandInfo }));
    } else if (activeTab === '嘉宾互动') {
      setGuestInteractionData(prev => ({ ...prev, brand_name: brandInfo }));
    } else if (activeTab === '商品卖点') {
      setSellingPointData(prev => ({ ...prev, brand_info: brandInfo }));
    }
    
    console.log(`✅ 品牌信息已更新到${activeTab}脚本的品牌信息字段`);
  }, [activeTab]);

  // 验证必填字段
  const validateRequiredFields = useCallback((data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData) => {
    // 产品列表验证由ProductList组件负责
    if (!isProductListValid) {
      return false;
    }

    if (activeTab === '单人推品') {
      const singleData = data as SingleProductFormData;
      return singleData.live_time.trim() !== '' && 
             singleData.anchor_name.trim() !== '';
    } else if (activeTab === '嘉宾互动') {
      const guestData = data as GuestInteractionFormData;
      return guestData.live_time.trim() !== '' && 
             guestData.anchor_name.trim() !== '' &&
             guestData.guests.trim() !== '';
    } else if (activeTab === '商品卖点') {
      const sellingData = data as ProductSellingPointFormData;
      return sellingData.retail_price.trim() !== '';
    }

    return false;
  }, [activeTab, isProductListValid]);

  // 处理产品列表数据变化
  const handleProductsChange = useCallback((products: Array<{id: string, product_id: string, product_name: string, product_price: string, product_spec: string, sellpoint: string}>) => {
    // 拼接产品数据
    const joinedData = {
      product_id: products.map(p => p.product_id).filter(id => id.trim() !== '').join(';'),
      product_name: products.map(p => p.product_name).filter(name => name.trim() !== '').join(';'),
      product_price: products.map(p => p.product_price).filter(price => price.trim() !== '').join(';'),
      product_spec: products.map(p => p.product_spec).filter(spec => spec.trim() !== '').join(';'),
      sellpoint: products.map(p => p.sellpoint).filter(point => point.trim() !== '').join(';')
    };

    // 更新表单数据
    if (activeTab === '单人推品') {
      setSingleProductData(prev => ({ ...prev, ...joinedData }));
    } else if (activeTab === '嘉宾互动') {
      setGuestInteractionData(prev => ({ ...prev, ...joinedData }));
    } else if (activeTab === '商品卖点') {
      setSellingPointData(prev => ({ ...prev, ...joinedData }));
    }
  }, [activeTab]);

  // 使用useCallback优化性能
  const handleDataChange = useCallback((data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData) => {
    onDataChange?.(data);
    
    // 验证数据并通知父组件
    const isValid = validateRequiredFields(data);
    onValidationChange?.(isValid);
  }, [onDataChange, onValidationChange, validateRequiredFields]);

  // 使用useEffect来批量更新，减少频繁调用
  useEffect(() => {
    if (activeTab === '单人推品') {
      handleDataChange(singleProductData);
    } else if (activeTab === '嘉宾互动') {
      handleDataChange(guestInteractionData);
    } else if (activeTab === '商品卖点') {
      handleDataChange(sellingPointData);
    }
  }, [activeTab, singleProductData, guestInteractionData, sellingPointData, handleDataChange]);

  // 处理triggerValidation
  useEffect(() => {
    if (triggerValidation) {
      const currentData = activeTab === '单人推品' ? singleProductData : 
                         activeTab === '嘉宾互动' ? guestInteractionData : 
                         sellingPointData;
      const isValid = validateRequiredFields(currentData);
      onValidationChange?.(isValid);
    }
  }, [triggerValidation, activeTab, singleProductData, guestInteractionData, sellingPointData, validateRequiredFields, onValidationChange]);

  const handleInputChange = useCallback((field: string, value: string) => {
    if (activeTab === '单人推品') {
      setSingleProductData(prev => ({ ...prev, [field]: value }));
    } else if (activeTab === '嘉宾互动') {
      setGuestInteractionData(prev => ({ ...prev, [field]: value }));
    } else if (activeTab === '商品卖点') {
      setSellingPointData(prev => ({ ...prev, [field]: value }));
    }
  }, [activeTab]);

    // 渲染必填产品基础信息
  const renderRequiredProductFields = () => {
    return (
      <ProductList
        ref={productListRef}
        onProductsChange={handleProductsChange}
        onValidationChange={setIsProductListValid}
        onBrandInfoUpdate={handleBrandInfoUpdate}
      />
    );
  };

  // 渲染直播信息（单人推品和嘉宾互动）
  const renderLiveInfo = () => {
    if (activeTab === '商品卖点') return null;

    const currentData = activeTab === '单人推品' ? singleProductData : guestInteractionData;

    return (
      <div className="bg-white border-2 border-cyan-500 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-cyan-700 mb-4 flex items-center">
          <Video className="w-5 h-5 text-cyan-600 mr-3" />
          直播信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              直播时间 <span className="text-red-500">*</span>
            </label>
            <Calendar24
              value={currentData.live_time}
              onValueChange={(value) => handleInputChange('live_time', value)}
              placeholder="选择直播时间"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主持人名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={currentData.anchor_name}
              onChange={(e) => handleInputChange('anchor_name', e.target.value)}
              placeholder="请输入主持人名称"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200"
            />
          </div>
          {activeTab === '嘉宾互动' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                明星嘉宾信息 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={(guestInteractionData as GuestInteractionFormData).guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
                placeholder="请输入明星嘉宾信息，如：杨幂、迪丽热巴"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200"
              />
            </div>
          )}
          <div className={activeTab === '嘉宾互动' ? '' : 'md:col-span-2'}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              品牌信息
            </label>
            <textarea
              value={currentData.brand_name}
              onChange={(e) => handleInputChange('brand_name', e.target.value)}
              placeholder="请输入品牌信息，如：兰蔻1935年诞生于法国，作为全球知名的高端化妆品品牌..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              直播主题
            </label>
            <input
              type="text"
              value={currentData.live_topic}
              onChange={(e) => handleInputChange('live_topic', e.target.value)}
              placeholder="请输入直播主题，如：冬季护肤好搭子"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              直播类型
            </label>
            <Select value={currentData.live_type} onValueChange={(value) => handleInputChange('live_type', value)}>
              <SelectTrigger className="bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 h-[42px] px-3 py-2.5 border border-gray-300 rounded-lg hover:border-cyan-400 transition-all duration-200">
                <SelectValue placeholder="选择直播类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="大促推品">大促推品</SelectItem>
                <SelectItem value="新品发布">新品发布</SelectItem>
                <SelectItem value="日常推广">日常推广</SelectItem>
                <SelectItem value="专场直播">专场直播</SelectItem>
                <SelectItem value="爆款返场">爆款返场</SelectItem>
                <SelectItem value="清仓特卖">清仓特卖</SelectItem>
                <SelectItem value="工厂溯源">工厂溯源</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              直播环节
            </label>
            <textarea
              value={currentData.sessions}
              onChange={(e) => handleInputChange('sessions', e.target.value)}
              placeholder="请输入直播环节设计，如：1.开场福利红包、2.产品介绍 3.实验演绎 4.互动环节 5.结尾"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              道具
            </label>
            <input
              type="text"
              value={currentData.props}
              onChange={(e) => handleInputChange('props', e.target.value)}
              placeholder="请输入道具清单，如：产品样品、玻璃杯、kt板"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户画像
            </label>
            <input
              type="text"
              value={currentData.user_portrait}
              onChange={(e) => handleInputChange('user_portrait', e.target.value)}
              placeholder="请输入目标用户画像，如：25-35岁女性，注重护肤"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400 transition-all duration-200"
            />
          </div>
        </div>
      </div>
    );
  };

  // 渲染价格信息（商品卖点）
  const renderPriceInfo = () => {
    if (activeTab !== '商品卖点') return null;

    return (
      <div className="bg-white border-2 border-orange-400 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
          <Info className="w-5 h-5 text-orange-600 mr-3" />
          其他信息
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              市场价 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={sellingPointData.retail_price}
              onChange={(e) => handleInputChange('retail_price', e.target.value)}
              placeholder="请输入市场价"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              折扣
            </label>
            <input
              type="text"
              value={sellingPointData.discount}
              onChange={(e) => handleInputChange('discount', e.target.value)}
              placeholder="请输入折扣信息，如：叠平台199-35券+单品3元券"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              优惠机制
            </label>
            <input
              type="text"
              value={sellingPointData.mechanism}
              onChange={(e) => handleInputChange('mechanism', e.target.value)}
              placeholder="请输入优惠机制，如：详情页领券"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              物流信息
            </label>
            <input
              type="text"
              value={sellingPointData.logistics}
              onChange={(e) => handleInputChange('logistics', e.target.value)}
              placeholder="请输入物流信息，如：顺丰包邮，48小时发货"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生产日期
            </label>
            <input
              type="text"
              value={sellingPointData.pr_date}
              onChange={(e) => handleInputChange('pr_date', e.target.value)}
              placeholder="请输入生产日期，如：2024-01-15"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              品牌信息
            </label>
            <textarea
              value={sellingPointData.brand_info}
              onChange={(e) => handleInputChange('brand_info', e.target.value)}
              placeholder="请输入品牌信息，如：兰蔻1935年诞生于法国，作为全球知名的高端化妆品品牌..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              展示方式
            </label>
            <input
              type="text"
              value={sellingPointData.display}
              onChange={(e) => handleInputChange('display', e.target.value)}
              placeholder="请输入展示方式，如：真人试用、实验对比"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              介绍
            </label>
            <textarea
              value={sellingPointData.intro}
              onChange={(e) => handleInputChange('intro', e.target.value)}
              placeholder="请输入产品介绍，如：这款精华液含有玻尿酸成分，能够深层补水保湿"
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-orange-400 transition-all duration-200 resize-none"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen py-8">
      <div className="w-full max-w-6xl space-y-6">
      {/* 标题和描述 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            {activeTab === '单人推品' && <Speech className="w-6 h-6 text-white" />}
            {activeTab === '嘉宾互动' && <Drum className="w-6 h-6 text-white" />}
            {activeTab === '商品卖点' && <ShoppingCart className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {activeTab === '单人推品' && '单人推品脚本信息'}
              {activeTab === '嘉宾互动' && '嘉宾互动脚本信息'}
              {activeTab === '商品卖点' && '商品卖点脚本信息'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === '单人推品' && '请填写单人推品脚本生成所需的信息，带*的为必填项，填写选填信息可以提升大模型生成脚本的准确性😊'}
              {activeTab === '嘉宾互动' && '请填写嘉宾互动脚本生成所需的信息，带*的为必填项，填写选填信息可以提升大模型生成脚本的准确性😊'}
              {activeTab === '商品卖点' && '请填写商品卖点脚本生成所需的信息，带*的为必填项，填写选填信息可以提升大模型生成脚本的准确性😊'}
            </p>
          </div>
        </div>

        {/* 产品信息 */}
        <div className="mb-8">
          {renderRequiredProductFields()}
        </div>

        {/* 直播信息 */}
        <div className="mb-8">
          {renderLiveInfo()}
        </div>

        {/* 价格信息 */}
        <div>
          {renderPriceInfo()}
        </div>
      </div>
      </div>
    </div>
  );
}