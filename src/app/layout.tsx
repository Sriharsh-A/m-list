import type { Metadata } from "next";
import "./globals.css"; // THIS LINE IS CRUCIAL

export const metadata: Metadata = {
  title: "M List",
  description: "High Performance Productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}