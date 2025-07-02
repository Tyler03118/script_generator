import { useState } from 'react';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { FormData } from '../types'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Product {
  id: string;
  productId: string;
  brandName: string;
  liveTime: string;
  liveTheme: string;
  liveType: string;
  host: string;
  celebrity: string;
  productFeatures: string;
  competitorAnalysis: string;
  marketPosition: string;
  // 更多信息字段
  productName: string;
  productSpec: string;
  productPrice: string;
  productDiscount: string;
  liveSegmentDesign: string;
  materialProps: string;
  cpv: string;
  productSellingPoints: string;
  productDetailImages: string;
}

interface RequiredInfoFormProps {
  activeTab: string;
  onDataChange?: (data: { formData: FormData; products: Product[] }) => void;
}

export default function RequiredInfoForm({ 
  activeTab,
  onDataChange
}: RequiredInfoFormProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      productId: '',
      brandName: '',
      liveTime: '',
      liveTheme: '',
      liveType: '',
      host: '',
      celebrity: '',
      productFeatures: '',
      competitorAnalysis: '',
      marketPosition: '',
      // 更多信息字段
      productName: '',
      productSpec: '',
      productPrice: '',
      productDiscount: '',
      liveSegmentDesign: '',
      materialProps: '',
      cpv: '',
      productSellingPoints: '',
      productDetailImages: ''
    }
  ]);
  const [formData, setFormData] = useState<FormData>({
    productId: '',
    brandName: '',
    liveTime: '',
    liveTheme: '',
    liveType: '',
    host: '',
    celebrity: '',
    liveDate: '',
    hostName: '',
    liveTopicRight: '',
    liveTypeRight: '',
    targetAudience: '',
    productFeatures: '',
    competitorAnalysis: '',
    marketPosition: '',
    liveSegmentDesign: '',
    materialProps: ''
  });

  const handleInputChange = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    onDataChange?.({ formData: newFormData, products });
  };

  const handleProductChange = (productId: string, field: string, value: string) => {
    const newProducts = products.map(product => 
      product.id === productId 
        ? { ...product, [field]: value }
        : product
    );
    setProducts(newProducts);
    onDataChange?.({ formData, products: newProducts });
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      productId: '',
      brandName: '',
      liveTime: '',
      liveTheme: '',
      liveType: '',
      host: '',
      celebrity: '',
      productFeatures: '',
      competitorAnalysis: '',
      marketPosition: '',
      // 更多信息字段
      productName: '',
      productSpec: '',
      productPrice: '',
      productDiscount: '',
      liveSegmentDesign: '',
      materialProps: '',
      cpv: '',
      productSellingPoints: '',
      productDetailImages: ''
    };
    const newProducts = [...products, newProduct];
    setProducts(newProducts);
    onDataChange?.({ formData, products: newProducts });
  };

  const handleRemoveProduct = (productId: string) => {
    if (products.length > 1) {
      const newProducts = products.filter(product => product.id !== productId);
      setProducts(newProducts);
      onDataChange?.({ formData, products: newProducts });
    }
  };

  const toggleMoreInfo = (productId: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedProducts(newExpanded);
  };

  // Date picker component
  const DatePicker = ({ value, onValueChange, placeholder }: { 
    value: string, 
    onValueChange: (value: string) => void, 
    placeholder: string 
  }) => {
    const [date, setDate] = useState<Date | undefined>(
      value ? new Date(value) : undefined
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-white",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "yyyy/MM/dd") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              if (selectedDate) {
                onValueChange(format(selectedDate, "yyyy-MM-dd"));
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div>
      {/* 合并的产品信息和直播信息卡片 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#474747" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">必填信息</h2>
              <p className="text-sm text-gray-500 mt-1">以下信息为生成脚本必须填写的必要信息</p>
            </div>
          </div>
        </div>
        <div className={`flex flex-col gap-6 ${(activeTab === '明星互动脚本' || activeTab === '单人商品讲解') ? 'lg:flex-row lg:items-stretch' : ''}`}>
          
          {/* 产品信息部分 */}
          <div className={`${(activeTab === '明星互动脚本' || activeTab === '单人商品讲解') ? 'lg:w-3/5' : 'w-full'} flex flex-col`}>
            <div className="bg-green-50 rounded-xl p-6 flex-1 overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-medium text-green-600">产品信息</span>
                <button 
                  onClick={handleAddProduct}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium ml-auto transition-colors duration-200 cursor-pointer"
                >
                  + 添加产品
                </button>
              </div>
              
              {/* 产品列表容器 - 带滚动 */}
              <div className="flex-1 overflow-y-auto pr-2 pb-1" style={{ maxHeight: 'calc(100vh - 400px)', minHeight: '400px' }}>
                <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">产品{index + 1}</span>
                      </div>
                      {products.length > 1 && (
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors duration-200 cursor-pointer"
                        >
                          删除
                        </button>
                      )}
                    </div>
                    
                    {activeTab === '商品卖点收集' ? (
                      // 商品卖点收集的产品信息表单
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">产品名称 *</label>
                          <input
                            type="text"
                            placeholder="请输入产品名称"
                            value={product.brandName}
                            onChange={(e) => handleProductChange(product.id, 'brandName', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">产品特色功能 *</label>
                          <textarea
                            placeholder="请输入产品的核心功能和特色"
                            value={product.productFeatures}
                            onChange={(e) => handleProductChange(product.id, 'productFeatures', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">竞品分析 *</label>
                          <textarea
                            placeholder="请输入与竞品相比的优势"
                            value={product.competitorAnalysis}
                            onChange={(e) => handleProductChange(product.id, 'competitorAnalysis', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">市场定位 *</label>
                          <input
                            type="text"
                            placeholder="请输入产品市场定位"
                            value={product.marketPosition}
                            onChange={(e) => handleProductChange(product.id, 'marketPosition', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ) : (
                      // 明星互动脚本和单人商品讲解的产品信息表单
                      <div >
                        {/* 必填字段 */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium  text-green-600 mb-3 flex items-center">
                            必填信息
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">产品ID *</label>
                              <input
                                type="text"
                                placeholder="请输入产品ID"
                                value={product.productId}
                                onChange={(e) => handleProductChange(product.id, 'productId', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-gray-600 mb-2">产品价格 *</label>
                              <input
                                type="text"
                                placeholder="请输入产品价格"
                                value={product.productPrice || ''}
                                onChange={(e) => handleProductChange(product.id, 'productPrice', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm text-gray-600 mb-2">产品折扣 *</label>
                              <input
                                type="text"
                                placeholder="请输入产品折扣"
                                value={product.productDiscount || ''}
                                onChange={(e) => handleProductChange(product.id, 'productDiscount', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 选填字段 */}
                        <div>
                          <button 
                            onClick={() => toggleMoreInfo(product.id)}
                            className="flex items-center space-x-2 text-green-600 text-sm font-medium hover:text-green-700 transition-colors cursor-pointer mb-3"
                          >
                            <svg 
                              className={`w-4 h-4 transition-transform duration-200 ${expandedProducts.has(product.id) ? 'rotate-90' : ''}`}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className='text-gray-500'>
                              {expandedProducts.has(product.id) ? '收起选填信息' : '展开选填信息'}
                            </span>
                          </button>
                          
                          {expandedProducts.has(product.id) && (
                            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">产品卖点</label>
                                <textarea
                                  placeholder="请输入产品卖点"
                                  value={product.productSellingPoints || ''}
                                  onChange={(e) => handleProductChange(product.id, 'productSellingPoints', e.target.value)}
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">商详图片</label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    id={`upload-${product.id}`}
                                    onChange={(e) => {
                                      // 这里可以处理图片上传逻辑
                                      const files = Array.from(e.target.files || []);
                                      const fileNames = files.map(file => file.name).join(', ');
                                      handleProductChange(product.id, 'productDetailImages', fileNames);
                                    }}
                                  />
                                  <label
                                    htmlFor={`upload-${product.id}`}
                                    className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                                  >
                                    上传图片
                                  </label>
                                  <span className="text-sm text-gray-500">
                                    {product.productDetailImages || '未选择文件'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>

          {/* 直播信息部分 - 只有明星互动脚本和单人商品讲解有 */}
          {(activeTab === '明星互动脚本' || activeTab === '单人商品讲解') && (
            <div className="lg:w-2/5 flex flex-col">
              <div className="bg-sky-50  rounded-xl p-6 flex-1 overflow-hidden flex flex-col" style={{ minHeight: '400px' }}>
                <div className="flex items-center space-x-2 mb-6">
                  <span className="text-lg font-medium text-green-600">直播信息</span>
                </div>
                
                {/* 必填字段 */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-green-600 mb-3 flex items-center">
                    必填信息
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">直播时间 *</label>
                      <DatePicker
                        value={formData.liveDate}
                        onValueChange={(value) => handleInputChange('liveDate', value)}
                        placeholder="年/月/日"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">直播主题 *</label>
                      <input
                        type="text"
                        placeholder="请输入直播主题"
                        value={formData.liveTopicRight}
                        onChange={(e) => handleInputChange('liveTopicRight', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">直播类型 *</label>
                      <Select value={formData.liveTypeRight} onValueChange={(value) => handleInputChange('liveTypeRight', value)}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="请选择直播类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="商品直播">商品直播</SelectItem>
                          <SelectItem value="品牌宣传">品牌宣传</SelectItem>
                          <SelectItem value="新品发布">新品发布</SelectItem>
                          <SelectItem value="促销活动">促销活动</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">主持人 *</label>
                      <input
                        type="text"
                        placeholder="请输入主持人名称"
                        value={formData.hostName}
                        onChange={(e) => handleInputChange('hostName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    {activeTab === '明星互动脚本' && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">明星嘉宾 *</label>
                        <input
                          type="text"
                          placeholder="请输入明星嘉宾"
                          value={formData.celebrity}
                          onChange={(e) => handleInputChange('celebrity', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 选填字段 */}
                <div className="flex-1 overflow-y-auto">
                  <details className="group">
                    <summary className="flex items-center space-x-2 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors cursor-pointer list-none">
                      <svg 
                        className="w-4 h-4 transition-transform duration-200 group-open:rotate-90"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className='text-gray-500'>选填信息</span>
                    </summary>
                    
                    <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg space-y-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">直播环节设计</label>
                        <textarea
                          placeholder="请输入直播环节设计"
                          value={formData.liveSegmentDesign || ''}
                          onChange={(e) => handleInputChange('liveSegmentDesign', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">物料道具</label>
                        <textarea
                          placeholder="请输入物料道具"
                          value={formData.materialProps || ''}
                          onChange={(e) => handleInputChange('materialProps', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent h-24 resize-none"
                        />
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 