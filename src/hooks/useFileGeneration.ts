import { useState, useCallback } from 'react';
import { submitLiveScriptTask, pollOSSFiles } from '../services/api';
import type { ScriptType, SingleProductFormData, GuestInteractionFormData, ProductSellingPointFormData, APIRequestData } from '../types';

export type FileGenerationStatus = 'idle' | 'generating' | 'completed' | 'failed';

export interface UseFileGenerationReturn {
  isGenerating: boolean;
  fileGenerationStatus: FileGenerationStatus;
  generatedFileName: string;
  generatedFileUrl: string;
  pollProgress: { attempt: number; maxAttempts: number };
  generateFile: (
    formData: SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData | null,
    activeTab: ScriptType
  ) => Promise<void>;
  resetFileGeneration: () => void;
}

export const useFileGeneration = (): UseFileGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileGenerationStatus, setFileGenerationStatus] = useState<FileGenerationStatus>('idle');
  const [generatedFileName, setGeneratedFileName] = useState<string>('');
  const [generatedFileUrl, setGeneratedFileUrl] = useState<string>('');
  const [pollProgress, setPollProgress] = useState({ attempt: 0, maxAttempts: 60 });

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
      alert('表单数据为空');
      return;
    }

    setIsGenerating(true);
    
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
      
      setGeneratedFileName(fileName);
      
      // 参数校验
      if (!requestData.script_type || !requestData.product_name) {
        console.error('参数缺失: script_type 或 product_name');
        alert('参数缺失: script_type 或 product_name');
        setIsGenerating(false);
        return;
      }
      
      // 提交脚本生成任务（不等待响应）
      const submitResult = await submitLiveScriptTask(requestData);
      console.log('任务提交结果:', submitResult);
      
      if (submitResult.success) {
        alert('脚本生成任务已提交! 开始查询OSS文件...');
        
        // 设置生成状态
        setFileGenerationStatus('generating');
        
        // 开始轮询OSS文件
        setPollProgress({ attempt: 0, maxAttempts: 60 });
        
        try {
          const ossResult = await pollOSSFiles(
            fileName,
            (attempt, maxAttempts) => {
              setPollProgress({ attempt, maxAttempts });
              console.log(`OSS轮询进度: ${attempt}/${maxAttempts}`);
            },
            20,
            30000
          );
          
          if (ossResult.status === 'success' && ossResult.files_exist) {
            alert('OSS文件已生成完成!');
            setFileGenerationStatus('completed');
            if (ossResult.files && ossResult.files.length > 0) {
              setGeneratedFileUrl(ossResult.files[0].oss_url);
            }
          } else {
            alert('OSS文件生成超时或失败');
            setFileGenerationStatus('failed');
          }
        } catch (ossError) {
          console.error('OSS轮询失败:', ossError);
          setFileGenerationStatus('failed');
          alert('OSS文件查询失败');
        }
      } else {
        alert(`任务提交失败: ${submitResult.message || '未知错误'}`);
        setFileGenerationStatus('failed');
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败，请重试');
      setFileGenerationStatus('failed');
    } finally {
      setIsGenerating(false);
    }
  }, [generateFileName]);

  const resetFileGeneration = useCallback(() => {
    setFileGenerationStatus('idle');
    setGeneratedFileName('');
    setGeneratedFileUrl('');
    setPollProgress({ attempt: 0, maxAttempts: 60 });
  }, []);

  return {
    isGenerating,
    fileGenerationStatus,
    generatedFileName,
    generatedFileUrl,
    pollProgress,
    generateFile,
    resetFileGeneration,
  };
};