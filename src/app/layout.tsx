import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HelpRadar — Local Community Support",
  description: "Your neighbourhood's helping hand. Find and offer help, report lost items, coordinate blood donations.",
  keywords: ["community help", "local support", "blood donation", "lost and found", "neighbourhood"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <Header />

        <main className="pt-16">
          {children}
        </main>

        {/* Refined Footer */}
        <footer className="mt-24 border-t border-stone-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="col-span-2">
                <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" fill="white" />
                  </div>
                  <span className="text-lg font-semibold text-stone-900">HelpRadar</span>
                </Link>
                <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
                  Connecting neighbours to help each other. Built for communities that care.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Platform</h4>
                <ul className="space-y-2.5">
                  <li><Link href="/" className="text-sm text-stone-600 hover:text-teal-600 transition-colors">Browse Requests</Link></li>
                  <li><Link href="/create" className="text-sm text-stone-600 hover:text-teal-600 transition-colors">Post Request</Link></li>
                  <li><Link href="/map" className="text-sm text-stone-600 hover:text-teal-600 transition-colors">Map View</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  <li><a href="#" className="text-sm text-stone-600 hover:text-teal-600 transition-colors">Privacy</a></li>
                  <li><a href="#" className="text-sm text-stone-600 hover:text-teal-600 transition-colors">Terms</a></li>
                  <li><a href="#" className="text-sm text-stone-600 hover:text-teal-600 transition-colors">Contact</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-stone-400">© 2024 HelpRadar. Made with care for communities.</p>
              <p className="text-xs text-stone-400">India</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
