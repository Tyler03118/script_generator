// 测试API调用
const testApiCall = async () => {
  console.log('🧪 开始测试API调用...');

  const testData = {
    script_type: "单人推品",
    product_name: "测试商品",
    product_id: "123456",
    product_price: "99.99",
    anchor_name: "测试主播",
    live_time: "2024-01-15 20:00:00",
    excel_file_name: "测试脚本.xlsx"
  };

  const requestBody = {
    appId: 51143,
    bizCode: 'live_script_demo',
    config: { requestTimeoutMs: 1800000 },
    request: {
      service_type: "live_script",
      ...testData
    }
  };

  try {
    console.log('📡 API地址: http://localhost:7001/pyinfer_tao_pre/api/v1/inference/stream');
    console.log('📤 请求数据:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('http://localhost:7001/pyinfer_tao_pre/api/v1/inference/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('📥 收到响应:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ 请求成功，开始处理流式响应...');

    // 处理流式响应
    const reader = response.body?.getReader();
    if (!reader) throw new Error('无法读取响应流');

    const decoder = new TextDecoder();
    let buffer = '';
    let lineCount = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('✅ 流式响应读取完成');
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // 处理可能的多行响应
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        lineCount++;
        const trimmedLine = line.trim();
        console.log(`📋 第${lineCount}行: ${trimmedLine}`);
        
        if (trimmedLine === '') {
          console.log('⏭️ 跳过空行');
          continue;
        }

        if (trimmedLine.startsWith('event:data')) {
          console.log('⏭️ 跳过事件行');
          continue;
        }

        if (trimmedLine.startsWith('data:')) {
          try {
            const jsonStr = trimmedLine.substring(5).trim();
            
            // 处理空数据
            if (jsonStr === '') {
              console.log('⏭️ 跳过空数据行');
              continue;
            }
            
            // 处理特殊格式的数据
            if (jsonStr === '[done]') {
              console.log('✅ 检测到完成标记');
              break;
            }
            
            // 尝试解析JSON
            const response = JSON.parse(jsonStr);
            console.log('✅ JSON解析成功:', response);
            
          } catch (e) {
            console.warn('❌ 解析流式响应失败:', e, 'Original line:', trimmedLine);
            
            // 如果是非JSON格式，尝试处理特殊格式
            if (trimmedLine.includes('[done]')) {
              console.log('✅ 检测到完成标记（异常处理）');
              break;
            }
          }
        } else {
          console.log('⚠️ 不是data:开头的行');
        }
      }
    }

    console.log('✅ API调用测试完成');

  } catch (error) {
    console.error('❌ API调用测试失败:', error);
    
    if (error.message.includes('fetch')) {
      console.log('💡 提示: 请确保后端服务运行在 http://localhost:7001');
    }
  }
};

// 运行测试
testApiCall(); 