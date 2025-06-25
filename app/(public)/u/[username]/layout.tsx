
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Public Link in Bio",
  description: "Public Link in Bio",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <main className="max-w-7xl lg:mx-auto pt-10 px-4 xl:px-0">
          {children}
        </main>
      </div>
  );
}
