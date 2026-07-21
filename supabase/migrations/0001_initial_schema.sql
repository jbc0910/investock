-- 1. Create tables
CREATE TABLE IF NOT EXISTS negocios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  propietario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(negocio_id, nombre)
);

CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  imagen_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Negocios: El propietario puede ver, insertar, actualizar y borrar su propio negocio.
CREATE POLICY "Acceso_Privado_Negocios_Select" ON negocios FOR SELECT USING (auth.uid() = propietario_id);
CREATE POLICY "Acceso_Privado_Negocios_Insert" ON negocios FOR INSERT WITH CHECK (auth.uid() = propietario_id);
CREATE POLICY "Acceso_Privado_Negocios_Update" ON negocios FOR UPDATE USING (auth.uid() = propietario_id);
CREATE POLICY "Acceso_Privado_Negocios_Delete" ON negocios FOR DELETE USING (auth.uid() = propietario_id);

-- Categorias: Solo pueden ser accedidas por el propietario del negocio
CREATE POLICY "Acceso_Privado_Categorias" ON categorias FOR ALL USING (
  auth.uid() IN (SELECT propietario_id FROM negocios WHERE id = categorias.negocio_id)
);

-- Productos: Solo pueden ser accedidos por el propietario del negocio
CREATE POLICY "Acceso_Privado_Productos" ON productos FOR ALL USING (
  auth.uid() IN (SELECT propietario_id FROM negocios WHERE id = productos.negocio_id)
);
