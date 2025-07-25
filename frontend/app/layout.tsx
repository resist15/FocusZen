import type { Metadata } from "next";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "FocusZen",
  description: "Track your productivity and mindfulness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
