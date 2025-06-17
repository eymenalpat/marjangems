import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marjan Gems - Değerli Taşlar ve Mücevherler",
  description: "Elmas, yakut, safir, zümrüt gibi değerli taşların satışı. Kaliteli mücevherler ve değerli taşlar için Marjan Gems'e uğrayın.",
  keywords: "değerli taşlar, elmas, yakut, safir, zümrüt, mücevher, taş satışı, istanbul",
  authors: [{ name: "Marjan Gems" }],
  creator: "Marjan Gems",
  publisher: "Marjan Gems",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://marjangems.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Marjan Gems - Değerli Taşlar ve Mücevherler",
    description: "Elmas, yakut, safir, zümrüt gibi değerli taşların satışı. Kaliteli mücevherler ve değerli taşlar için Marjan Gems'e uğrayın.",
    url: "https://marjangems.vercel.app",
    siteName: "Marjan Gems",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marjan Gems - Değerli Taşlar",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marjan Gems - Değerli Taşlar ve Mücevherler",
    description: "Elmas, yakut, safir, zümrüt gibi değerli taşların satışı.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Marjan Gems",
              "url": "https://marjangems.vercel.app",
              "logo": "https://marjangems.vercel.app/images/logo.png",
              "description": "Değerli taşlar ve mücevher satışı yapan güvenilir firma",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "İstanbul",
                "addressCountry": "TR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+90-555-555-5555",
                "contactType": "customer service",
                "availableLanguage": "Turkish"
              },
              "sameAs": [
                "https://www.facebook.com/marjangems",
                "https://www.instagram.com/marjangems"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
