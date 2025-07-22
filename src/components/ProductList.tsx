import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import SearchButton from './SearchButton';

interface Product {
  id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  product_spec: string;
  sellpoint: string;
}

interface ProductListProps {
  isGeneratingScript?: boolean; // 新增：是否正在生成脚本
  onProductsChange: (products: Product[]) => void;
  onValidationChange: (isValid: boolean) => void;
}

export interface ProductListRef {
  getJoinedProductData: () => {
    product_id: string;
    product_name: string;
    product_price: string;
    product_spec: string;
    sellpoint: string;
  };
}

const ProductList = forwardRef<ProductListRef, ProductListProps>(({ isGeneratingScript = false, onProductsChange, onValidationChange }, ref) => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', product_id: '', product_name: '', product_price: '', product_spec: '', sellpoint: '' }
  ]);

  // 验证所有商品是否填写完整
  const validateProducts = (productList: Product[]) => {
    return productList.every(product => 
      product.product_id.trim() !== '' && 
      product.product_name.trim() !== '' && 
      product.product_price.trim() !== ''
    );
  };

  // 监听商品变化，通知父组件
  useEffect(() => {
    onProductsChange(products);
    onValidationChange(validateProducts(products));
  }, [products, onProductsChange, onValidationChange]);

  // 添加商品
  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      product_id: '',
      product_name: '',
      product_price: '',
      product_spec: '',
      sellpoint: ''
    };
    setProducts([...products, newProduct]);
  };

  // 删除商品
  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // 更新商品字段
  const updateProduct = (id: string, field: keyof Omit<Product, 'id'>, value: string) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  // 处理搜索到的商品信息
  const handleProductInfoFound = (id: string) => (productInfo: {
    product_name?: string;
    product_price?: string;
    brand_info?: string;
    sellpoint?: string;
  }) => {
    // 更新当前商品的信息
    const updateData: Partial<Product> = {};
    
    if (productInfo.product_name) {
      updateData.product_name = productInfo.product_name;
    }
    
    if (productInfo.product_price) {
      updateData.product_price = productInfo.product_price;
    }
    
    // 统一处理：将 brand_info 和 selling_points 合并到卖点字段
    if (productInfo.sellpoint || productInfo.brand_info) {
      const parts = [];
      if (productInfo.brand_info) {
        parts.push(productInfo.brand_info);
      }
      if (productInfo.sellpoint) {
        parts.push(productInfo.sellpoint);
      }
      updateData.sellpoint = parts.join(';');
    }
    
    // 更新商品信息
    setProducts(products.map(product =>
      product.id === id ? { ...product, ...updateData } : product
    ));
    
    console.log('✅ 商品信息自动填充成功');
    

  };

  // 拼接商品数据为字符串（用于最终提交）
  const getJoinedProductData = () => {
    return {
      product_id: products.map(p => p.product_id).filter(id => id.trim() !== '').join(';'),
      product_name: products.map(p => p.product_name).filter(name => name.trim() !== '').join(';'),
      product_price: products.map(p => p.product_price).filter(price => price.trim() !== '').join(';'),
      product_spec: products.map(p => p.product_spec).filter(spec => spec.trim() !== '').join(';'),
      sellpoint: products.map(p => p.sellpoint).filter(point => point.trim() !== '').join(';')
    };
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    getJoinedProductData
  }));

  return (
    <div className="bg-white border-2 border-green-500 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-600 flex items-center">
          <Package className="w-5 h-5 text-green-600 mr-3" />
          商品信息
        </h3>
        <button
          onClick={addProduct}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 active:bg-green-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className='text-sm font-semibold'>添加商品</span>
        </button>
      </div>

      {/* 商品列表容器 - 超过3个商品时启用滚动 */}
      <div className={`space-y-4 ${products.length > 3 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
        {products.map((product, index) => (
          <div key={product.id} className="border border-green-400 rounded-lg p-4 bg-green-50 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-green-700">商品{index + 1}</h4>
              {products.length > 1 && (
                <button
                  onClick={() => removeProduct(product.id)}
                  className="flex items-center space-x-1 px-2 py-1 text-red-500 hover:text-red-400 hover:bg-red-50 active:bg-red-100 rounded transition-all duration-200 cursor-pointer text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品ID <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={product.product_id}
                    onChange={(e) => updateProduct(product.id, 'product_id', e.target.value)}
                    placeholder="请输入商品ID，点击右侧按钮自动查询填写商品信息"
                    className="text-sm flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                  />
                  <SearchButton 
                    itemId={product.product_id}
                    isGeneratingScript={isGeneratingScript}
                    onProductInfoFound={handleProductInfoFound(product.id)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={product.product_name}
                  onChange={(e) => updateProduct(product.id, 'product_name', e.target.value)}
                  placeholder="请输入商品名称"
                  className="text-sm w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品价格 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={product.product_price}
                  onChange={(e) => updateProduct(product.id, 'product_price', e.target.value)}
                  placeholder="请输入商品价格"
                  className="text-sm w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品规格
                </label>
                <input
                  type="text"
                  value={product.product_spec}
                  onChange={(e) => updateProduct(product.id, 'product_spec', e.target.value)}
                  placeholder="请输入商品规格"
                  className="text-sm w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  商品卖点
                </label>
                <textarea
                  value={product.sellpoint}
                  onChange={(e) => updateProduct(product.id, 'sellpoint', e.target.value)}
                  placeholder="请输入商品卖点，如：纯天然无添加、营养丰富（自动搜索时会包含品牌信息和卖点）"
                  rows={2}
                  className="text-sm w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 resize-none cursor-text"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ProductList.displayName = 'ProductList';

export default ProductList;