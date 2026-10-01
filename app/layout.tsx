import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Typescript Lab",
  description: "900 exercícios de TypeScript para aprender praticando, com dicas e acompanhamento do seu aprendizado.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
