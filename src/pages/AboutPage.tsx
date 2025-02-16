export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Sobre o DALAROSA</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
          <p className="text-gray-600 mb-4">
            O Supermercado DALAROSA é uma empresa familiar que há mais de 20 anos
            serve a comunidade com produtos de qualidade e preços justos. Nossa
            jornada começou com uma pequena mercearia e, graças à confiança de
            nossos clientes, crescemos para nos tornar uma referência no bairro.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Missão</h2>
          <p className="text-gray-600 mb-4">
            Oferecer produtos de qualidade com preços justos, proporcionando uma
            experiência de compra agradável e conveniente para nossos clientes.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Valores</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Compromisso com a qualidade</li>
            <li>Atendimento humanizado</li>
            <li>Respeito ao cliente</li>
            <li>Preços justos</li>
            <li>Responsabilidade social</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Horário de Funcionamento</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="mb-2">
              <strong>Segunda a Sábado:</strong> 08:00 às 20:00
            </p>
            <p>
              <strong>Domingos e Feriados:</strong> 08:00 às 18:00
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Formas de Pagamento</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ul className="grid grid-cols-2 gap-4">
              <li>Dinheiro</li>
              <li>Cartão de Crédito</li>
              <li>Cartão de Débito</li>
              <li>PIX</li>
              <li>Vale Alimentação</li>
              <li>Vale Refeição</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}