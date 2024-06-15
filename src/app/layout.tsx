import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans, Schibsted_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layouts/Navbar";
import Container from "@/components/ui/container";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layouts/Footer";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const grotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Nivabit",
  description: "Your home of innovation and solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className='scroll-smooth animate-out'
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen font-sans selection:text-gray-50 selection:bg-primary",
          fontSans.variable,
          grotesk.variable
        )}
      >
        <Container>
          <Navbar />
        </Container>
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
