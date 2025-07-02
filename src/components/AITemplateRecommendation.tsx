import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AITemplateRecommendationProps {
  templateType: string;
  onTemplateChange: (value: string) => void;
}

export default function AITemplateRecommendation({ templateType, onTemplateChange }: AITemplateRecommendationProps) {
  const templateDescriptions: { [key: string]: string } = {
    factoryTrace: '工厂溯源专场模板，带观众深入生产一线，展示从原料选择到成品包装的全过程，突出品质把控和生产工艺，增强消费者信任度。',
    festival618: '618零食大促专场模板，营造节日购物氛围，重点展示优惠力度、限时抢购和爆款推荐，激发用户购买欲望和紧迫感。',
    newProduct: '新品首发专场模板，专为新品上线设计，突出产品创新点和差异化优势，包含试用体验和首发福利介绍。',
    originDirect: '产地直采专场模板，展示农产品和生鲜的原产地风光，强调新鲜直达和源头品质，适合生鲜、农特产品推广。',
    brandDay: '品牌日专场模板，深度展示品牌故事和产品矩阵，突出品牌价值和用户口碑，适合单一品牌的集中推广。',
    parentBaby: '母婴育儿专场模板，关注宝妈需求和育儿场景，强调产品安全性和实用性，包含专家建议和使用指导。',
    wellness: '健康养生专场模板，结合养生理念和健康生活方式，突出产品功效和科学依据，适合保健品和营养食品推广。',
    homeLife: '居家生活专场模板，展示产品在家庭场景中的实际应用，强调便利性和生活品质提升，适合家居清洁和生活用品。'
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
      <div className="flex items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI模版推荐</h2>
            <p className="text-sm text-gray-500 mt-1">基于历史猫超直播，选择专业模版，高效率打造精彩直播内容</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-4 mx-4 w-full">
        
        <div className="relative max-w-2xl w-full">
          {/* 渐变边框容器 */}
          <div className="relative p-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-xl shadow-lg shadow-cyan-400/20 hover:shadow-purple-500/30 transition-all duration-300">
            <Select value={templateType} onValueChange={onTemplateChange}>
              <SelectTrigger className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-purple-500/50 cursor-pointer transition-all duration-300">
                <SelectValue placeholder="请选择直播专场模版" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="factoryTrace">🏭 工厂溯源专场</SelectItem>
                <SelectItem value="festival618">🎉 618零食大促专场</SelectItem>
                <SelectItem value="newProduct">🆕 新品首发专场</SelectItem>
                <SelectItem value="originDirect">🌱 产地直采专场</SelectItem>
                <SelectItem value="brandDay">🏷️ 品牌日专场</SelectItem>
                <SelectItem value="parentBaby">👶 母婴育儿专场</SelectItem>
                <SelectItem value="wellness">💊 健康养生专场</SelectItem>
                <SelectItem value="homeLife">🏠 居家生活专场</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 模板说明 */}
        {templateType && templateDescriptions[templateType] && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl w-full">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-green-800 mb-1">模版说明</h4>
                <p className="text-sm text-green-700 leading-relaxed">
                  {templateDescriptions[templateType]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 