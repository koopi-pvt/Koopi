import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koopi",
  description: "Build Your Store, Command by Command.",
};

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "si" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // App Router may provide params as a Promise — await before accessing
  params: Promise<{ locale: string }>;
}) {
  // Await params to comply with Next.js async dynamic APIs
  const resolved = await params;
  const locale = resolved.locale;
  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}