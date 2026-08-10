import type { Metadata } from "next";
import "./globals.css";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminTopbar from "@/components/layout/AdminTopbar";

export const metadata: Metadata = {
  title: "ALIF Admin Portal",
  description: "Administrative portal for Al-Ibaanah Islamic Foundation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen overflow-hidden bg-gray-50">
          <AdminSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminTopbar />
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
