import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Family Task Tracker",
  description: "Household project request tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var k='family-task-tracker-theme';var s=typeof localStorage!='undefined'&&localStorage.getItem(k);var d=s==='dark'||(!s&&typeof matchMedia!='undefined'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.add(d?'dark':'light');var pk='family-task-tracker-color-palette';var ps=typeof localStorage!='undefined'&&localStorage.getItem(pk);if(ps==='ocean'||ps==='violet')document.documentElement.setAttribute('data-color-theme',ps);})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
