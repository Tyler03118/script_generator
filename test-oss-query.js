/**
 * 测试OSS文件查询API的脚本
 * 用于验证前端API调用是否能正确查询到OSS文件
 */

// 模拟前端的API配置
const API_CONFIG = {
  baseUrl: 'http://localhost:5173/pyinfer_tao_pre/api/v1/inference/stream',
  appId: 51143,
  bizCode: 'live_script_demo',
  timeout: 60000, // 60秒超时
};

/**
 * 查询OSS文件
 * @param {string} fileName 要查询的文件名
 * @returns {Promise<Object>} 查询结果
 */
async function queryOSSFiles(fileName) {
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

    console.log('发送OSS查询请求:', JSON.stringify(requestBody, null, 2));
    console.log('请求URL:', API_CONFIG.baseUrl);

    const response = await fetch(API_CONFIG.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(API_CONFIG.timeout),
    });

    console.log('\n响应状态:', response.status, response.statusText);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP错误响应:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应流');
    
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult = null;
    let currentEvent = '';

    console.log('\n开始读取流式响应...');

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
        
        console.log('收到原始行:', trimmedLine);
        
        if (trimmedLine.startsWith('event:')) {
          // 处理事件类型
          currentEvent = trimmedLine.substring(6).trim();
          console.log('SSE事件类型:', currentEvent);
          continue;
        }
        
        if (trimmedLine.startsWith('data:')) {
          const jsonStr = trimmedLine.substring(5).trim(); // 移除 'data:' 前缀
          
          // 处理不同的事件类型
          if (currentEvent === 'complete') {
            console.log('收到完成事件:', jsonStr);
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
            console.log('解析JSON成功:', JSON.stringify(data, null, 2));
            
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
                console.log('❌ 文件未找到');
              } else if (responseData.status === 'progress') {
                // 还在搜索中，继续等待
                console.log(`🔍 搜索进度: ${responseData.progress}% - ${responseData.message}`);
              }
            }
          } catch (e) {
            console.warn('解析JSON失败:', trimmedLine, e);
          }
        }
      }
    }
    
    // 处理剩余的buffer
    if (buffer.trim()) {
      console.log('处理剩余buffer:', buffer.trim());
      // ... 这里可以添加剩余buffer的处理逻辑
    }
    
    return finalResult || {
      status: 'success',
      message: '搜索完成，未找到文件',
      files_exist: false
    };
    
  } catch (error) {
    console.error('❌ OSS查询失败:', error);
    throw error;
  }
}

/**
 * 测试主函数
 */
async function testOSSQuery() {
  console.log('🚀 开始测试OSS文件查询API...\n');
  
  // 测试用例1: 查询存在的文件
  console.log('=== 测试用例1: 查询存在的文件 ===');
  try {
    const result1 = await queryOSSFiles('AI生成_山东苹果_20250718_104524.xlsx');
    console.log('\n📊 测试结果1:', JSON.stringify(result1, null, 2));
    
    if (result1.files_exist) {
      console.log('✅ 测试1成功: 找到了文件');
      console.log('📄 文件信息:', result1.files[0]);
      console.log('🔗 下载链接:', result1.files[0].oss_url);
    } else {
      console.log('❌ 测试1失败: 没有找到文件');
    }
  } catch (error) {
    console.log('❌ 测试1出错:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // 测试用例2: 查询不存在的文件
  console.log('=== 测试用例2: 查询不存在的文件 ===');
  try {
    const result2 = await queryOSSFiles('AI生成_不存在的文件_20250718_000000.xlsx');
    console.log('\n📊 测试结果2:', JSON.stringify(result2, null, 2));
    
    if (!result2.files_exist) {
      console.log('✅ 测试2成功: 正确返回未找到');
    } else {
      console.log('❌ 测试2异常: 不存在的文件却显示找到了');
    }
  } catch (error) {
    console.log('❌ 测试2出错:', error.message);
  }
  
  console.log('\n🏁 测试完成!');
}

// 运行测试
if (typeof window !== 'undefined') {
  // 浏览器环境
  console.log('在浏览器控制台中运行测试...');
  testOSSQuery();
} else {
  // Node.js环境
  console.log('请在浏览器环境中运行此测试脚本');
  console.log('打开浏览器控制台，复制粘贴此脚本内容并运行');
}