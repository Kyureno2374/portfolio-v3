import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

export const metadata: Metadata = {
  title: "Портфолио | Kyureno",
  description: "Персональный сайт-портфолио разработчика",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Preload критичных ресурсов */}
        <link rel="preload" href="/logo.png" as="image" />
        <link rel="preload" href="/portfolio.jpg" as="image" />
        <link rel="preload" href="/oll.jpg" as="image" />
        {/* Prefetch страниц */}
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/skills" />
        <link rel="prefetch" href="/contact" />
      </head>
      <body className="antialiased bg-background dark:bg-dark-bg text-primary dark:text-dark-primary transition-colors duration-300">
        {process.env.NEXT_PUBLIC_YM_ID && (
          <noscript>
            <div>
              <img
                src={`https://mc.yandex.ru/watch/${process.env.NEXT_PUBLIC_YM_ID}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        )}
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
