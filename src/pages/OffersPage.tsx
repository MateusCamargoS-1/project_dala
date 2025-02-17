import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import useCartStore from "../stores/cartStore";
import { toast } from "react-hot-toast";

export function OffersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category");

      if (error) {
        toast.error("Erro ao carregar categorias");
        console.error("Erro ao carregar categorias:", error);
        return;
      }

      const uniqueCategories = Array.from(new Set(data?.map((item: any) => item.category)));
      setCategories(["Todos", ...uniqueCategories]);
    };

    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_on_sale", true);

      if (error) {
        toast.error("Erro ao carregar produtos em oferta");
        console.error("Erro ao carregar produtos em oferta:", error);
        return;
      }

      setProducts(data || []);
    };

    fetchCategories();
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "Todos"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  const sortedProducts = filteredProducts.sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    });
    toast.success("Produto adicionado ao carrinho!");
  };

  if (products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Não há produtos em oferta no momento</h2>
          <p className="text-gray-600">Fique atento às nossas promoções!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-8">Ofertas Especiais</h1>

      <div className="mb-6 flex gap-4">
        <div>
          <label htmlFor="category" className="text-sm font-medium">Categoria</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input mt-1"
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="text-sm font-medium">Ordenar por Preço</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="input mt-1"
          >
            <option value="asc">Preço: Menor para Maior</option>
            <option value="desc">Preço: Maior para Menor</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedProducts.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-64 object-cover rounded-t-lg mb-4"
            />
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">R$ {product.price.toFixed(2)}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="btn-primary w-full py-2 mt-4"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
