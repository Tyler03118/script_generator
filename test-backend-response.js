// 测试后端响应格式
const testBackendResponse = async () => {
  const testData = {
    appId: 51143,
    bizCode: 'live_script_demo',
    config: { requestTimeoutMs: 1800000 },
    request: {
      service_type: "live_script",
      script_type: "单人推品",
      product_name: "测试商品",
      product_id: "123456",
      product_price: "99.99",
      anchor_name: "测试主播",
      live_time: "2024-01-15 20:00:00",
      excel_file_name: "测试脚本.xlsx"
    }
  };

  try {
    console.log('🚀 开始测试后端响应...');
    console.log('📤 发送请求数据:', JSON.stringify(testData, null, 2));

    const response = await fetch('http://localhost:7001/pyinfer_tao_pre/api/v1/inference/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
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

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // 处理可能的多行响应
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine === '') continue;

        if (trimmedLine.startsWith('event:data')) continue;

        if (trimmedLine.startsWith('data:')) {
          try {
            const jsonStr = trimmedLine.substring(5).trim();
            const response = JSON.parse(jsonStr);
            
            console.log('📊 收到响应:', JSON.stringify(response, null, 2));
            
            // 检查响应格式
            if (response.data) {
              const data = response.data;
              console.log('✅ 响应格式正确');
              console.log('📋 状态:', data.status);
              console.log('🔧 步骤:', data.step);
              console.log('💬 消息:', data.message);
              console.log('📈 进度:', data.progress);
              
              if (data.workflow_steps) {
                console.log('🔄 工作流步骤:', data.workflow_steps);
              }
              
              if (data.oss_info) {
                console.log('☁️ OSS信息:', data.oss_info);
              }
              
              if (data.excel_info) {
                console.log('📊 Excel信息:', data.excel_info);
              }
            }
          } catch (e) {
            console.warn('❌ 解析响应失败:', e, 'Original line:', trimmedLine);
          }
        }
      }
    }

    console.log('✅ 测试完成');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
};

// 运行测试
testBackendResponse(); 