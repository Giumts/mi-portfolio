// Datos del sitio que usan Google y las redes al mostrar la web.
// Si compras un dominio propio, ponlo en la variable NEXT_PUBLIC_SITE_URL de Vercel.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

export const SITE_NAME = "Giulia Tufariello";
export const SITE_TITLE = "Giulia Tufariello — Ephemeral Architecture & Set Design";
export const SITE_DESCRIPTION =
  "Giulia Tufariello, designer based in Barcelona working between design and architecture: ephemeral architecture, set design, installations, lighting and product design.";
