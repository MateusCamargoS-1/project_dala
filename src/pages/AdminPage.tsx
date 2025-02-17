import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

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

  const categories = [
    "Açougue",
    "Hortifruti",
    "Padaria",
    "Frios e Laticínios",
    "Bebidas",
    "Mercearia",
    "Matinais",
    "Doces e Sobremesas",
    "Congelados",
    "Higiene e Beleza",
    "Limpeza",
    "Pet Shop",
    "Bazar e Utilidades",
    "Bebês",
    "Saudáveis e Naturais",
    "Suplementos",
  ];
  const units = ["Unidade", "Kg", "Litro", "Pacote", "Caixa"];
  const orderStatuses = ["Pendente", "Em Andamento", "Finalizado", "Cancelado"];

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
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
      sale_price: newProduct.is_on_sale
        ? parseFloat(newProduct.sale_price)
        : null,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase
        .from("products")
        .update(formattedProduct)
        .eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert([formattedProduct]));
    }

    if (error) {
      console.error("Erro ao salvar produto:", error);
    } else {
      setShowModal(false);
      setEditingProduct(null);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        image_url: "",
        category: "",
        unit: "Unidade",
        is_on_sale: false,
        sale_price: "",
      });
      fetchProducts();
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productToDelete.id);
      if (error) {
        console.error("Erro ao excluir produto:", error);
      } else {
        setProductToDelete(null);
        setShowDeleteModal(false);
        fetchProducts();
      }
    }
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderToDelete.id);
      if (error) {
        console.error("Erro ao excluir pedido:", error);
      } else {
        setOrderToDelete(null);
        setShowDeleteOrderModal(false);
        fetchOrders();
      }
    }
  };

  const handleChangeOrderStatus = async (
    orderId: number,
    newStatus: string
  ) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) {
      console.error("Erro ao alterar status do pedido:", error);
    } else {
      fetchOrders();
    }
  };

  if (loading) return <div className="text-center py-10">Carregando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap">
            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-medium text-sm mr-8 ${
                activeTab === "products"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pedidos
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "products" ? (
        <>
          <button
            onClick={() => setShowModal(true)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
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
                <tr key={product.id} className="text-center">
                  <td className="border p-2">{product.name}</td>
                  <td className="border p-2">R$ {product.price.toFixed(2)}</td>
                  <td className="border p-2">{product.stock}</td>
                  <td className="border p-2">
                    {product.is_on_sale ? "Sim" : "Não"}
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleEditProduct(product)}>
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        setProductToDelete(product);
                        setShowDeleteModal(true);
                      }}
                    >
                      🗑️
                    </button>
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
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Alterar Status</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              let statusColor = "";
              switch (order.status) {
                case "Pendente":
                  statusColor = "bg-yellow-100";
                  break;
                case "Em Andamento":
                  statusColor = "bg-blue-100";
                  break;
                case "Finalizado":
                  statusColor = "bg-green-100";
                  break;
                case "Cancelado":
                  statusColor = "bg-red-100";
                  break;
                default:
                  statusColor = "bg-gray-100";
                  break;
              }

              return (
                <tr key={order.id} className={`text-center ${statusColor}`}>
                  <td className="border p-2">{order.customer_name}</td>
                  <td className="border p-2">R$ {order.total.toFixed(2)}</td>
                  <td className={`border p-2`}>{order.status}</td>
                  <td className="border p-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleChangeOrderStatus(order.id, e.target.value)
                      }
                      className="border p-2 rounded"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => {
                        setOrderToDelete(order);
                        setShowDeleteOrderModal(true);
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir este produto?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProduct}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteOrderModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir este pedido?</p>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setShowDeleteOrderModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteOrder}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "Editar Produto" : "Adicionar Produto"}
            </h2>
            <form
              onSubmit={handleAddOrUpdateProduct}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                required
                placeholder="Nome do Produto"
                className="border p-2 rounded"
              />

              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                placeholder="Descrição"
                className="border p-2 rounded"
              />

              <input
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                required
                placeholder="Preço"
                className="border p-2 rounded"
              />

              <input
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                required
                placeholder="Estoque"
                className="border p-2 rounded"
              />

              <select
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="border p-2 rounded"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={newProduct.unit}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, unit: e.target.value })
                }
                className="border p-2 rounded"
              >
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newProduct.is_on_sale}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      is_on_sale: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                Em promoção
              </label>

              {newProduct.is_on_sale && (
                <input
                  type="number"
                  value={newProduct.sale_price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sale_price: e.target.value })
                  }
                  placeholder="Preço promocional"
                  className="border p-2 rounded"
                />
              )}

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingProduct ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
