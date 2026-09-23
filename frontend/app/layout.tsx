import "./globals.css";

export const metadata = {
  title: "Nirvana Space | Premium Real Estate",
  description:
    "Buy, rent, resale and invest in residential, commercial, plots and Gift City properties.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}