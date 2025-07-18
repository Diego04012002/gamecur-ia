import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GameCurious - Curiosidades Gaming IA",
  description: "Descubre datos fascinantes del mundo de los videojuegos generados por IA cada día",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@300;400;500;600;700;800&family=Rajdhani:wght@300;400;500;600;700&family=Audiowide&family=Press+Start+2P&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <link rel="icon" type="image/svg+xml" href="gampepad.svg" />
      <body>{children}</body>
    </html>
  );
}
