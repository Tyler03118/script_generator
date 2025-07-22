import FileGenerationStatus from './FileGenerationStatus';
import type { FileGenerationStatus as StatusType } from '../types';
import { Lightbulb } from 'lucide-react';

interface ScriptPreviewProps {
  activeTab: string;
  isGenerating: boolean;
  fileGenerationStatus: StatusType;
  generatedFileName: string;
  generatedFileUrl: string;
  onRetry: () => void;
}

export default function ScriptPreview({
  activeTab,
  isGenerating,
  fileGenerationStatus,
  generatedFileName,
  generatedFileUrl,
  onRetry
}: ScriptPreviewProps) {
  return (
    <div className="sticky top-8">
      {/* 脚本展示区域 */}
      <div className="bg-white rounded-lg shadow-sm border h-[calc(100vh-120px)]">
        {/* 标题栏 */}
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Lightbulb className='text-green-500 mr-2'/>
            {activeTab}脚本
          </h2>
        </div>

        {/* 内容区域 */}
        <div className="p-6">
          {(isGenerating || fileGenerationStatus === 'completed' || fileGenerationStatus === 'failed') ? (
            <FileGenerationStatus
              status={fileGenerationStatus}
              fileName={generatedFileName}
              fileUrl={generatedFileUrl}
              onRetry={onRetry}
            />
          ) : (
            <div className="text-center text-gray-400 py-20">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">您还未生成脚本</p>
              <p className="text-sm text-gray-500">
                请选择商品及直播相关设置项，我们将为您生成对应的脚本内容
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}