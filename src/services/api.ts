import type { APIRequestData } from '../types';

// API配置
const API_CONFIG = {
  baseUrl: '/pyinfer_tao_pre/api/v1/inference/stream',
  appId: 51143, 
  bizCode: 'live_script_demo',
  timeout: 1800000, // 30分钟
};

// OSS查询响应类型
export interface OSSQueryResponse {
  status: 'success' | 'error';
  message?: string;
  files_exist: boolean;
  files?: Array<{
    type: string;
    filename: string;
    oss_url: string;
    oss_path: string;
  }>;
  error?: string;
}

// iGraph查询响应类型
export interface IGraphQueryResponse {
  status: 'success' | 'error' | 'progress';
  message?: string;
  item_id?: string;
  record_count?: number;
  data?: {
    原始数据?: {
      origin_file_path?: string;
      discount_price?: string;
      item_name?: string;
      label?: string;
      daily_price?: string;
      summary_selling_point?: string;
      brand_ext_info?: string;
      selling_points?: string;
      sale_gurantee?: string;
      show_desc?: string;
      link_item_id?: string;
      used_scene?: string;
      id?: string;
      link_item_type?: string;
    };
  };
  progress?: number;
  time_used?: number;
  error?: string;
}

/**
 * 异步提交直播脚本生成任务（不等待响应）
 * @param requestData 请求数据
 * @returns Promise<{success: boolean, message: string}>
 */
export async function submitLiveScriptTask(
  requestData: APIRequestData
): Promise<{success: boolean, message: string}> {
  try {
    const requestBody = {
      appId: API_CONFIG.appId,
      bizCode: API_CONFIG.bizCode,
      config: { requestTimeoutMs: API_CONFIG.timeout },
      request: {
        ...requestData,
        service_type: "live_script" // 添加service_type参数
      },
    };

    console.log('提交脚本生成任务:', requestBody);
    console.log('请求URL:', API_CONFIG.baseUrl);

    // 发送请求但不等待响应，立即返回成功
    fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then(response => {
      console.log('脚本生成任务提交响应状态:', response.status, response.statusText);
    }).catch(error => {
      console.error('脚本生成任务提交过程中发生错误（不影响流程）:', error);
    });

    return { success: true, message: '脚本生成任务已提交' };
  } catch (error) {
    console.error('提交任务失败:', error);
    throw error;
  }
}

/**
 * 查询OSS文件是否生成
 * @param fileName 要查询的文件名
 * @returns Promise<OSSQueryResponse>
 */
