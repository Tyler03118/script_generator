import { useState, useCallback } from 'react';
import { submitLiveScriptTask, pollOSSFiles } from '../services/api';
import type { ScriptType, SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData, APIRequestData } from '../types';

export type FileGenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';

// 单个tab的状态接口
export interface TabGenerationState {
  isGenerating: boolean;
  fileGenerationStatus: FileGenerationStatus;
  generatedFileName: string;
  generatedFileUrl: string;
  pollProgress: { attempt: number; maxAttempts: number };
}

export interface UseFileGenerationReturn {
  generateFile: (
    formData: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null,
    activeTab: ScriptType
  ) => Promise<void>;
  resetFileGeneration: (scriptType: ScriptType) => void;
  getStateForTab: (scriptType: ScriptType) => TabGenerationState;
}

// 默认状态
const getDefaultState = (): TabGenerationState => ({
  isGenerating: false,
  fileGenerationStatus: 'idle',
  generatedFileName: '',
  generatedFileUrl: '',
  pollProgress: { attempt: 0, maxAttempts: 60 },
});

export const useFileGeneration = (): UseFileGenerationReturn => {
  // 使用Map来存储每个scriptType的独立状态
  const [tabStates, setTabStates] = useState<Map<ScriptType, TabGenerationState>>(new Map());

  // 获取特定tab的状态
  const getStateForTab = useCallback((scriptType: ScriptType): TabGenerationState => {
    return tabStates.get(scriptType) || getDefaultState();
  }, [tabStates]);

  // 更新特定tab的状态
  const updateTabState = useCallback((scriptType: ScriptType, updates: Partial<TabGenerationState>) => {
    setTabStates(prev => {
      const newMap = new Map(prev);
      const currentState = newMap.get(scriptType) || getDefaultState();
      newMap.set(scriptType, { ...currentState, ...updates });
      return newMap;
    });
  }, []);

  const generateFileName = useCallback((productName: string, activeTab: ScriptType): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const generateTime = `${year}${month}${day}_${hours}${minutes}${seconds}`;
    
    const productNamePrefix = productName.slice(0, 10);
    const cleanProductName = productNamePrefix
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/[,，]/g, '_')
      .replace(/\s+/g, '_');
    
    const isProductSellingPoint = activeTab === '商品卖点';
    const baseFileName = `AI生成_${cleanProductName}_${generateTime}`;
    
    return isProductSellingPoint ? `${baseFileName}.md` : `${baseFileName}.xlsx`;
  }, []);

  const generateFile = useCallback(async (
    formData: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null,
    activeTab: ScriptType
  ) => {
    if (!formData) {
      console.error('表单数据为空');
      return;
    }

    // 更新当前tab的生成状态
    updateTabState(activeTab, { isGenerating: true });
    
    try {
      const productName = formData.product_name || 'unknown_product';
      const fileName = generateFileName(productName, activeTab);
      
      // 构建API请求数据
      const requestData: APIRequestData = {
        script_type: activeTab,
        ...formData
      };
      
      // 根据脚本类型添加相应的文件名参数
      if (activeTab === '商品卖点') {
        requestData.markdown_file_name = fileName;
      } else {
        requestData.excel_file_name = fileName;
      }
      
      updateTabState(activeTab, { generatedFileName: fileName });
      
      // 参数校验
      if (!requestData.script_type || !requestData.product_name) {
        console.error('参数缺失: script_type 或 product_name');
        alert('参数缺失: script_type 或 product_name');
        updateTabState(activeTab, { isGenerating: false });
        return;
      }
      
      // 提交脚本生成任务（不等待响应）
      const submitResult = await submitLiveScriptTask(requestData);
      console.log('任务提交结果:', submitResult);
      
      if (submitResult.success) {
        // 设置生成状态
        updateTabState(activeTab, { 
          fileGenerationStatus: 'generating',
          pollProgress: { attempt: 0, maxAttempts: 60 }
        });
        
        try {
          const ossResult = await pollOSSFiles(
            fileName,
            (attempt, maxAttempts) => {
              updateTabState(activeTab, { 
                pollProgress: { attempt, maxAttempts }
              });
              console.log(`OSS轮询进度 [${activeTab}]: ${attempt}/${maxAttempts}`);
            },
            20,
            30000
          );
          
          if (ossResult.status === 'success' && ossResult.files_exist) {
            updateTabState(activeTab, { 
              fileGenerationStatus: 'completed',
              generatedFileUrl: ossResult.files && ossResult.files.length > 0 ? ossResult.files[0].oss_url : ''
            });
          } else {
            updateTabState(activeTab, { fileGenerationStatus: 'failed' });
          }
        } catch (ossError) {
          console.error('OSS轮询失败:', ossError);
          updateTabState(activeTab, { fileGenerationStatus: 'failed' });
        }
      } else {
        updateTabState(activeTab, { fileGenerationStatus: 'failed' });
      }
    } catch (error) {
      console.error('生成失败:', error);
      updateTabState(activeTab, { fileGenerationStatus: 'failed' });
    } finally {
      updateTabState(activeTab, { isGenerating: false });
    }
  }, [generateFileName, updateTabState]);

  const resetFileGeneration = useCallback((scriptType: ScriptType) => {
    updateTabState(scriptType, getDefaultState());
  }, [updateTabState]);

  return {
    generateFile,
    resetFileGeneration,
    getStateForTab,
  };
};