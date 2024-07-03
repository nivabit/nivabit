import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans, Schibsted_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layouts/Navbar";
import Container from "@/components/ui/container";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layouts/Footer";
import localFont from "next/font/local";

const synonym = localFont({
  src: "../../public/Synonym/141d0930d88f0321d415e423e22c8883.ttf",
  variable: "--font-synonym",
});

const grotesk = localFont({
  src: "../../public/grotek_font/CabinetGrotesk-Variable.ttf",
  variable: "--font-grotesk",
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
          "min-h-screen  selection:text-gray-50 selection:bg-primary font-synonym",
          synonym.variable,
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
