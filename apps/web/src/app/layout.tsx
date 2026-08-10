import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://alif.ng";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Al-Ibaanah Islamic Foundation (ALIF) | Da'wah · Education · Community",
    template: "%s | ALIF",
  },
  description:
    "Al-Ibaanah Islamic Foundation (ALIF) is dedicated to propagating authentic Islam according to the Qur'an and Sunnah upon the understanding of the Salaf. Islamic education, Da'wah, hostel management, and community development.",
  keywords: [
    "Al-Ibaanah Islamic Foundation",
    "ALIF",
    "Islamic Foundation Nigeria",
    "Da'wah",
    "Islamic education",
    "Qur'an learning",
    "Tajweed",
    "Arabic language",
    "Salafi dawah",
    "Islamic hostel",
    "Islamic community",
    "Ahlus Sunnah",
  ],
  authors: [{ name: "Al-Ibaanah Islamic Foundation", url: BASE_URL }],
  creator: "Al-Ibaanah Islamic Foundation",
  publisher: "Al-Ibaanah Islamic Foundation",
  category: "Religion",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "Al-Ibaanah Islamic Foundation (ALIF)",
    description:
      "Propagating authentic Islam through education, Da'wah, and community development.",
    url: BASE_URL,
    siteName: "Al-Ibaanah Islamic Foundation",
    images: [
      {
        url: "/assets/alif-og.png",
        width: 1200,
        height: 630,
        alt: "Al-Ibaanah Islamic Foundation",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Ibaanah Islamic Foundation (ALIF)",
    description: "Propagating authentic Islam through education, Da'wah & community development.",
    images: ["/assets/alif-og.png"],
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
  icons: [
    { media: "(prefers-color-scheme: light)", url: "/icon-light.png", href: "/icon-light.png" },
    { media: "(prefers-color-scheme: dark)", url: "/icon-dark.png", href: "/icon-dark.png" },
    { rel: "apple-touch-icon", url: "/icon-light.png" },
  ],
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f5132" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased scroll-smooth font-sans"
      )}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:wght@400;700&family=Inter:wght@100..900&family=Outfit:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NGO",
              name: "Al-Ibaanah Islamic Foundation",
              alternateName: ["ALIF", "Al-Ibaanah"],
              url: BASE_URL,
              description:
                "Al-Ibaanah Islamic Foundation (ALIF) propagates authentic Islam through education, Da'wah, and community development.",
              foundingDate: "2010",
              areaServed: "Nigeria",
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "General Enquiry",
                availableLanguage: ["English", "Arabic", "Yoruba", "Hausa"],
                url: `${BASE_URL}/contact`,
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