export async function queryOSSFiles(
  fileName: string
): Promise<OSSQueryResponse> {
  try {
    const requestBody = {
      appId: API_CONFIG.appId,
      bizCode: API_CONFIG.bizCode,
      config: { requestTimeoutMs: API_CONFIG.timeout },
      request: {
        service_type: "oss_query",
        name: fileName
      },
    };

    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(60000), // 60秒超时，因为可能是流式响应
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('查询OSS文件失败:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应流');
    
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult: OSSQueryResponse | null = null;
    let currentEvent = '';

    console.log('开始读取流式响应...');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // 处理可能的多行响应
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
          // 空行表示事件结束，重置event
          currentEvent = '';
          continue;
        }
        
        
        if (trimmedLine.startsWith('event:')) {
          // 处理事件类型
          currentEvent = trimmedLine.substring(6).trim();
          continue;
        }
        
        if (trimmedLine.startsWith('data:')) {
          const jsonStr = trimmedLine.substring(5).trim(); // 移除 'data:' 前缀
          
          // 处理不同的事件类型
          if (currentEvent === 'complete') {
            if (!finalResult && jsonStr === '[done]') {
              finalResult = {
                status: 'success',
                message: '搜索完成，未找到文件',
                files_exist: false
              };
            }
            continue;
          }
          
          // 跳过 [done] 标记
          if (jsonStr === '[done]') {
            continue;
          }
          
          try {
            const data = JSON.parse(jsonStr);
            
            // 检查响应数据结构
            if (data.success && data.data) {
              const responseData = data.data;
              
              if (responseData.status === 'success' && responseData.download_url) {
                // 找到文件，构造成功响应
                finalResult = {
                  status: 'success',
                  message: responseData.message || '文件已找到',
                  files_exist: true,
                  files: [{
                    type: fileName.endsWith('.xlsx') ? 'excel' : 'markdown',
                    filename: responseData.file_name || fileName,
                    oss_url: responseData.download_url,
                    oss_path: responseData.file_path || ''
                  }]
                };
                console.log('✅ 文件已找到!');
              } else if (responseData.status === 'not_found') {
                // 明确未找到文件
                finalResult = {
                  status: 'success',
                  message: responseData.message || '未找到文件',
                  files_exist: false
                };
              } else if (responseData.status === 'progress') {
                // 还在搜索中，继续等待
              }
            }
          } catch (e) {
            console.warn('解析OSS查询响应失败:', trimmedLine, e);
          }
        }
      }
    }
    
    // 处理剩余的buffer
    if (buffer.trim()) {
      const trimmedBuffer = buffer.trim();
      console.log('处理剩余buffer:', trimmedBuffer);
      if (trimmedBuffer.startsWith('data:')) {
        const jsonStr = trimmedBuffer.substring(5).trim();
        
        if (jsonStr !== '[done]') {
          try {
            const data = JSON.parse(jsonStr);
            console.log('OSS查询最终响应:', data);
            
            if (data.success && data.data) {
              if (data.data.status === 'success' && data.data.download_url) {
                finalResult = {
                  status: 'success',
                  message: data.data.message || '文件已找到',
                  files_exist: true,
                  files: [{
                    type: fileName.endsWith('.xlsx') ? 'excel' : 'markdown',
                    filename: data.data.file_name || fileName,
                    oss_url: data.data.download_url,
                    oss_path: data.data.file_path || ''
                  }]
                };
              } else if (data.data.status === 'not_found') {
                finalResult = {
                  status: 'success',
                  message: data.data.message || '未找到文件',
                  files_exist: false
                };
              }
            }
          } catch (e) {
            console.warn('解析最终OSS查询响应失败:', buffer, e);
          }
        }
      }
    }
    
    // 返回结果
    if (finalResult) {
      console.log('OSS查询最终结果:', finalResult);
      return finalResult;
    } else {
      // 没有找到文件，默认返回未找到状态
      console.log('没有找到最终结果，返回默认未找到状态');
      return {
        status: 'success',
        message: '搜索完成，未找到文件',
        files_exist: false
      };
    }
    
  } catch (error) {
    console.error('查询OSS文件失败:', error);
    
    // 如果是超时或网络错误，返回未找到的状态而不是抛出错误
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      return {
        status: 'success',
        message: '查询超时，文件可能还在生成中',
        files_exist: false
      };
    }
    
    throw error;
  }
}

/**
 * 查询iGraph商品信息
 * @param itemId 商品ID
 * @returns Promise<IGraphQueryResponse>
 */
