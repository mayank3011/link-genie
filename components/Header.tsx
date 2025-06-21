"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, SignInButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 xl:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-purple-600">
          Linkify
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors"
          >
            Testimonials
          </Link>

          <Authenticated>
            <div className="flex gap-2 items-center bg-white/50 backdrop-blur-sm border border-white/20 p-2 rounded-lg">
              {/* Add Link */}
              <Link
                href="/dashboard/new-link"
                className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </Link>

              {/* Billing Button */}
              <Button
                asChild
                variant="outline"
                className="border-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-600 hover:text-white"
              >
                <Link href="/dashboard/billing">Billing</Link>
              </Button>

              {/* User Button */}
              <UserButton afterSignOutUrl="/" />
            </div>
          </Authenticated>

          <Unauthenticated>
            <SignInButton mode="modal">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:border-purple-700 hover:bg-purple-600 hover:text-white"
              >
                Login
              </Button>
            </SignInButton>
          </Unauthenticated>
        </nav>
      </div>
    </header>
  );
}
