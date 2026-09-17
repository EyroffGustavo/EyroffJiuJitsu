import type { Metadata } from "next";
import "./globals.css";
import "./admin.css";
import "./filters.css";
import "./brand-logo.css";
import "./testimonials.css";
import "./privacy.css";

export const metadata: Metadata = {
  title: "Eyroff Escola de Jiu Jitsu",
  description: "Jiu Jitsu adulto e kids na Escola Eyroff.",
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
