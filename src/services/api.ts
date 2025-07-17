import type { APIRequestData } from '../types';

// API配置
const API_CONFIG = {
  baseUrl: '/pyinfer_tao_pre/api/v1/inference/stream',
  appId: 51143,
  bizCode: 'live_script_demo',
  timeout: 900000, // 15分钟
};

// 响应类型定义
export interface APIResponse {
  status: 'success' | 'error' | 'progress';
  message?: string;
  step?: string;
  progress?: number;
  script?: string;
  script_type?: string;
  product_name?: string;
  live_duration?: string;
  anchor_name?: string;
  oss_info?: {
    oss_upload_success: boolean;
    oss_upload_error?: string;
    files: Array<{
      type: string;
      filename: string;
      oss_url: string;
      oss_path: string;
    }>;
  };
  workflow_steps?: {
    info_search_completed: boolean;
    script_generated: boolean;
    content_moderated: boolean;
    excel_exported: boolean;
    markdown_exported: boolean;
    oss_uploaded: boolean;
  };
  excel_info?: {
    excel_generated: boolean;
    excel_filename?: string;
    excel_file_path?: string;
    excel_content_base64?: string;
    excel_error?: string;
    excel_disabled?: boolean;
  };
  error?: string;
  warning?: string;
}

// 流式响应回调类型
export type StreamCallback = (response: APIResponse) => void;

/**
 * 调用直播脚本生成API（流式）
 * @param requestData 请求数据
 * @param onStream 流式响应回调
 */
export async function generateLiveScript(
  requestData: APIRequestData,
  onStream: StreamCallback
): Promise<void> {
  try {
    const requestBody = {
      appId: API_CONFIG.appId,
      bizCode: API_CONFIG.bizCode,
      config: { requestTimeoutMs: API_CONFIG.timeout },
      request: requestData,
    };

    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      // 增加超时设置
      signal: AbortSignal.timeout(300000), // 5分钟超时
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应流');
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      console.log('收到原始数据:', buffer); // 调试信息
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            // 清理可能的SSE前缀
            let cleanLine = line.trim();
            if (cleanLine.startsWith('data: ')) {
              cleanLine = cleanLine.substring(6);
            }
            
            const data = JSON.parse(cleanLine);
            onStream(data);
          } catch (e) {
            // 记录解析失败的原始数据，便于调试
            console.warn('解析响应数据失败:', line, e);
          }
        }
      }
    }
    
    // 处理剩余的buffer
    if (buffer.trim()) {
      try {
        let cleanBuffer = buffer.trim();
        if (cleanBuffer.startsWith('data: ')) {
          cleanBuffer = cleanBuffer.substring(6);
        }
        const data = JSON.parse(cleanBuffer);
        onStream(data);
      } catch (e) {
        console.warn('解析最终响应数据失败:', buffer, e);
      }
    }
  } catch (error) {
    console.error('API调用详细错误:', error);
    console.error('错误类型:', (error as any).constructor?.name || 'Unknown');
    console.error('错误消息:', (error as any).message || 'Unknown error');
    
    onStream({
      status: 'error',
      message: `请求失败: ${error instanceof Error ? error.message : '未知错误'}`,
      step: 'network_error',
    });
  }
}

/**
 * 非流式调用API（用于测试）
 * @param requestData 请求数据
 * @returns Promise<APIResponse>
 */
export async function generateLiveScriptSync(
  requestData: APIRequestData
): Promise<APIResponse> {
  return new Promise((resolve, reject) => {
    let finalResponse: APIResponse | null = null;
    generateLiveScript(requestData, (response) => {
      if (response.status === 'error') {
        reject(new Error(response.message || '未知错误'));
        return;
      }
      if (response.status === 'success') {
        finalResponse = response;
      }
      if (response.progress === 100 || response.status === 'success') {
        resolve(finalResponse || response);
      }
    }).catch(reject);
  });
} 