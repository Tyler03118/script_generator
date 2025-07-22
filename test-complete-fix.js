// 完整测试流式响应解析修复
const testCompleteFix = () => {
  console.log('🧪 开始完整测试流式响应解析修复...');

  // 模拟完整的流式响应数据
  const mockStreamData = [
    'event:data',
    '',
    'data:{"data":{"status":"progress","step":"start","message":"开始生成直播脚本...","progress":0}}',
    'data:{"data":{"status":"progress","step":"info_search","message":"正在搜索商品信息...","progress":20}}',
    'data:{"data":{"status":"progress","step":"script_generation","message":"正在生成脚本内容...","progress":50}}',
    'data:{"data":{"status":"progress","step":"content_moderation","message":"正在审核内容...","progress":70}}',
    'data:{"data":{"status":"progress","step":"markdown_export","message":"正在导出Markdown...","progress":85}}',
    'data:{"data":{"status":"progress","step":"oss_upload","message":"正在上传到OSS...","progress":95}}',
    'data:[done]',
    '',
  ];

  console.log('📋 模拟流式响应数据:');
  mockStreamData.forEach((line, index) => {
    console.log(`  ${index + 1}. ${line}`);
  });

  console.log('\n🔄 开始解析模拟数据...');

  let buffer = '';
  let stepCount = 0;
  let finalResult = null;

  mockStreamData.forEach((line, index) => {
    console.log(`\n📋 处理第 ${index + 1} 行: ${line}`);
    
    const trimmedLine = line.trim();
    
    // 跳过空行和事件行
    if (trimmedLine === '') {
      console.log('⏭️ 跳过空行');
      return;
    }

    if (trimmedLine.startsWith('event:data')) {
      console.log('⏭️ 跳过事件行');
      return;
    }

    if (trimmedLine.startsWith('data:')) {
      try {
        const jsonStr = trimmedLine.substring(5).trim();
        
        // 处理空数据
        if (jsonStr === '') {
          console.log('⏭️ 跳过空数据行');
          return;
        }
        
        // 处理特殊格式的数据
        if (jsonStr === '[done]') {
          console.log('✅ 检测到完成标记');
          const doneResponse = {
            status: 'success',
            step: 'completed',
            message: '脚本生成完成',
            progress: 100,
          };
          console.log('📊 完成响应:', doneResponse);
          finalResult = doneResponse;
          return;
        }
        
        // 尝试解析JSON
        const response = JSON.parse(jsonStr);
        console.log('✅ JSON解析成功');
        
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
        
        stepCount++;
        console.log(`📊 步骤 ${stepCount}:`, {
          step: streamData.step,
          message: streamData.message,
          progress: streamData.progress
        });
        
        // 模拟进度回调
        if (streamData.status === 'success' || streamData.status === 'error') {
          finalResult = streamData;
        }
        
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
          finalResult = doneResponse;
        } else {
          console.log('⚠️ 无法处理的非JSON格式数据');
        }
      }
    } else {
      console.log('⚠️ 不是data:开头的行');
    }
  });

  console.log('\n📊 解析结果总结:');
  console.log(`- 总步骤数: ${stepCount}`);
  console.log(`- 最终状态: ${finalResult ? finalResult.status : 'unknown'}`);
  console.log(`- 最终步骤: ${finalResult ? finalResult.step : 'unknown'}`);
  console.log(`- 最终进度: ${finalResult ? finalResult.progress : 0}%`);

  if (finalResult && finalResult.status === 'success') {
    console.log('✅ 测试通过：成功处理了完整的流式响应');
  } else {
    console.log('❌ 测试失败：未能正确处理流式响应');
  }

  console.log('\n✅ 完整测试完成');
};

// 运行测试
testCompleteFix(); 