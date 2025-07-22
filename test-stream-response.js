// 测试流式响应解析修复
const testStreamResponseParsing = () => {
  console.log('🧪 开始测试流式响应解析...');

  // 模拟后端返回的各种格式数据
  const testCases = [
    // 正常的JSON格式
    'data:{"data":{"status":"progress","step":"info_search","message":"正在搜索信息...","progress":20}}',
    
    // 嵌套格式
    'data:{"data":{"data":{"status":"progress","step":"script_generation","message":"正在生成脚本...","progress":50}}}',
    
    // 完成标记
    'data:[done]',
    
    // 空数据
    'data:',
    
    // 非JSON格式
    'data:some non-json data',
    
    // 事件行（应该被忽略）
    'event:data',
    
    // 空行（应该被忽略）
    '',
  ];

  const decoder = new TextDecoder();
  
  testCases.forEach((testCase, index) => {
    console.log(`\n📋 测试用例 ${index + 1}: ${testCase}`);
    
    try {
      const trimmedLine = testCase.trim();
      if (trimmedLine === '') {
        console.log('⏭️ 跳过空行');
        return;
      }

      if (trimmedLine.startsWith('event:data')) {
        console.log('⏭️ 跳过事件行');
        return;
      }

      if (trimmedLine.startsWith('data:')) {
        const jsonStr = trimmedLine.substring(5).trim();
        
        // 处理特殊格式的数据
        if (jsonStr === '[done]') {
          console.log('✅ 检测到完成标记，构造完成响应');
          const doneResponse = {
            status: 'success',
            step: 'completed',
            message: '脚本生成完成',
            progress: 100,
          };
          console.log('📊 完成响应:', doneResponse);
          return;
        }
        
        // 尝试解析JSON
        try {
          const response = JSON.parse(jsonStr);
          console.log('✅ JSON解析成功:', response);
          
          // 提取实际数据
          let streamData;
          
          if (response.data?.data) {
            // 嵌套格式：data.data
            const innerData = response.data.data;
            streamData = {
              status: innerData.status || 'progress',
              step: innerData.step || 'unknown',
              message: innerData.message || '',
              progress: innerData.progress || 0,
            };
          } else if (response.data) {
            // 直接格式：data
            streamData = {
              status: response.data.status || 'progress',
              step: response.data.step || 'unknown',
              message: response.data.message || '',
              progress: response.data.progress || 0,
            };
          } else {
            // 兜底处理
            streamData = {
              status: 'progress',
              step: 'unknown',
              message: 'Processing...',
              progress: 0,
            };
          }
          
          console.log('📊 提取的流数据:', streamData);
          
        } catch (parseError) {
          console.log('❌ JSON解析失败:', parseError.message);
          
          // 如果是非JSON格式，尝试处理特殊格式
          if (trimmedLine.includes('[done]')) {
            console.log('✅ 检测到完成标记（异常处理）');
            const doneResponse = {
              status: 'success',
              step: 'completed',
              message: '脚本生成完成',
              progress: 100,
            };
            console.log('📊 完成响应:', doneResponse);
          } else {
            console.log('⚠️ 无法处理的非JSON格式数据');
          }
        }
      } else {
        console.log('⚠️ 不是data:开头的行');
      }
    } catch (error) {
      console.error('❌ 测试用例处理失败:', error);
    }
  });

  console.log('\n✅ 流式响应解析测试完成');
};

// 运行测试
testStreamResponseParsing(); 