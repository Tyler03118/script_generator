# AI直播脚本生成器

一个基于AI的直播脚本生成工具，支持多种脚本类型生成，为直播带货提供智能化脚本创作支持。

## 🎯 项目简介

AI直播脚本生成器是一个现代化的Web应用，旨在帮助主播和内容创作者快速生成高质量的直播脚本。通过AI技术，用户只需填写商品信息和直播要求，即可自动生成专业的直播脚本文档。

## ✨ 功能特性

### 📝 多种脚本类型
- **单人推品** - 适用于个人主播的商品推荐脚本
- **嘉宾互动** - 支持主播与嘉宾互动的脚本生成
- **商品卖点** - 专注于商品特色和卖点的脚本内容

### 🚀 核心功能
- **智能表单验证** - 实时表单校验，确保数据完整性
- **多标签页状态管理** - 每个脚本类型独立的生成状态
- **文件生成与下载** - 支持Excel和Markdown格式输出
- **实时进度跟踪** - 轮询机制跟踪文件生成进度
- **响应式设计** - 适配不同屏幕尺寸的现代化UI

### 🔧 技术特性
- **流式API响应处理** - 处理SSE流式数据传输
- **OSS文件查询** - 支持阿里云OSS文件存储查询
- **商品信息查询** - 集成iGraph商品信息API
- **错误处理与重试** - 完善的错误处理和重试机制

## 🛠️ 技术栈

### 前端框架
- **React 19** - 现代化的用户界面库
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的构建工具和开发服务器

### UI组件库
- **Tailwind CSS** - 实用优先的CSS框架
- **Radix UI** - 无样式的可访问UI组件
- **Lucide React** - 美观的图标库
- **Sonner** - 优雅的通知组件

### 状态管理
- **React Hooks** - 现代的状态管理方案
- **自定义Hooks** - 封装的业务逻辑钩子

### 数据处理
- **React Hook Form** - 高性能的表单处理
- **XLSX** - Excel文件处理
- **Date-fns** - 日期处理工具

## 📁 项目结构

```
src/
├── components/          # React组件
│   ├── TopSelector.tsx          # 脚本类型选择器
│   ├── RequiredInfoForm.tsx     # 表单组件
│   ├── GenerateButton.tsx       # 生成按钮
│   ├── FileGenerationStatus.tsx # 生成状态组件
│   ├── ScriptPreview.tsx        # 脚本预览
│   ├── ProgressIndicator.tsx    # 进度指示器
│   └── ...
├── hooks/              # 自定义Hooks
│   ├── useFileGeneration.ts     # 文件生成状态管理
│   └── useFormValidation.ts     # 表单验证逻辑
├── services/           # API服务
│   └── api.ts          # API接口封装
├── types/              # TypeScript类型定义
│   └── index.ts        # 类型声明
├── constants/          # 常量定义
└── App.tsx            # 主应用组件
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm 或 yarn 或 pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 `http://localhost:5173` 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

### 代码检查
```bash
npm run lint
# 或
yarn lint
# 或
pnpm lint
```

## 📖 使用说明

1. **选择脚本类型** - 在顶部选择需要生成的脚本类型
2. **填写商品信息** - 根据表单要求填写完整的商品和直播信息
3. **生成脚本** - 点击"生成脚本"按钮开始AI生成流程
4. **查看进度** - 实时查看生成进度和状态
5. **下载文件** - 生成完成后可下载Excel或Markdown格式的脚本文件

## 🏗️ 架构设计

### 组件架构
- **容器组件** - 负责状态管理和数据流
- **展示组件** - 负责UI渲染和用户交互
- **自定义Hooks** - 封装复用的业务逻辑

### 状态管理
- **多标签页独立状态** - 每个脚本类型维护独立的生成状态
- **表单状态同步** - 实时验证和数据同步
- **异步状态处理** - 优雅处理API调用和文件生成流程

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

## 📄 许可证

Powered by 自营技术-消费技术-直播 & AI应用

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```