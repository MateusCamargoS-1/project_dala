import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category: "Alimentos",
    unit: "Unidade",
    is_on_sale: false,
    sale_price: "",
  });

  const categories = ["Alimentos", "Bebidas", "Higiene", "Limpeza", "Outros"];
  const units = ["Unidade", "Kg", "Litro", "Pacote", "Caixa"];

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) console.error("Erro ao buscar produtos:", error);
    else setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) console.error("Erro ao buscar pedidos:", error);
    else setOrders(data || []);
  };

  const handleAddOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    const formattedProduct = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      sale_price: newProduct.is_on_sale ? parseFloat(newProduct.sale_price) : null,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from("products").update(formattedProduct).eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert([formattedProduct]));
    }

    if (error) {
      console.error("Erro ao salvar produto:", error);
    } else {
      setShowModal(false);
      setEditingProduct(null);
      setNewProduct({ name: "", description: "", price: "", stock: "", image_url: "", category: "Alimentos", unit: "Unidade", is_on_sale: false, sale_price: "" });
      fetchProducts();
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirmDelete) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error("Erro ao excluir produto:", error);
    } else {
      setConfirmDelete(null);
      fetchProducts();
    }
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap">
            <button onClick={() => setActiveTab("products")} className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${activeTab === "products" ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Produtos
            </button>
            <button onClick={() => setActiveTab("orders")} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "orders" ? "border-primary-500 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
              Pedidos
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "products" ? (
        <>
          <button onClick={() => setShowModal(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
            + Adicionar Produto
          </button>

          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Nome</th>
                <th className="border p-2">Preço</th>
                <th className="border p-2">Estoque</th>
                <th className="border p-2">Promoção?</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">R$ {product.price.toFixed(2)}</td>
                  <td className="border p-2">{product.stock}</td>
                  <td className="border p-2">{product.is_on_sale ? "Sim" : "Não"}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditProduct(product)}>✏️</button>
                    <button onClick={() => setConfirmDelete(product.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">{order.customer_name}</td>
                <td className="border p-2">R$ {order.total.toFixed(2)}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">{new Date(order.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <form onSubmit={handleAddOrUpdateProduct} className="flex flex-col gap-4">

              {/* Nome */}
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
                placeholder="Nome do Produto"
                className="border p-2 rounded"
              />

              {/* Descrição */}
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Descrição"
                className="border p-2 rounded"
              />

              {/* Preço */}
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
                placeholder="Preço"
                className="border p-2 rounded"
              />

              {/* Estoque */}
              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
                placeholder="Estoque"
                className="border p-2 rounded"
              />

              {/* URL da Imagem */}
              <input
                type="text"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                placeholder="URL da Imagem"
                className="border p-2 rounded"
              />

              {/* Categoria */}
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="border p-2 rounded"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Unidade */}
              <select
                value={newProduct.unit}
                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                className="border p-2 rounded"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>

              {/* Está em promoção? */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newProduct.is_on_sale}
                  onChange={(e) => setNewProduct({ ...newProduct, is_on_sale: e.target.checked })}
                />
                Está em promoção?
              </label>

              {/* Preço Promocional (só aparece se estiver em promoção) */}
              {newProduct.is_on_sale && (
                <input
                  type="number"
                  value={newProduct.sale_price}
                  onChange={(e) => setNewProduct({ ...newProduct, sale_price: e.target.value })}
                  required={newProduct.is_on_sale}
                  placeholder="Preço Promocional"
                  className="border p-2 rounded"
                />
              )}

              {/* Botões */}
              <div className="flex justify-between">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Salvar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
