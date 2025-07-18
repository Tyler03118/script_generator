// 应用相关常量
export const APP_CONFIG = {
  maxRetryAttempts: 20,
  pollInterval: 30000, // 30秒轮询间隔
  maxProgressAttempts: 60,
} as const;

// 文件生成相关常量
export const FILE_GENERATION = {
  maxProductNameLength: 10,
  invalidCharsRegex: /[<>:"/\\|?*]/g,
  commaRegex: /[,，]/g,
  spaceRegex: /\s+/g,
  replacementChar: '_',
} as const;

// 脚本类型常量
export const SCRIPT_TYPES = {
  SINGLE_PRODUCT: '单人推品',
  GUEST_INTERACTION: '嘉宾互动',
  PRODUCT_SELLING_POINT: '商品卖点',
} as const;

// UI 相关常量
export const UI_CONFIG = {
  containerMaxWidth: 'max-w-6xl',
  marginLeft: 'ml-32',
  animationDuration: 'transition-colors',
} as const;