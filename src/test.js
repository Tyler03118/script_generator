// 测试文件：test-api.js
const fetch = require('node-fetch');

// 注意：直接调用外部API会遇到跨域问题，在浏览器环境中会失败
// 这个函数仅用于Node.js环境的测试，实际前端应用请使用代理调用
async function testDirectCall() {
  console.log('=== 直接调用测试（仅Node.js环境，浏览器会跨域） ===');
  const start = Date.now();
  
  try {
    // 注意：在浏览器环境中，这个调用会因为跨域问题而失败
    // 实际前端应用应该使用相对路径通过Vite代理访问
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
  console.log('=== 代理调用测试（推荐方式，避免跨域） ===');
  const start = Date.now();
  
  try {
    // 推荐：使用Vite代理，避免跨域问题
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
console.log('注意：请确保Vite开发服务器正在运行（npm run dev）以使代理正常工作');
testDirectCall().then(() => testProxyCall());