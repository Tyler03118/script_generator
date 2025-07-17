import { ScanSearch } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
}

const SearchButton = ({ onClick, className = '' }: SearchButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`flex items-center justify-center w-10 h-[42px] bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 active:from-blue-700 active:to-purple-700  transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg border border-transparent ${className}`}
          >
            <ScanSearch className="w-5 h-5"/>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>一键填充产品信息</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SearchButton; 