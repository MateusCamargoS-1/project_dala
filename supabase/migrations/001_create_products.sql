CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    is_on_sale BOOLEAN DEFAULT FALSE,
    sale_price NUMERIC(10,2),
    category TEXT NOT NULL,
    image_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Índice para busca rápida por categoria e produtos em destaque
CREATE INDEX idx_products_category ON public.products (category);
CREATE INDEX idx_products_featured ON public.products (is_featured);
