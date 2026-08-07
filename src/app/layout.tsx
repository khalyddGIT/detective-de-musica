import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Detective de Música | Adivina la canción por pistas",
  description: "Juego interactivo de adivinanza de canciones con pistas progresivas y muestra de audio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-[#090d16] text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
