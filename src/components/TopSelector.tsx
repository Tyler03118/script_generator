import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"

interface TopSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TopSelector({ activeTab, onTabChange }: TopSelectorProps) {
  const tabs = [
    {
      name: '明星互动脚本',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      tooltip: '生成明星与主播的互动脚本，包含话题引导和互动环节设计'
    },
    {
      name: '单人商品讲解',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      tooltip: '生成单人主播的商品讲解脚本，专注于产品介绍和卖点阐述'
    },
    {
      name: '商品卖点收集',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      tooltip: '收集和整理商品的核心卖点，分析竞品优势和市场定位'
    }
  ];

  return (
    <div className="bg-white shadow-sm">
      <div className="flex justify-center">
        <div className="max-w-4xl w-full px-6 py-4">
          <TooltipProvider>
            <div className="flex justify-center space-x-1">
              {tabs.map((tab) => (
                <Tooltip key={tab.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onTabChange(tab.name)}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                        activeTab === tab.name
                          ? 'bg-green-500 text-white shadow-md hover:bg-green-600'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>{tab.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
} 