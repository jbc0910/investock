-- Migración: reemplazar columna precio por descripcion en la tabla productos
-- Ejecutar SOLO si ya ejecutaste la migración 0001 con la columna precio

ALTER TABLE productos 
  DROP COLUMN IF EXISTS precio,
  ADD COLUMN IF NOT EXISTS descripcion TEXT;
