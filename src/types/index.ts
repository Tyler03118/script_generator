export interface FormData {
  productId: string;
  brandName: string;
  liveTime: string;
  liveTheme: string;
  liveType: string;
  host: string;
  celebrity: string;
  liveDate: string;
  hostName: string;
  liveTopicRight: string;
  liveTypeRight: string;
  targetAudience: string;
  productFeatures: string;
  competitorAnalysis: string;
  marketPosition: string;
  liveSegmentDesign?: string;
  materialProps?: string;
}

export type ScriptType = '明星互动脚本' | '单人商品讲解' | '商品卖点收集';

export interface TemplateOption {
  value: string;
  label: string;
} 