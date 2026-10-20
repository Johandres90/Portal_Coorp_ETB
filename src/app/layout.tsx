import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ETB Agile Studio | User Story AI Agent (Google Enterprise Style)",
  description:
    "Herramienta interna de agilidad para Product Owners y Scrum Masters de ETB. Creación asistida por IA de Historias de Usuario con BDD Gherkin y formato Connextra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col font-sans bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}
