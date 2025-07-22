import { useState, useCallback } from 'react'
import TopSelector from './components/TopSelector'
import ProgressIndicator from './components/ProgressIndicator'
import RequiredInfoForm from './components/RequiredInfoForm'
import GenerateButton from './components/GenerateButton'
import ExcelPreviewModal from './components/ExcelPreviewModal'
import ScriptPreview from './components/ScriptPreview'
import FileGenerationStatus from './components/FileGenerationStatus'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useFileGeneration } from './hooks/useFileGeneration'
import { useFormValidation } from './hooks/useFormValidation'
import { Toaster } from 'sonner'
import type { ScriptType } from './types'

function App() {
  const [activeTab, setActiveTab] = useState<ScriptType>('单人推品')
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

  // 使用文件生成相关的 hook
  const {
    generateFile,
    resetFileGeneration,
    getStateForTab,
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
    // 当表单数据变化时，只在用户主动修改表单内容时重置当前tab的生成状态
    if (data) {
      const currentTabState = getStateForTab(activeTab);
      if (currentTabState.fileGenerationStatus === 'completed') {
        // 只有在用户主动修改关键字段时才重置，避免切换脚本类型时重置
        // 这里可以根据具体需求调整逻辑，暂时注释掉自动重置
        // resetFileGeneration(activeTab);
      }
    }
  })

  // 获取当前tab的状态
  const currentTabState = getStateForTab(activeTab);
  const isScriptGenerated = currentTabState.fileGenerationStatus === 'completed';

  const handleTabChange = useCallback((tab: ScriptType) => {
    setActiveTab(tab)
    setTriggerValidation(false)
    resetForm()
    // 不再调用 resetFileGeneration()，保持各tab的独立状态
  }, [resetForm])

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

      {/* 主体内容 - 左右布局 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-6 h-[calc(100vh-120px)]">
            {/* 左侧：脚本类型选择 + 表单 + 生成按钮 */}
            <div className="flex-[3] max-w-4xl">
              <ScrollArea className="h-full">
                {/* 脚本类型选择 */}
                <div>
                  <TopSelector activeTab={activeTab} onTabChange={handleTabChange} />
                </div>

                {/* 必填信息表单 */}
                <div>
                  <RequiredInfoForm
                    activeTab={activeTab}
                    isGeneratingScript={currentTabState.isGenerating}
                    onDataChange={handleDataChange}
                    onValidationChange={handleValidationChange}
                    triggerValidation={triggerValidation}
                  />
                </div>

                {/* 生成按钮 */}
                <div className="flex justify-center">
                  <GenerateButton 
                    onGenerate={handleGenerate}
                    isLoading={currentTabState.isGenerating}
                    isFormValid={isFormValid}
                    formData={formData}
                  />
                </div>
              </ScrollArea>
            </div>

            {/* 右侧：脚本展示区域 */}
            <div className="flex-[2] max-w-lg h-full">
              <ScriptPreview
                activeTab={activeTab}
                isGenerating={currentTabState.isGenerating}
                fileGenerationStatus={currentTabState.fileGenerationStatus}
                generatedFileName={currentTabState.generatedFileName}
                generatedFileUrl={currentTabState.generatedFileUrl}
                onRetry={handleRetry}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权信息 */}
      <footer className="text-center py-4">
        <p className="text-gray-500 text-sm">
          Powered by 自营技术-消费技术-直播 & AI应用
        </p>
      </footer>
      
      {/* Excel预览Modal */}
      <ExcelPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        fileUrl={currentTabState.generatedFileUrl}
        fileName={currentTabState.generatedFileName}
      />
      
      {/* Toast 通知组件 */}
      <Toaster />
    </div>
  )
}

export default App