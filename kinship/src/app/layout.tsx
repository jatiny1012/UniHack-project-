import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kinship — Find your people before you need them",
  description:
    "AI-powered neighbourhood emergency resilience platform. Share what you can offer and need in emergencies. Stay connected when the internet can't.",
  themeColor: "#1B4F72",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-warmWhite text-gray-900 antialiased">
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "12px",
              background: "#2C3E50",
              color: "#fff",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
