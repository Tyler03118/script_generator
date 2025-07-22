import React from 'react';
import { Download, LaptopMinimalCheck, AlertCircle, Bot } from 'lucide-react';

interface FileGenerationStatusProps {
  status: 'idle' | 'generating' | 'completed' | 'failed';
  fileName: string;
  fileUrl: string;
  onRetry: () => void;
}

const FileGenerationStatus: React.FC<FileGenerationStatusProps> = ({
  status,
  fileName,
  fileUrl,
  onRetry
}) => {
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="flex flex-col items-center py-40">
      
      {/* 生成中状态 */}
      {status === 'generating' && (
        <>
          {/* 加载动画 */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-4"></div>
          
          <div className="text-center">
            <div className='flex items-center justify-center'>
              <Bot className='mr-2 text-blue-400'/>
              <div className="text-lg font-medium text-gray-800 ">
              正在生成直播脚本...
            </div>
            </div>
            <div className="text-sm text-gray-500 text-center max-w-md">
              <span className="text-xs">大概需要3-5分钟，请耐心等待...</span>
              
              <br />
              （生成文件名: {fileName}）
            </div>
          </div>
        </>
      )}

      {/* 生成完成状态 */}
      {status === 'completed' && (
        <>
          <div className='flex items-center justify-center mb-4'>
            <LaptopMinimalCheck className='h-7 w-7 text-green-500 mr-2'/>
            <p className="text-lg font-medium text-gray-800">直播脚本生成完成</p>
          </div>

          {/* 下载按钮 */}
          {fileUrl && (
            <div className="flex gap-4 mb-4">
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                下载查看
              </a>
            </div>
          )}

          <div className='flex-col text-center'>
            <div className="text-sm text-gray-500 mt-4">
              (文件名: {fileName})
            </div>
            <span className="text-sm text-gray-500 mt-4">（该链接只有72小时有效）</span>
          </div>
        </>
      )}

      {/* 生成失败状态 */}
      {status === 'failed' && (
        <>
          <div className='flex items-center justify-center mb-4'>
            <AlertCircle className='h-7 w-7 text-red-500 mr-2'/>
            <p className="text-lg font-medium text-gray-800">脚本文件生成失败</p>
          </div>
          
          <div className="text-sm text-red-600 mb-4 text-center max-w-md">
            生成过程中遇到错误，请重试
          </div>

          <button 
            onClick={onRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            重新生成
          </button>
          <div className="text-sm text-gray-500 mt-4">
            （文件名: {fileName}）
          </div>
        </>
      )}
    </div>
  );
};

export default FileGenerationStatus;