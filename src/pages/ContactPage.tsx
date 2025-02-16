import { useState } from 'react'
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa'

export function ContactPage() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const whatsappMessage = `*Contato via Site - DALAROSA*\n\n` +
      `*Nome:* ${name}\n\n` +
      `*Mensagem:*\n${message}`

    window.open(
      `https://wa.me/55449?text=${encodeURIComponent(whatsappMessage)}`,
      '_blank'
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-bold text-center text-gray-900 mb-12">Entre em Contato</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Seção do WhatsApp */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Atendimento via WhatsApp</h2>
          <p className="text-gray-600 mb-6">
            Fale conosco diretamente pelo WhatsApp para dúvidas, pedidos e informações.
          </p>
          <a
            href="https://wa.me/5544999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            <FaWhatsapp className="mr-2 text-2xl" />
            Falar pelo WhatsApp
          </a>
        </div>

        {/* Formulário de contato */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Envie uma Mensagem</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Mensagem
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                rows={5}
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
              Enviar pelo WhatsApp
            </button>
          </form>
        </div>
      </div>

      {/* Localização */}
      <div className="bg-white shadow-lg rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaMapMarkerAlt className="mr-2 text-red-500" />
          Nossa Localização
        </h2>
        <p className="text-gray-600 mb-6">
          Estamos localizados no <strong>Jardim Tropical I, Campo Mourão - PR</strong>.
        </p>
        <div className="overflow-hidden rounded-lg shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.0572465057326!2d-52.3709863!3d-24.040624899999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd6f1775f9a7d%3A0x8e2d12b5b8b5f86b!2sJardim%20Tropical%20I%2C%20Campo%20Mour%C3%A3o%20-%20PR!5e0!3m2!1spt-BR!2sbr!4v1708027854784!5m2!1spt-BR!2sbr"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  )
}
