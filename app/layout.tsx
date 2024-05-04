import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/tierListBuilder/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Tier List - Create, Share, and Rerank Tier Lists",
  description:
    "CreateTierList.com enables users to create and share custom tier lists across various categories. Our platform allows for easy customization, community sharing, and the ability to rerank existing lists. Join to explore and contribute to diverse rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Analytics/>
        </ThemeProvider>
      </body>
    </html>
  );
}
