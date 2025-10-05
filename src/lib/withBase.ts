// src/lib/withBase.ts
export function withBase(path: string) {
  const base = import.meta.env.BASE_URL ?? "/";
  // Asegurar que base termine con '/'
  const baseWithSlash = base.endsWith("/") ? base : `${base}/`;
  // Quitar slash inicial del path si lo tiene
  const p = path.startsWith("/") ? path.slice(1) : path;
  // Si path es vacío, devolvemos la base
  return `${baseWithSlash}${p}`;
}
