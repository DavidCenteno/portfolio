import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { person } from "@/content/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const description =
  "Senior data professional in A Coruña, Spain, with 10+ years across analytics engineering, machine learning and product analytics. Builder of LLM-powered products.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${person.name} | ${person.role}`,
  description,
  authors: [{ name: person.name }],
  openGraph: {
    type: "profile",
    title: `${person.name} | ${person.role}`,
    description,
    siteName: person.name,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: person.name, description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f4ee" },
  ],
};

// Runs before paint so the stored theme never flashes. Dark is the default.
const themeScript = `try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: person.role,
  email: `mailto:${person.email}`,
  address: { "@type": "PostalAddress", addressLocality: "A Coruña", addressCountry: "ES" },
  alumniOf: "University of Santiago de Compostela",
  sameAs: [person.linkedin],
  knowsAbout: ["Analytics engineering", "Machine learning", "Product analytics", "dbt", "BigQuery", "LLM applications"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="noise min-h-dvh">{children}</body>
    </html>
  );
}
