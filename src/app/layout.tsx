import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layouts/Navbar";
import Container from "@/components/ui/container";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans selection:text-gray-50 selection:bg-blue-900",
          fontSans.variable
        )}
      >
        <Container>
          <Navbar />
        </Container>
        {children}
      </body>
    </html>
  );
}
