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
      <body className="antialiased bg-[#b49dff] text-[#0b0b0e] min-h-screen selection:bg-[#facc15] selection:text-[#0b0b0e]">
        {children}
      </body>
    </html>
  );
}
