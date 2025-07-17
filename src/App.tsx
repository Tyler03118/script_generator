import { useState, useCallback, useRef } from 'react'
import TopSelector from './components/TopSelector'
import ProgressIndicator from './components/ProgressIndicator'
import RequiredInfoForm from './components/RequiredInfoForm'
import GenerateButton from './components/GenerateButton'
import type { ScriptType, SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData, APIRequestData } from './types'
import { generateLiveScript } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState<ScriptType>('单人推品')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isScriptGenerated, setIsScriptGenerated] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [triggerValidation, setTriggerValidation] = useState(false)
  
  // 当前表单数据
  const [formData, setFormData] = useState<SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null>(null)
  
  // 使用ref来避免循环依赖
  const lastFormDataRef = useRef<string>('')
  const lastValidationRef = useRef<boolean>(false)

  const handleDataChange = useCallback((data: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData) => {
    const dataString = JSON.stringify(data)
    
    // 只有当数据真正改变时才更新状态
    if (dataString !== lastFormDataRef.current) {
      lastFormDataRef.current = dataString
      setFormData(data)
      
      // 切换脚本类型时重置生成状态
      if (isScriptGenerated) {
        setIsScriptGenerated(false)
      }
    }
  }, [isScriptGenerated])

  const handleValidationChange = useCallback((isValid: boolean) => {
    // 只有当验证状态真正改变时才更新
    if (isValid !== lastValidationRef.current) {
      lastValidationRef.current = isValid
      setIsFormValid(isValid)
    }
  }, [])

  const handleTabChange = useCallback((tab: ScriptType) => {
    setActiveTab(tab)
    setFormData(null) // 切换类型时清空表单数据
    setIsScriptGenerated(false) // 重置生成状态
    setIsFormValid(false) // 重置验证状态
    setTriggerValidation(false) // 重置触发验证状态
    
    // 重置ref
    lastFormDataRef.current = ''
    lastValidationRef.current = false
  }, [])

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    try {
      // 构建API请求数据
      const requestData: APIRequestData = {
        script_type: activeTab,
        ...formData
      }
      // 参数校验
      if (!requestData.script_type || !requestData.product_name) {
        console.error('参数缺失: script_type 或 product_name');
        alert('参数缺失: script_type 或 product_name');
        setIsGenerating(false);
        return;
      }
      // 调用API并打印所有流式response
      await generateLiveScript(requestData, (response) => {
        console.log('API流式响应:', response);
      });
      setIsScriptGenerated(true)
    } catch (error) {
      console.error('生成失败:', error)
      alert('生成失败，请重试')
    } finally {
      setIsGenerating(false)
    }
  }, [formData, activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 进度指示器 */}
      <ProgressIndicator 
        isFormComplete={isFormValid}
        isScriptGenerated={isScriptGenerated}
      />
      
      {/* 顶部选项卡 */}
      <TopSelector activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主体内容 - 恢复左侧边距 */}
      <div className="container mx-auto px-4 py-8 ml-32">
        <div className="max-w-6xl mx-auto">
          {/* 必填信息表单 */}
          <div className="mb-12">
            <RequiredInfoForm
              activeTab={activeTab}
              onDataChange={handleDataChange}
              onValidationChange={handleValidationChange}
              triggerValidation={triggerValidation}
            />
          </div>

          {/* 生成按钮 */}
          <div className="flex justify-center">
            <GenerateButton 
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              isFormValid={isFormValid}
              formData={formData}
            />
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <footer className="text-center py-6 mt-4">
        <p className="text-gray-500 text-sm">
          Powered by 自营技术-消费技术-直播 & AI应用
        </p>
      </footer>
    </div>
  )
}

export default App
