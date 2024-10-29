import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Security from "./_components/Securtiy";
import { ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { ThemeProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Godara's Study Platform",
  description: "Buy Now",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <Toaster />
      <EdgeStoreProvider>
      <body className={inter.className}>
          <Security />
          {children}
      </body>  
      </EdgeStoreProvider>
      </ThemeProvider>
    </html>
    </ClerkProvider>
  );
}