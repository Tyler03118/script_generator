// 测试文件：test-api.js
const fetch = require('node-fetch');

async function testDirectCall() {
  console.log('=== 直接调用测试 ===');
  const start = Date.now();
  
  try {
    const response = await fetch('https://tppwork.taobao.com/pyinfer_tao_pre/api/v1/inference/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: 51143,
        bizCode: 'live_script_demo',
        config: { requestTimeoutMs: 1800000 },
        request: JSON.stringify({
          script_type: '单人推品',
          product_name: '测试产品'
        })
      }),
      timeout: 1800000
    });
    
    const duration = Date.now() - start;
    console.log(`直接调用成功，耗时: ${duration}ms, 状态: ${response.status}`);
    
  } catch (error) {
    const duration = Date.now() - start;
    console.log(`直接调用失败，耗时: ${duration}ms, 错误: ${error.message}`);
  }
}

async function testProxyCall() {
  console.log('=== 代理调用测试 ===');
  const start = Date.now();
  
  try {
    const response = await fetch('http://localhost:5173/pyinfer_tao_pre/api/v1/inference/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appId: 51143,
        bizCode: 'live_script_demo',
        config: { requestTimeoutMs: 1800000 },
        request: JSON.stringify({
          script_type: '单人推品',
          product_name: '测试产品'
        })
      }),
      timeout: 1800000
    });
    
    const duration = Date.now() - start;
    console.log(`代理调用成功，耗时: ${duration}ms, 状态: ${response.status}`);
    
  } catch (error) {
    const duration = Date.now() - start;
    console.log(`代理调用失败，耗时: ${duration}ms, 错误: ${error.message}`);
  }
}

// 运行测试
testDirectCall().then(() => testProxyCall());