export async function queryIGraphInfo(
  itemId: string
): Promise<IGraphQueryResponse> {
  try {
    const requestBody = {
      appId: API_CONFIG.appId,
      bizCode: API_CONFIG.bizCode,
      config: { requestTimeoutMs: API_CONFIG.timeout },
      request: {
        service_type: "igraph_query",
        item_id: itemId
      },
    };

    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(120000), // 2分钟超时
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('查询iGraph信息失败:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应流');
    
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult: IGraphQueryResponse | null = null;
    let currentEvent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // 处理可能的多行响应
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
          // 空行表示事件结束，重置event
          currentEvent = '';
          continue;
        }
        
        if (trimmedLine.startsWith('event:')) {
          // 处理事件类型
          currentEvent = trimmedLine.substring(6).trim();
          continue;
        }
        
        if (trimmedLine.startsWith('data:')) {
          const jsonStr = trimmedLine.substring(5).trim(); // 移除 'data:' 前缀
          
          // 处理不同的事件类型
          if (currentEvent === 'complete') {
            break;
          }
          
          try {
            const data = JSON.parse(jsonStr);
            
            // 检查响应数据结构
            if (data.success && data.data) {
              const responseData = data.data;
              
              if (responseData.status === 'success') {
                // 查询成功，构造成功响应
                finalResult = {
                  status: 'success',
                  message: responseData.message || '商品信息查询成功',
                  item_id: responseData.item_id,
                  record_count: responseData.record_count,
                  data: responseData.data,
                  progress: responseData.progress,
                  time_used: responseData.time_used
                };
                console.log('✅ 商品信息查询成功');
              } else if (responseData.status === 'progress') {
                // 查询进行中，更新进度状态
                finalResult = {
                  status: 'progress',
                  message: responseData.message,
                  item_id: responseData.item_id,
                  progress: responseData.progress,
                  time_used: responseData.time_used
                };
              } else if (responseData.status === 'error') {
                // 查询失败
                finalResult = {
                  status: 'error',
                  message: responseData.message || '商品信息查询失败',
                  item_id: responseData.item_id,
                  error: responseData.message
                };
              }
            }
          } catch (e) {
            console.warn('解析iGraph查询响应失败:', trimmedLine, e);
          }
        }
      }
    }
    
    // 处理剩余的buffer
    if (buffer.trim()) {
      const trimmedBuffer = buffer.trim();
      if (trimmedBuffer.startsWith('data:')) {
        const jsonStr = trimmedBuffer.substring(5).trim();
        
        try {
          const data = JSON.parse(jsonStr);
          
          if (data.success && data.data && data.data.status === 'success') {
            finalResult = {
              status: 'success',
              message: data.data.message || '商品信息查询成功',
              item_id: data.data.item_id,
              record_count: data.data.record_count,
              data: data.data.data,
              progress: data.data.progress,
              time_used: data.data.time_used
            };
          }
        } catch (e) {
          console.warn('解析最终iGraph查询响应失败:', buffer, e);
        }
      }
    }
    
    // 返回结果
    if (finalResult) {
      return finalResult;
    } else {
      // 没有找到结果，默认返回错误状态
      return {
        status: 'error',
        message: '商品信息查询失败，未获取到有效数据',
        item_id: itemId,
        error: 'no_data'
      };
    }
    
  } catch (error) {
    console.error('查询iGraph信息失败:', error);
    
    // 如果是超时或网络错误，返回错误状态
    if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('timeout'))) {
      return {
        status: 'error',
        message: '查询超时，请稍后重试',
        item_id: itemId,
        error: 'timeout'
      };
    }
    
    throw error;
  }
}

/**
 * 轮询查询OSS文件
 * @param fileName 要查询的文件名
 * @param onProgress 进度回调
 * @param maxAttempts 最大尝试次数（默认60次，即5分钟）
 * @param interval 轮询间隔（默认30秒）
 * @returns Promise<OSSQueryResponse>
 */
export async function pollOSSFiles(
  fileName: string,
  onProgress?: (attempt: number, maxAttempts: number, response: OSSQueryResponse) => void,
  maxAttempts: number = 20,
  interval: number = 30000
): Promise<OSSQueryResponse> {
  let attempt = 0;
  
  while (attempt < maxAttempts) {
    attempt++;
    
    try {
      const response = await queryOSSFiles(fileName);
      
      // 调用进度回调
      if (onProgress) {
        onProgress(attempt, maxAttempts, response);
      }
      
      // 如果文件已生成，返回结果
      if (response.status === 'success' && response.files_exist) {
        return response;
      }
      
      // 如果还有尝试次数，等待后继续
      if (attempt < maxAttempts) {
        console.log(`OSS文件未生成，等待${interval/1000}秒后重试... (${attempt}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } catch (error) {
      console.error(`轮询OSS文件失败 (尝试 ${attempt}/${maxAttempts}):`, error);
      
      // 如果是最后一次尝试，抛出错误
      if (attempt >= maxAttempts) {
        throw error;
      }
      
      // 否则等待后继续
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  // 超时，返回失败结果
  return {
    status: 'error',
    message: '轮询超时，OSS文件未生成',
    files_exist: false,
    error: 'timeout'
  };
}