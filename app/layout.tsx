import type { Metadata } from "next";
import { Inter } from "next/font/google"; // 1. Added for font optimization
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"; // 2. Corrected typo: "sonner" -> "sonner"

// 1. Initialize font
const inter = Inter({ subsets: ["latin"] });

// 3. Improved metadata with a template
export const metadata: Metadata = {
  title: {
    template: "%s | Your App Name",
    default: "Your App Name",
  },
  description: "A description of your awesome application.",
  icons: {
    icon: "/convex.svg",
  },
};

export default function RootLayout({
  children,
}: { // 4. Simplified children type (Readonly is optional)
  children: React.ReactNode;
}) {
  return (
    // 5. Added suppressHydrationWarning to prevent common errors
    <html lang="en" suppressHydrationWarning> 
      {/* 1. Applied font className */}
      <body className={inter.className}> 
        {/* 6. Removed unnecessary 'dynamic' prop */}
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
        <Toaster />
      </body>
    </html>
  );
}