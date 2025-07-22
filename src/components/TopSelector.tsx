import { Users, User, ShoppingBasket } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip"
import type { ScriptType } from "../types"


interface TopSelectorProps {
  activeTab: ScriptType;
  onTabChange: (tab: ScriptType) => void;
}

export default function TopSelector({ activeTab, onTabChange }: TopSelectorProps) {
  const tabs = [
    {
      name: '单人推品',
      icon: (
        <User />
      ),
      tooltip: '生成单人主播的商品推广脚本，专注于产品介绍和卖点阐述'
    },
    {
      name: '嘉宾互动',
      icon: (
        <Users />
      ),
      tooltip: '生成主播与嘉宾的互动脚本，包含话题引导和嘉宾互动环节设计'
    },
    {
      name: '商品卖点',
      icon: (
        <ShoppingBasket />
      ),
      tooltip: '针对商品核心卖点的脚本，包含产品演绎和价格演绎等信息'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-center">
        <div className="max-w-4xl w-full px-6 py-4">
          <TooltipProvider>
            <div className="flex justify-center space-x-1">
              {tabs.map((tab) => (
                <Tooltip key={tab.name}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onTabChange(tab.name as ScriptType)}
                      className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                        activeTab === tab.name
                          ? 'bg-green-500 text-white shadow-md hover:bg-green-600 active:bg-green-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
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