import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingCart,
  Box,
  BarChart3,
  LogIn,
  Package,
  X,
  Menu,
} from "lucide-react";
import { AudienceCard, OfferCard, StackCard, StepCard } from "./Cards";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const ref = useRef(null);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 100) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 60, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const step = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="bg-white text-black w-full">
      {/* Navbar */}
      <motion.nav
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 w-full z-50 px-4 pt-4"
      >
        <div
          ref={menuRef}
          className="max-w-5xl mx-auto bg-black text-white rounded-full px-6 py-4 flex items-center"
        >
          <h1 className="text-xl font-bold tracking-tight flex-1">
            apex<span className="text-zinc-400">.</span>
          </h1>

          {/* Desktop links */}
          <div className="hidden md:flex gap-8 font-medium justify-center flex-1">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#how">How it works</a>
          </div>

          {/* Desktop CTA */}
          <div className="flex-1 flex justify-end">
            <Link
              to="/register"
              className="hidden md:block bg-yellow-400 text-black px-5 py-2 rounded-full font-medium"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="max-w-6xl mx-auto mt-3 bg-black text-white rounded-3xl p-6 flex flex-col gap-4 md:hidden">
            <a href="#home" onClick={() => setOpen(false)}>
              Home
            </a>
            <a href="#about" onClick={() => setOpen(false)}>
              About
            </a>
            <a href="#how" onClick={() => setOpen(false)}>
              How it works
            </a>

            <Link
              to="/register"
              className="mt-2 bg-yellow-400 text-black py-2 rounded-full font-medium"
            >
              Get Started
            </Link>
          </div>
        )}
      </motion.nav>

      {/* Hero */}
      <section
        className="max-w-6xl mx-auto px-6 pt-40 py-12 grid md:grid-cols-2 gap-12 items-center text-center md:text-left"
        id="home"
      >
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Record <br /> Everything.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-zinc-600 max-w-md mx-auto md:mx-0"
          >
            Smart, simple digital tools designed for busy SME owners. No
            accounting expertise required.
          </motion.p>
          <Link to="/register">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-[#FFBC00] px-8 py-2 rounded-full border-2 border-black font-medium hover:bg-yellow-300 transition"
            >
              Use apex
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          {/* Glow */}
          <div className="absolute w-full h-auto bg-yellow-300/40 blur-3xl rounded-full -z-10" />

          {/* FLOATING ICON 1 */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-4 bg-white rounded-full w-24 h-24 flex items-center justify-center z-10 shadow-md"
          >
            <div className="border-2 p-4 border-black rounded-full flex items-center justify-center">
              <ShoppingCart className="text-black" size={26} />
            </div>
          </motion.div>

          {/* Main Image */}
          <img
            src="/assets/hero-image.png"
            alt="business"
            className="relative rounded-[40px] object-cover w-full max-w-md h-[400px] shadow-xl"
          />

          {/* FLOATING ICON 2 */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-4 -right-4 bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-md"
          >
            <div className="bg-black p-4 rounded-full flex items-center justify-center">
              <Package className="text-white" size={26} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* What we offer */}
      <section ref={ref} className="relative max-w-5xl mx-auto px-6 py-12">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          What we offer
        </motion.h3>
        <div className="relative h-auto">
          <StackCard index={0} scroll={scrollYProgress}>
            <OfferCard
              color="bg-[#FFCC3D]"
              title="Real-Time Sales & Expense Tracking"
              text="Record transactions in seconds and instantly see where your money is going. Whether it’s a daily sale, supplier payment, transfer, or unexpected expense, every transaction is captured and organized automatically."
            />
          </StackCard>

          <StackCard index={1} scroll={scrollYProgress}>
            <OfferCard
              color="bg-[#FF4DAC]"
              title="Smart Automation"
              text="Stop manual calculations and eliminate costly errors. Our smart system automatically tracks every transaction, categorizes income and expenses accurately, and updates your records in real time, giving you organized financial data, clear insights, and more time to focus on growing your business."
            />
          </StackCard>

          <StackCard index={2} scroll={scrollYProgress}>
            <OfferCard
              color="bg-[#AA5FFF]"
              title="Simple Financial Reports"
              text="Understand your business performance instantly with clean, easy-to-read dashboards that present your sales, expenses, and cash flow in a clear visual format. Make faster, smarter decisions using real-time data designed to give you confidence, clarity, and complete financial visibility."
            />
          </StackCard>
        </div>
      </section>

      {/* Who is this for */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          Who is this for
        </motion.h3>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          <motion.div variants={item}>
            <AudienceCard title="Small Shops" img="/assets/small-shops.jpg" />
          </motion.div>

          <motion.div variants={item}>
            <AudienceCard
              title="Service Providers"
              img="/assets/service-providers.jpg"
            />
          </motion.div>

          <motion.div variants={item}>
            <AudienceCard
              title="Retail Businesses"
              img="/assets/retail-business.jpg"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-20" id="how">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          How it works
        </motion.h3>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          className="grid md:grid-cols-4 gap-6"
        >
          <motion.div variants={step}>
            <StepCard
              number="01"
              title="Login/Signup"
              icon="/assets/auth.png"
              description="Lorem ipsum dolor sit amet consectetur."
            />
          </motion.div>

          <motion.div variants={step}>
            <StepCard
              number="02"
              title="Add products"
              icon="/assets/add-products.png"
              description="Lorem ipsum dolor sit amet consectetur."
            />
          </motion.div>

          <motion.div variants={step}>
            <StepCard
              number="03"
              title="Record Sales"
              icon="/assets/record-sales.png"
              description="Lorem ipsum dolor sit amet consectetur."
            />
          </motion.div>

          <motion.div variants={step}>
            <StepCard
              number="04"
              title="Analyze Data"
              icon="/assets/analytics.png"
              description="Lorem ipsum dolor sit amet consectetur."
            />
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <motion.footer
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-black text-white pt-24 pb-12 text-center"
      >
        <h3 className="text-4xl font-bold mb-6">Take Control Now</h3>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          className="bg-yellow-400 text-black px-8 py-3 rounded-full font-medium hover:bg-yellow-300 transition"
        >
          Join the waitlist
        </motion.button>

        <p className="text-zinc-500 mt-10 text-sm">
          © 2026 Apex. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
