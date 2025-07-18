import React from 'react';
import { Download } from 'lucide-react';

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
    <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col items-center">
        
        {/* 生成中状态 */}
        {status === 'generating' && (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 mb-2">正在生成脚本文件，大概需要3-5分钟，请耐心等待...</p>
            <div className="text-sm text-gray-600">
              📄 生成文件名: {fileName}
            </div>
          </>
        )}

        {/* 生成完成状态 */}
        {status === 'completed' && fileUrl && (
          <>
            <p className="text-gray-600 mb-4">直播脚本生成完成😊</p>
            <div className="flex gap-4">
              {/* 暂时注释预览功能，因为CORS问题还没完全解决 */}
              {/* <button 
                onClick={onPreview}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                预览脚本
              </button> */}
              
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
            <div className="text-sm text-gray-600 mt-4">
              📄 文件名: {fileName}
            </div>
          </>
        )}

        {/* 生成失败状态 */}
        {status === 'failed' && (
          <>
            <p className="text-gray-600 mb-4">脚本文件生成失败</p>
            <button 
              onClick={onRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              重新生成
            </button>
            <div className="text-sm text-gray-600 mt-4">
              📄 文件名: {fileName}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileGenerationStatus;