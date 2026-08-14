import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/marketing/Navbar";
import { Footer } from "@/components/marketing/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Wishora — Turn a simple wish into a magical moment",
    template: "%s | Wishora",
  },
  description:
    "Create beautiful, animated, personalized wishes for birthdays, anniversaries, weddings, festivals, and every special occasion. Share the magic with a unique link.",
  keywords: [
    "wishes",
    "birthday wishes",
    "anniversary wishes",
    "greeting cards",
    "personalized wishes",
    "animated greetings",
    "online wishes",
    "digital cards",
    "wishora",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wishora.app",
    siteName: "Wishora",
    title: "Wishora — Turn a simple wish into a magical moment",
    description:
      "Create beautiful, animated, personalized wishes for every special occasion. Share the magic with a unique link.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wishora - Personalized Animated Wishes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishora — Turn a simple wish into a magical moment",
    description:
      "Create beautiful, animated, personalized wishes for every special occasion.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="hsl(320, 60%, 30%)" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
