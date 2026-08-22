import type { Metadata } from "next";
import { Manrope, Unbounded } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SmartZno - онлайн-підготовка до НМТ",
  description:
    "Когорти, куратор, авторський варіант НМТ і підписка від 990 ₴/міс за предмет. Діагностика рівня перед стартом.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="bg-night">
      <body className={`${display.variable} ${sans.variable} bg-night text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
