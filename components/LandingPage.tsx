import React from "react";
import { ShoppingCart, Box, BarChart3, LogIn, Package } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="bg-white text-black">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 pt-6">
        <div className="bg-black text-white rounded-full px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            apex<span className="text-zinc-400">.</span>
          </h1>

          <div className="hidden md:flex gap-8 font-medium">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#how">How it works</a>
          </div>

          <button className="bg-yellow-400 text-black px-5 py-2 rounded-full font-medium hover:bg-yellow-300 transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Record <br /> Everything.
          </h2>

          <p className="mt-6 text-zinc-600 max-w-md">
            Smart, simple digital tools designed for busy SME owners. No
            accounting expertise required.
          </p>

          <button className="mt-6 bg-yellow-400 px-6 py-2 rounded-full border-2 border-black font-medium hover:bg-yellow-300 transition">
            Use apex
          </button>
        </div>

        <div className="relative flex justify-center">
          {/* Top floating icon */}
          <div className="absolute -top-6 -left-6 bg-white rounded-full w-24 h-24 flex items-center justify-center z-10">
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
          <div className="absolute -bottom-6 -right-6 bg-white rounded-full w-24 h-24 flex items-center justify-center">
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
            color="bg-yellow-400"
            title="Real-Time Sales & Expense Tracking"
            text="Record transactions instantly and see exactly where your money goes."
          />

          <OfferCard
            color="bg-pink-500"
            title="Smart Automation"
            text="Automatically categorize income and expenses accurately."
          />

          <OfferCard
            color="bg-purple-500"
            title="Simple Financial Reports"
            text="Clear dashboards that show sales, expenses and cash flow."
          />
        </div>
      </section>

      {/* Who is this for */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h3 className="text-4xl font-bold text-center mb-12">
          Who is this for
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          <AudienceCard
            title="Small Shops"
            img="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
          />
          <AudienceCard
            title="Service Providers"
            img="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
          />
          <AudienceCard
            title="Retail Businesses"
            img="https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
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
            icon={<LogIn size={28} />}
          />
          <StepCard number="02" title="Add products" icon={<Box size={28} />} />
          <StepCard
            number="03"
            title="Record Sales"
            icon={<ShoppingCart size={28} />}
          />
          <StepCard
            number="04"
            title="Analyze Data"
            icon={<BarChart3 size={28} />}
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

/* Components */

const OfferCard = ({
  color,
  title,
  text,
}: {
  color: string;
  title: string;
  text: string;
}) => (
  <div className={`${color} rounded-3xl p-10`}>
    <h4 className="text-xl font-bold mb-4">{title}</h4>
    <p className="mb-6">{text}</p>
    <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium">
      Use apex
    </button>
  </div>
);

const AudienceCard = ({ title, img }: { title: string; img: string }) => (
  <div>
    <img
      src={img}
      alt={title}
      className="rounded-2xl h-64 w-full object-cover mb-4"
    />
    <h4 className="font-semibold text-lg">{title}</h4>
  </div>
);

const StepCard = ({
  number,
  title,
  icon,
}: {
  number: string;
  title: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-yellow-400 rounded-2xl p-6 text-center">
    <p className="text-sm font-medium mb-2">{number}</p>
    <div className="flex justify-center mb-3">{icon}</div>
    <h4 className="font-semibold">{title}</h4>
  </div>
);

export default LandingPage;
