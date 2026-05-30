import type { Metadata } from "next";
import { Inter, Source_Serif_4, Anybody } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
});

const anybody = Anybody({
  subsets: ["latin"],
  variable: "--font-anybody",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "VaultMind — Segundo Cérebro",
  description: "Seu segundo cérebro inteligente, conectado ao seu Obsidian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${sourceSerif.variable} ${anybody.variable} h-full antialiased`}
    >
      <body className="flex h-screen w-full overflow-hidden font-ui text-on-surface">
        {children}
      </body>
    </html>
  );
}
