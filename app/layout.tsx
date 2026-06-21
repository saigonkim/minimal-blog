import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { blogConfig } from "@/blog.config";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(blogConfig.siteUrl),
  title: {
    default: blogConfig.title,
    template: `%s | ${blogConfig.title}`,
  },
  description: blogConfig.description,
  openGraph: {
    title: blogConfig.title,
    description: blogConfig.description,
    url: blogConfig.siteUrl,
    siteName: blogConfig.title,
    locale: blogConfig.seo.locale,
    type: 'website',
    images: [
      {
        url: blogConfig.seo.defaultOgImage,
        width: 1200,
        height: 630,
        alt: blogConfig.title,
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: blogConfig.title,
    description: blogConfig.description,
    images: [blogConfig.seo.defaultOgImage],
  },
  verification: {
    google: blogConfig.verification.google,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5]">
        <ThemeProvider
          attribute="class"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          {/* Header */}
          <header className="sticky top-0 z-40 w-full border-b border-neutral-850 bg-[#09090b]/80 backdrop-blur-md transition-all duration-300">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                    {blogConfig.title}
                  </span>
                </Link>

                {/* Actions */}
                <nav className="flex items-center gap-4">
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-neutral-400 hover:text-neutral-100 transition-colors"
                  >
                    관리자
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 w-full mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-neutral-900 bg-[#09090b] py-6 transition-all duration-300">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <p className="text-xs text-neutral-400">
                &copy; {new Date().getFullYear()} {blogConfig.title}. All rights reserved.
              </p>
              <p className="text-xs text-neutral-500">
                Built with <span className="text-violet-400">Next.js</span> &amp; <span className="text-violet-400">Tailwind CSS</span>
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

