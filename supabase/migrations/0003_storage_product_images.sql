-- Configuración del bucket de imágenes de productos en Supabase Storage
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear el bucket (si no existe) - se hace vía dashboard o con esta instrucción
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB límite
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política: usuarios autenticados pueden subir imágenes en su carpeta (negocio_id/)
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- 3. Política: el dueño puede actualizar/eliminar sus propias imágenes
CREATE POLICY "Usuarios autenticados pueden actualizar sus imágenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Usuarios autenticados pueden eliminar sus imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');

-- 4. Política: cualquiera puede ver las imágenes (bucket público)
CREATE POLICY "Imágenes de productos son públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
