import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import useCartStore from "../stores/cartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

export function ButcheryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(100);

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchButcheryProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "Açougue");
      if (error) {
        console.error("Erro ao buscar produtos do açougue:", error);
      } else {
        setProducts(data);
      }
    }

    fetchButcheryProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.price <= maxPrice
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Açougue - Carnes</h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input w-full md:w-1/3"
        />

        <div className="flex items-center gap-2">
          <label className="text-gray-700">Preço Máx:</label>
          <input
            type="range"
            min="0"
            max="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-gray-700">R$ {maxPrice}</span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-40 h-40 object-cover mb-4"
              />
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-700">R$ {product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart({ ...product, quantity: 1 })}
                className="mt-3 btn-primary px-4 py-2"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
