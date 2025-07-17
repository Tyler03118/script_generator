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

const ProductList = forwardRef<ProductListRef, ProductListProps>(({ onProductsChange, onValidationChange }, ref) => {
  const [products, setProducts] = useState<Product[]>([
    { id: '1', product_id: '', product_name: '', product_price: '', product_spec: '', sellpoint: '' }
  ]);

  // 验证所有产品是否填写完整
  const validateProducts = (productList: Product[]) => {
    return productList.every(product => 
      product.product_id.trim() !== '' && 
      product.product_name.trim() !== '' && 
      product.product_price.trim() !== ''
    );
  };

  // 监听产品变化，通知父组件
  useEffect(() => {
    onProductsChange(products);
    onValidationChange(validateProducts(products));
  }, [products, onProductsChange, onValidationChange]);

  // 添加产品
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

  // 删除产品
  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // 更新产品字段
  const updateProduct = (id: string, field: keyof Omit<Product, 'id'>, value: string) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  // 拼接产品数据为字符串（用于最终提交）
  const getJoinedProductData = () => {
    return {
      product_id: products.map(p => p.product_id).filter(id => id.trim() !== '').join(';'),
      product_name: products.map(p => p.product_name).filter(name => name.trim() !== '').join(';'),
      product_price: products.map(p => p.product_price).filter(price => price.trim() !== '').join(';'),
      product_spec: products.map(p => p.product_spec).filter(spec => spec.trim() !== '').join(';'),
      sellpoint: products.map(p => p.sellpoint).filter(point => point.trim() !== '').join(';')
    };
  };

  // 搜索产品历史信息
  const handleSearchClick = (productId: string) => {
    // 这里可以添加搜索逻辑
    console.log('搜索产品ID:', productId);
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
          产品信息
        </h3>
        <button
          onClick={addProduct}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 active:bg-green-700 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span className='text-sm font-semibold'>添加产品</span>
        </button>
      </div>

      {/* 产品列表容器 - 超过3个产品时启用滚动 */}
      <div className={`space-y-4 ${products.length > 3 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
        {products.map((product, index) => (
          <div key={product.id} className="border border-green-400 rounded-lg p-4 bg-green-50 transition-all duration-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-green-700">产品{index + 1}</h4>
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
                  产品ID <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={product.product_id}
                    onChange={(e) => updateProduct(product.id, 'product_id', e.target.value)}
                    placeholder="请输入产品ID，点击右侧按钮自动查询填写产品信息"
                    className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                  />
                  <SearchButton 
                    onClick={() => handleSearchClick(product.product_id)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  产品名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={product.product_name}
                  onChange={(e) => updateProduct(product.id, 'product_name', e.target.value)}
                  placeholder="请输入产品名称"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  产品价格 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={product.product_price}
                  onChange={(e) => updateProduct(product.id, 'product_price', e.target.value)}
                  placeholder="请输入产品价格"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  产品规格
                </label>
                <input
                  type="text"
                  value={product.product_spec}
                  onChange={(e) => updateProduct(product.id, 'product_spec', e.target.value)}
                  placeholder="请输入产品规格，如：500ml*12瓶"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  产品卖点
                </label>
                <textarea
                  value={product.sellpoint}
                  onChange={(e) => updateProduct(product.id, 'sellpoint', e.target.value)}
                  placeholder="请输入产品卖点，如：深层补水、改善肤质、提亮肤色"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-all duration-200 cursor-text resize-none"
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