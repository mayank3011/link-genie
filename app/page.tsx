// app/page.tsx or app/(home)/page.tsx

import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Palette, Star } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { auth } from "@clerk/nextjs/server";
import React from "react";

// Feature items
const features = [
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Fully Customizable",
    description:
      "Make your Link Page uniquely yours with custom themes, colors, and layouts that match your brand.",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Analytics Insights",
    description:
      "Track link performance, see visitor stats, and optimize your content strategy with powerful analytics.",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Drag & Drop Builder",
    description:
      "Easily arrange and organize your content using a visual drag-and-drop interface.",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Mobile Optimized",
    description:
      "Your Linkify page looks great on any device, offering a seamless experience for your audience.",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Fast & Secure",
    description:
      "Built for speed with enterprise-grade security. Your data and audience are safe.",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Custom Domains",
    description:
      "Connect your own domain for a fully branded experience and better recognition.",
  },
];

// Testimonials
const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Content Creator",
    content: "Linkify transformed how I share my content.",
    rating: 5,
  },
  {
    name: "Mike Smith",
    role: "Business Owner",
    content: "Linkify is a game changer for my business.",
    rating: 5,
  },
  {
    name: "Jane Doe",
    role: "Influencer",
    content: "I love how easy it is to use Linkify.",
    rating: 5,
  },
  {
    name: "John Doe",
    role: "Artist",
    content: "Linkify helped me showcase my art beautifully.",
    rating: 5,
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <div className="pt-24">
        {/* Hero Section */}
        <section className="px-4 lg:px-8 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                One Link,
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {" "}
                  Infinite Possibilities
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto" />
            </div>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create a beautiful, customizable Link-in-bio page that showcases all your important links. Perfect for creators, businesses, and anyone who wants to share multiple links effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-500 hover:to-purple-700 text-lg px-8 py-6 h-auto"
              >
                <Link href="/dashboard">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-purple-600 text-purple-600 hover:bg-purple-500 hover:text-white text-lg px-8 py-6 h-auto"
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </div>
            <div className="pt-12">
              <p className="text-sm text-gray-500 mb-4">
                Trusted by 10,000+ Creators Worldwide
              </p>
              <div className="flex justify-center items-center opacity-60 gap-8 text-2xl font-bold text-gray-400">
                <div>Creator</div>
                <div>Business</div>
                <div>Influencer</div>
                <div>Artist</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you share your content and grow your audience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="text-purple-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-4 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved By Creators
            </h2>
            <p className="text-xl text-gray-600">See what our users are saying about Linkify</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="px-4 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-12 lg:p-16 text-center shadow-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of creators and businesses using Linkify to share their content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold"
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Create Your Linkify
                  </Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 opacity-80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Free to Start
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  No Credit Card Required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Set Up in 15 Seconds
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 px-4 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-4">Linkify</div>
              <p className="text-gray-600">
                The easiest way to share your links in one place. Create a beautiful, customizable link-in-bio page.
              </p>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 mb-4">Explore</h4>
                <div className="space-y-2 text-gray-600">
                  <Link href="#">About</Link>
                  <Link href="#">Blog</Link>
                  <Link href="#">Careers</Link>
                  <Link href="#">Contact</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; 2025 Armus Digital. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
