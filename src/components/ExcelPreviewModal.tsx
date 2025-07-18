import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface RowData {
  [key: string]: string | number | Date;
}

interface ExcelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

// 将OSS URL转换为代理URL以解决CORS问题
const convertToProxyUrl = (ossUrl: string): string => {
  try {
    const url = new URL(ossUrl);
    // 检查是否是OSS域名
    if (url.hostname.includes('oss-cn-zhangjiakou.aliyuncs.com')) {
      // 将OSS URL转换为代理URL：/oss-proxy + pathname + search
      return `/oss-proxy${url.pathname}${url.search}`;
    }
    // 如果不是OSS URL，直接返回原URL
    return ossUrl;
  } catch (error) {
    console.warn('URL转换失败，使用原始URL:', error);
    return ossUrl;
  }
};

const parseExcelFromUrl = async (url: string): Promise<{ columns: any[]; data: RowData[] }> => {
  // 转换为代理URL以解决CORS问题
  const proxyUrl = convertToProxyUrl(url);
  console.log('使用代理URL请求Excel文件:', proxyUrl);
  
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error('Failed to fetch Excel file.');
  
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false }) as string[][];

  // 使用 @tanstack/react-table 的 createColumnHelper
  const columnHelper = createColumnHelper<RowData>();
  
  const columns = sheetData[0].map((col, index) => 
    columnHelper.accessor(index.toString(), {
      header: col as string,
      cell: info => info.getValue(),
    })
  );

  const rowData = sheetData.slice(1).map((row, rowIndex) =>
    row.reduce((acc, curr, colIndex) => {
      const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
      const cell = sheet[cellRef];
      acc[colIndex.toString()] = cell?.t === 'd' ? XLSX.SSF.format('yyyy-mm-dd', cell.v) : curr;
      return acc;
    }, {} as RowData)
  );

  return { columns, data: rowData };
};

const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  fileUrl, 
  fileName 
}) => {
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileUrl || !isOpen) return;
    
    setLoading(true);
    setError(null);
    
    parseExcelFromUrl(fileUrl)
      .then(({ columns, data }) => {
        setColumns(columns);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Excel文件解析失败:', err);
        setError(err.message || 'Failed to load Excel file.');
        setLoading(false);
      });
  }, [fileUrl, isOpen]);

  const table = useReactTable({
    data: useMemo(() => data, [data]),
    columns: useMemo(() => columns, [columns]),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              预览脚本文件: {fileName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                下载
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">加载中，请稍候...</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-600 text-center">
                <p className="text-lg font-semibold mb-2">出错啦</p>
                <p>{error}</p>
                <p className="text-sm text-gray-500 mt-2">请尝试重新加载或联系技术支持</p>
              </div>
            </div>
          )}
          
          {!loading && !error && data.length > 0 && (
            <div className="overflow-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50 sticky top-0">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th 
                          key={header.id}
                          className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-900"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td 
                          key={cell.id}
                          className="border border-gray-300 px-4 py-2 text-sm text-gray-700"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && !error && data.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">没有找到数据</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelPreviewModal;