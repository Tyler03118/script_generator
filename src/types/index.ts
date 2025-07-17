export interface BaseFormData {
  // 产品基础信息（所有类型共有）
  product_name: string; // 必填
  product_id: string;
  product_spec: string;
  product_price: string;
  cpv: string;
  sellpoint: string;
}

export interface SingleProductFormData extends BaseFormData {
  // 单人推品专用参数
  brand_name: string;
  live_topic: string;
  live_time: string;
  live_type: string;
  anchor_name: string;
  product_type: string;
  sessions: string;
  props: string;
  user_portrait: string;
  live_video_transcript: string;
}

export interface GuestInteractionFormData extends BaseFormData {
  // 嘉宾互动专用参数
  brand_name: string;
  live_topic: string;
  live_time: string;
  live_type: string;
  anchor_name: string;
  guests: string; // 嘉宾信息
  product_type: string;
  sessions: string;
  props: string;
  user_portrait: string;
}

export interface ProductSellingPointFormData extends BaseFormData {
  // 商品卖点专用参数
  retail_price: string;
  discount: string;
  mechanism: string;
  logistics: string;
  pr_date: string;
  brand_info: string;
  display: string;
  intro: string;
}

export type FormData = SingleProductFormData | GuestInteractionFormData | ProductSellingPointFormData;

export type ScriptType = '单人推品' | '嘉宾互动' | '商品卖点';

export interface TemplateOption {
  value: string;
  label: string;
}

export interface APIRequestData {
  script_type: ScriptType;
  [key: string]: string | number | boolean | undefined;
} 