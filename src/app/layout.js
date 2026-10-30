import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "./site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_TITLE, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  keywords: [
    "Giulia Tufariello", "Tufariello", "ephemeral architecture", "set design", "installation design",
    "lighting design", "exhibition design", "product design", "designer Barcelona", "portfolio",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    firstName: "Giulia",
    lastName: "Tufariello",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Giulia Tufariello — ledsc4, Milan" }],
  },
  twitter: { card: "summary_large_image", title: SITE_TITLE, description: SITE_DESCRIPTION, images: ["/og.jpg"] },
};

// Ficha de persona para Google (datos estructurados)
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Giulia Tufariello",
  url: SITE_URL,
  image: `${SITE_URL}/og.jpg`,
  jobTitle: "Designer — Ephemeral Architecture & Set Design",
  email: "mailto:giuliat97@hotmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Elisava, Pompeu Fabra University" },
    { "@type": "CollegeOrUniversity", name: "Università IUAV di Venezia" },
  ],
  knowsAbout: ["Ephemeral architecture", "Set design", "Installation design", "Lighting design", "Product design", "3D design", "Rendering"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,200;0,300;0,400;1,300&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body className="antialiased">
        {/* Texto que leen Google y los lectores de pantalla; en pantalla se ve el diseño de siempre */}
        <div className="sr-only">
          <h1>Giulia Tufariello</h1>
          <p>Ephemeral architecture, set design, installations, lighting and product design. Barcelona.</p>
          <p>
            I&apos;m involved in a thin limbo, between design and architecture, the ephemeral, which follows the steps of the
            continuous changes. I am fascinated by the studies of spaces and by the infinite possibilities of action, from the
            research passing through site-specific projects to art installations in a dynamic way of designing, ranging in its
            different fields.
          </p>
        </div>
        {children}
      </body>
    </html>
  );
}
