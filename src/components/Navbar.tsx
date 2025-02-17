import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useCartStore from "../stores/cartStore";

export function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            DALAROSA
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary-600"
            >
              Produtos
            </Link>
            <Link to="/offers" className="text-gray-700 hover:text-primary-600">
              Ofertas
            </Link>
            <Link
              to="/butchery"
              className="text-gray-700 hover:text-primary-600"
            >
              Açougue
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600">
              Sobre
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-primary-600"
            >
              Contato
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-primary-600" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative p-2 text-gray-700 hover:text-primary-600"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
            {!isOpen && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <Link
              to="/products"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Produtos
            </Link>
            <Link
              to="/offers"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Ofertas
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              Contato
            </Link>
            <Link
              to="/cart"
              className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
              onClick={() => setIsOpen(false)}
            >
              <ShoppingCartIcon className="h-6 w-6" />
              <span>Carrinho</span>
              {itemCount > 0 && (
                <span className="ml-1 bg-secondary-500 text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
