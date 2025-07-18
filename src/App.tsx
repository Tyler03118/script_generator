import { useState, useCallback } from 'react'
import TopSelector from './components/TopSelector'
import ProgressIndicator from './components/ProgressIndicator'
import RequiredInfoForm from './components/RequiredInfoForm'
import GenerateButton from './components/GenerateButton'
import ExcelPreviewModal from './components/ExcelPreviewModal'
import FileGenerationStatus from './components/FileGenerationStatus'
import { useFileGeneration } from './hooks/useFileGeneration'
import { useFormValidation } from './hooks/useFormValidation'
import type { ScriptType } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<ScriptType>('单人推品')
  const [isScriptGenerated, setIsScriptGenerated] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  // 使用文件生成相关的 hook
  const {
    isGenerating,
    fileGenerationStatus,
    generatedFileName,
    generatedFileUrl,
    generateFile,
    resetFileGeneration,
  } = useFileGeneration()

  // 使用表单验证相关的 hook
  const {
    formData,
    isFormValid,
    triggerValidation,
    handleDataChange,
    handleValidationChange,
    setTriggerValidation,
    resetForm,
  } = useFormValidation((data) => {
    // 当表单数据变化时，重置生成状态
    if (data && isScriptGenerated) {
      setIsScriptGenerated(false)
      resetFileGeneration()
    }
  })

  const handleTabChange = useCallback((tab: ScriptType) => {
    setActiveTab(tab)
    setIsScriptGenerated(false)
    setTriggerValidation(false)
    resetForm()
    resetFileGeneration()
  }, [resetForm, resetFileGeneration])

  const handleGenerate = useCallback(async () => {
    await generateFile(formData, activeTab)
  }, [generateFile, formData, activeTab])


  const handleRetry = useCallback(() => {
    handleGenerate()
  }, [handleGenerate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 进度指示器 */}
      <ProgressIndicator 
        isFormComplete={isFormValid}
        isScriptGenerated={isScriptGenerated}
      />
      
      {/* 顶部选项卡 */}
      <TopSelector activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主体内容 */}
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
          <div className="flex justify-center mb-8">
            <GenerateButton 
              onGenerate={handleGenerate}
              isLoading={isGenerating}
              isFormValid={isFormValid}
              formData={formData}
            />
          </div>

          {/* 文件生成状态显示 */}
          <FileGenerationStatus
            status={fileGenerationStatus}
            fileName={generatedFileName}
            fileUrl={generatedFileUrl}
            onRetry={handleRetry}
          />

          {/* Excel预览Modal */}
          <ExcelPreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            fileUrl={generatedFileUrl}
            fileName={generatedFileName}
          />
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