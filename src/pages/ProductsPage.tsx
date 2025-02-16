import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import  useCartStore  from '../stores/cartStore'
import type { Database } from '../lib/database.types'

type Product = Database['public']['Tables']['products']['Row']

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const addItem = useCartStore((state) => state.addToCart)
  
  const category = searchParams.get('category')
  const [selectedCategory, setSelectedCategory] = useState(category || 'all')
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | null>(null)
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false)

  const categories = ['Alimentos', 'Bebidas', 'Higiene', 'Limpeza']

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, priceSort, showOnlyOnSale])

  async function loadProducts() {
    setLoading(true)
    let query = supabase.from('products').select('*')
    
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }

    if (showOnlyOnSale) {
      query = query.eq('is_on_sale', true)
    }

    let { data, error } = await query

    if (!error && data) {
      if (priceSort) {
        data = data.sort((a, b) => {
          const priceA = a.is_on_sale && a.sale_price ? a.sale_price : a.price
          const priceB = b.is_on_sale && b.sale_price ? b.sale_price : b.price
          return priceSort === 'asc' ? priceA - priceB : priceB - priceA
        })
      }
      setProducts(data)
    }
    setLoading(false)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">
          {selectedCategory === 'all' ? 'Todos os Produtos' : selectedCategory}
        </h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={priceSort || ''}
            onChange={(e) => setPriceSort(e.target.value as 'asc' | 'desc' | null)}
            className="px-4 py-2 rounded-md border border-gray-300"
          >
            <option value="">Ordenar por preço</option>
            <option value="asc">Menor preço</option>
            <option value="desc">Maior preço</option>
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlyOnSale}
              onChange={(e) => setShowOnlyOnSale(e.target.checked)}
              className="rounded text-primary-600"
            />
            Mostrar apenas promoções
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    {product.is_on_sale && product.sale_price ? (
                      <>
                        <span className="text-lg font-bold text-primary-600">
                          R$ {product.sale_price.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">
                        R$ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => addItem({
                      id: product.id,
                      name: product.name,
                      price: product.is_on_sale && product.sale_price
                        ? product.sale_price
                        : product.price,
                      image_url: product.image_url,
                      quantity: 1
                    })}
                    className="btn-primary"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sem estoque' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}