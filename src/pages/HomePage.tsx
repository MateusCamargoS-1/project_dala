import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import  useCartStore   from '../stores/cartStore'

type Product = Database['public']['Tables']['products']['Row']

export function HomePage() {
  const [quantity, setQuantity] = useState(1)
  const addToCart = useCartStore((state) => state.addToCart)
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    async function loadSaleProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_on_sale', true)
        .limit(4)

      if (!error && data) {
        setSaleProducts(data)
      }
      setLoading(false)
    }

    loadSaleProducts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative h-[500px] rounded-xl overflow-hidden mb-12">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e"
          alt="Supermarket"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Bem-vindo ao DALAROSA
            </h1>
            <p className="text-xl mb-8">
              Qualidade e economia para sua família
            </p>
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-3"
            >
              Ver Produtos
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Alimentos', 'Bebidas', 'Higiene', 'Limpeza'].map((category) => (
            <Link
              key={category}
              to={`/products?category=${category}`}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold">{category}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale Products (Promoções) */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Produtos em Oferta</h2>
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
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
                  <h3 className="font-semibold text-lg mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    {product.is_on_sale ? (
                      <div className="flex flex-col">
                        <span className="text-red-500 font-bold text-lg">
                          R$ {product.sale_price?.toFixed(2)}
                        </span>
                        <span className="text-gray-500 line-through text-sm">
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">
                        R$ {product.price.toFixed(2)}
                      </span>
                    )}
                    <button
                      className="btn-primary"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal de Detalhes do Produto */}
      {selectedProduct && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onClick={() => setSelectedProduct(null)} // Fecha ao clicar fora
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar no modal
          >
            <button
              className="absolute top-2 right-2 text-gray-600 text-xl"
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </button>
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-full h-56 object-cover rounded mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">
              {selectedProduct.name}
            </h2>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
            <p className="text-gray-500 mb-2">
              Categoria: <span className="font-semibold">{selectedProduct.category}</span>
            </p>
            <p className="text-gray-500 mb-4">
              Unidade: <span className="font-semibold">{selectedProduct.unit}</span>
            </p>
            {selectedProduct.is_on_sale ? (
              <div className="text-center">
                <span className="text-red-500 font-bold text-2xl">
                  R$ {selectedProduct.sale_price?.toFixed(2)}
                </span>
                <span className="text-gray-500 line-through ml-2 text-lg">
                  R$ {selectedProduct.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-center text-2xl font-bold">
                R$ {selectedProduct.price.toFixed(2)}
              </div>
            )}

            {/* Seletor de quantidade e botão de adicionar ao carrinho */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="px-3 py-1 bg-gray-200 rounded-l text-lg"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <input
                  type="number"
                  className="w-12 text-center border-t border-b border-gray-300"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button
                  className="px-3 py-1 bg-gray-200 rounded-r text-lg"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="btn-primary px-6 py-2"
                onClick={() => {
                  addToCart({
                    id: selectedProduct.id,
                    name: selectedProduct.name,
                    price: selectedProduct.is_on_sale ? selectedProduct.sale_price! : selectedProduct.price,
                    image_url: selectedProduct.image_url,
                    quantity,
                  })
                  setSelectedProduct(null) // Fecha o modal após adicionar ao carrinho
                }}
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
