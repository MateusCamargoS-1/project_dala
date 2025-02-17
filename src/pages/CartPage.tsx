import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../lib/supabase";
import useCartStore from "../stores/cartStore";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const handleCheckout = async () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const { error } = await supabase.from("orders").insert([
      {
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: customerAddress,
        total: getTotal().toFixed(2),
        total_amount: getTotal().toFixed(2),
        items: items,
      },
    ]);

    if (error) {
      toast.error("Erro ao finalizar pedido");
      console.error("Erro ao finalizar pedido:", error);
      return;
    }

    const message = `*Novo Pedido - DALAROSA*%0A%0A` +
      `*Cliente:* ${customerName}%0A` +
      `*Telefone:* ${customerPhone}%0A` +
      `*Endereço:* ${customerAddress}%0A%0A` +
      `*Itens do Pedido:*%0A` +
      items.map(item =>
        `- ${item.name}%0A  Quantidade: ${item.quantity}%0A  Preço: R$ ${(item.price * item.quantity).toFixed(2)}`
      ).join("%0A%0A") +
      `%0A%0A*Total do Pedido:* R$ ${getTotal().toFixed(2)}`;

    const whatsappUrl = `https://wa.me/+5544998435831?text=${message}`;
    window.open(whatsappUrl, "_blank");

    clearCart();
    toast.success("Pedido enviado com sucesso!");

    console.log("Mensagem para WhatsApp:", message);

  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h2>
          <p className="text-gray-600">Adicione alguns produtos para começar suas compras!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
      <h1 className="text-3xl font-bold mb-8">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-md mb-4">
              <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">R$ {item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="btn-secondary px-2 py-1">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="btn-secondary px-2 py-1">+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">Remover</button>
            </div>
          ))}

          <div className="text-right mt-4">
            <p className="text-2xl font-bold">Total: R$ {getTotal().toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Informações de Entrega</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input type="text" id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="input mt-1" required />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input type="tel" id="phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="input mt-1" required />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Endereço de Entrega</label>
              <textarea id="address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="input mt-1" rows={3} required />
            </div>

            <button onClick={handleCheckout} className="w-full btn-primary py-3 text-lg">Finalizar Pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}
