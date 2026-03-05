import React from "react";
import { ShoppingCart, Box, BarChart3, LogIn, Package } from "lucide-react";
import { AudienceCard, OfferCard, StepCard } from "./Cards";

const LandingPage = () => {
  return (
    <div className="bg-white text-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 pt-6">
        <div className="max-w-6xl mx-auto bg-black text-white rounded-full px-8 py-4 flex items-center justify-between shadow-md">
          <h1 className="text-2xl font-bold tracking-tight">
            apex<span className="text-zinc-400">.</span>
          </h1>

          <div className="hidden md:flex gap-8 font-medium">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#how">How it works</a>
          </div>

          <button className="bg-[#FFBC00] text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-300 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-40 py-20 grid md:grid-cols-2 gap-12 items-center text-center md:text-left" id="home">
        <div>
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Record <br /> Everything.
          </h2>

          <p className="mt-6 text-zinc-600 max-w-md">
            Smart, simple digital tools designed for busy SME owners. No
            accounting expertise required.
          </p>

          <button className="mt-6 bg-[#FFBC00] px-8 py-2 rounded-full border-2 border-black font-medium hover:bg-yellow-300 transition">
            Use apex
          </button>
        </div>

        <div className="relative flex justify-center">
          {/* Top floating icon */}
          <div className="absolute -top-4  -left-4 bg-white rounded-full w-24 h-24 flex items-center justify-center z-10">
            <div className="border-2 p-4 border-black ring-3 rounded-full flex items-center justify-center">
              <ShoppingCart className="text-black" size={26} />
            </div>
          </div>

          {/* Main Image */}
          <img
            src="/assets/hero-image.png"
            alt="business"
            className="rounded-[40px] object-cover w-full max-w-md h-[420px]"
          />

          {/* Bottom floating icon */}
          <div className="absolute -bottom-4 -right-4 bg-white rounded-full w-24 h-24 flex items-center justify-center">
            <div className="bg-black p-4 border-black ring-3 rounded-full flex items-center justify-center">
              <Package className="text-white" size={26} />
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-center mb-12">What we offer</h3>

        <div className="space-y-8">
          <OfferCard
            color="bg-[#FFCC3D]"
            title="Real-Time Sales & Expense Tracking"
            text="Record transactions in seconds and instantly see where your money is going. Whether it’s a daily sale, supplier payment, transfer, or unexpected expense, every transaction is captured and organized automatically."
          />

          <OfferCard
            color="bg-[#FF4DAC]"
            title="Smart Automation"
            text="Stop manual calculations and eliminate costly errors. Our smart system automatically tracks every transaction, categorizes income and expenses accurately, and updates your records in real time, giving you organized financial data, clear insights, and more time to focus on growing your business."
          />

          <OfferCard
            color="bg-[#AA5FFF]"
            title="Simple Financial Reports"
            text="Understand your business performance instantly with clean, easy-to-read dashboards that present your sales, expenses, and cash flow in a clear visual format. Make faster, smarter decisions using real-time data designed to give you confidence, clarity, and complete financial visibility."
          />
        </div>
      </section>

      {/* Who is this for */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-center mb-12">
          Who is this for
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <AudienceCard title="Small Shops" img="/assets/small-shops.jpg" />
          <AudienceCard
            title="Service Providers"
            img="/assets/service-providers.jpg"
          />
          <AudienceCard
            title="Retail Businesses"
            img="/assets/retail-business.jpg"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20" id="how">
        <h3 className="text-4xl font-bold text-center mb-12">How it works</h3>

        <div className="grid md:grid-cols-4 gap-6">
          <StepCard
            number="01"
            title="Login/Signup"
            icon="/assets/auth.png"
            description="Lorem ipsum dolor sit amet consectetur. Hendrerit habitant massa nulla"
          />
          <StepCard
            number="02"
            title="Add products"
            icon="/assets/add-products.png"
            description="Lorem ipsum dolor sit amet consectetur. Hendrerit habitant massa nulla"
          />
          <StepCard
            number="03"
            title="Record Sales"
            icon="/assets/record-sales.png"
            description="Lorem ipsum dolor sit amet consectetur. Hendrerit habitant massa nulla"
          />
          <StepCard
            number="04"
            title="Analyze Data"
            icon="/assets/analytics.png"
            description="Lorem ipsum dolor sit amet consectetur. Hendrerit habitant massa nulla"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-24 text-center">
        <h3 className="text-4xl font-bold mb-6">Take Control Now</h3>
        <button className="bg-yellow-400 text-black px-8 py-3 rounded-full font-medium hover:bg-yellow-300 transition">
          Join the waitlist
        </button>

        <p className="text-zinc-500 mt-10 text-sm">
          © 2026 Apex. All rights reserved.
        </p>
      </section>
    </div>
  );
};

export default LandingPage;
