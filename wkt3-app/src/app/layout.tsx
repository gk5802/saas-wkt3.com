import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "WKT3 — Trading & Games",
  description: "AI trading + games platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <Header />
        <main className="max-w-6xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
