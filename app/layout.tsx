import type { Metadata } from "next";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/900.css";
import "@fontsource/barlow-condensed/900-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import "./admin.css";
import "./filters.css";
import "./brand-logo.css";
import "./testimonials.css";
import "./privacy.css";
import "./survey.css";
import "./teacher.css";

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
