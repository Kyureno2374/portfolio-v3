import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/widgets/header";

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
      <body className="antialiased bg-background dark:bg-dark-bg text-primary dark:text-dark-primary transition-colors duration-300">
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
