import { useState } from 'react'
import TopSelector from './components/TopSelector'
import ProgressIndicator from './components/ProgressIndicator'
import AITemplateRecommendation from './components/AITemplateRecommendation'
import RequiredInfoForm from './components/RequiredInfoForm'
import GenerateButton from './components/GenerateButton'
import type { FormData } from './types'

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

function App() {
  const [activeTab, setActiveTab] = useState('单人商品讲解')
  const [templateType, setTemplateType] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
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
  ])
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
    marketPosition: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value
    }))
    
    // 自动更新步骤进度
    if (templateType && Object.values(formData).some((val: string) => val.trim() !== '')) {
      setCurrentStep(2)
    }
  }

  const handleProductChange = (productId: string, field: string, value: string) => {
    setProducts(prev => prev.map(product => 
      product.id === productId 
        ? { ...product, [field]: value }
        : product
    ))
  }

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
    }
    setProducts(prev => [...prev, newProduct])
  }

  const handleRemoveProduct = (productId: string) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(product => product.id !== productId))
    }
  }

  const handleTemplateChange = (value: string) => {
    setTemplateType(value)
    if (value) {
      setCurrentStep(2)
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setCurrentStep(3)
    
    // 模拟API调用
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      // 这里可以添加实际的API调用逻辑
      console.log('生成脚本:', { activeTab, templateType, formData })
    } catch (error) {
      console.error('生成失败:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 进度指示器 */}
      <ProgressIndicator currentStep={currentStep} />
      
      {/* 顶部选项卡 */}
      <TopSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 主体内容 - 居中对齐 */}
      <div className="flex justify-center">
        <div className="max-w-4xl w-full px-6 py-8 ml-32">
          {/* AI模版推荐 - 上方 */}
          <div className="mb-8">
            <AITemplateRecommendation 
              templateType={templateType}
              onTemplateChange={handleTemplateChange}
            />
          </div>

          {/* 必填信息表单 - 下方 */}
          <div className="mb-8">
            <RequiredInfoForm
              activeTab={activeTab}
              formData={formData}
              products={products}
              onInputChange={handleInputChange}
              onProductChange={handleProductChange}
              onAddProduct={handleAddProduct}
              onRemoveProduct={handleRemoveProduct}
            />
          </div>

          {/* 生成按钮 */}
          <GenerateButton 
            onGenerate={handleGenerate}
            isLoading={isGenerating}
          />
        </div>
      </div>
    </div>
  )
}

export default App
