import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Student Result Management System",
    template: "%s | SRMS",
  },
  description:
    "Professional student result management system with modern UI/UX, comprehensive analytics, and role-based access control.",
  keywords: [
    "student",
    "results",
    "management",
    "education",
    "grades",
    "academic",
    "school",
    "university",
  ],
  authors: [{ name: "SRMS Team" }],
  creator: "SRMS",
  publisher: "SRMS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://localhost:3000",
    title: "Student Result Management System",
    description:
      "Professional student result management system with modern UI/UX",
    siteName: "SRMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Result Management System",
    description:
      "Professional student result management system with modern UI/UX",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans h-full antialiased`}>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="system" storageKey="srms-theme">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: "toast-custom",
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                },
                success: {
                  iconTheme: {
                    primary: "#22c55e",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
                loading: {
                  iconTheme: {
                    primary: "#3b82f6",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
