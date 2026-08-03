"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Phone, ArrowLeft, ShieldCheck, FileText, Gift, CalendarCheck, UserCheck } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="relative min-h-screen bg-[#151515] text-[#f5f0e8] flex flex-col justify-between overflow-hidden antialiased selection:bg-[#C29B57] selection:text-[#151515]">
      
      {/* Background Image with Low Opacity & Soft Blur */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/renders/3000/ijm-harmony-evening-to-ni8.webp"
          alt="IJM First City Atmosphere"
          fill
          priority
          className="object-cover object-center opacity-10 filter blur-[4px] scale-105"
          sizes="100vw"
        />
        {/* Radial Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#151515]/90 via-[#151515]/80 to-[#151515]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,155,87,0.08)_0%,transparent_70%)]" />
      </div>

      {/* Header with Brand Logo */}
      <header className="relative z-10 w-full py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/footer-logo.webp"
              alt="IJM First City"
              width={80}
              height={40}
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-sans uppercase font-bold tracking-widest text-[#f5f0e8]/60 hover:text-[#C29B57] transition-colors"
          >
            <ArrowLeft size={14} className="text-[#C29B57]" />
            <span>Return to Site</span>
          </Link>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto w-full text-center flex flex-col items-center">
          
          {/* Animated Success Checkmark Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
            className="relative mb-6"
          >
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-[#C29B57]/20 filter blur-md animate-pulse" />
            
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1e1c18] to-[#0d0c0a] border-2 border-[#C29B57]/40 flex items-center justify-center shadow-2xl shadow-[#C29B57]/15">
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring", stiffness: 200 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#C29B57] flex items-center justify-center shadow-lg"
              >
                <Check size={28} className="text-[#151515] stroke-[3]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Subheading Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-[#C29B57] font-sans font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.35em] block mb-2">
              EXECUTIVE ASSISTANCE ASSIGNED
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-white tracking-tight mb-4"
          >
            Thank You!
          </motion.h1>

          {/* Subheading & Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="space-y-3 mb-8"
          >
            <h2 className="text-base sm:text-lg font-serif text-[#f5f0e8]/90 font-light">
              Your enquiry has been submitted successfully.
            </h2>
            <div className="w-12 h-px bg-[#C29B57] mx-auto my-3" />
            <p className="text-[#f5f0e8]/65 text-xs sm:text-sm max-w-lg leading-relaxed font-sans mx-auto">
              Our dedicated property advisor will contact you shortly with pricing details, floor plans, exclusive offers, and site visit assistance.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-10"
          >
            <Link
              href="/"
              className="pill-btn pill-btn-gold py-3.5 px-8 text-xs font-sans uppercase font-bold tracking-wider w-full sm:w-auto flex items-center justify-center gap-2 group shadow-lg shadow-[#C29B57]/10"
            >
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Back to Website</span>
            </Link>

            <a
              href="tel:+919920511119"
              className="pill-btn pill-btn-outline py-3.5 px-8 text-xs font-sans uppercase font-bold tracking-wider w-full sm:w-auto flex items-center justify-center gap-2 border-[#C29B57]/30 text-white hover:border-[#C29B57]"
            >
              <Phone size={14} className="text-[#C29B57]" />
              <span>Call Sales: +91 99205 11119</span>
            </a>
          </motion.div>

          {/* Information Card: What Happens Next? */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-full max-w-md bg-[#1e1c18]/70 backdrop-blur-md border border-[#C29B57]/20 rounded-2xl p-6 sm:p-8 neu-shadow text-left"
          >
            <div className="flex items-center gap-2 mb-5 border-b border-[#C29B57]/15 pb-4">
              <ShieldCheck size={18} className="text-[#C29B57]" />
              <h3 className="text-xs sm:text-sm font-serif font-bold text-white uppercase tracking-wider">
                What Happens Next?
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-[#f5f0e8]/85 font-sans font-medium">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C29B57]/15 flex items-center justify-center flex-shrink-0">
                  <UserCheck size={12} className="text-[#C29B57]" />
                </div>
                <span>Dedicated Relationship Manager</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C29B57]/15 flex items-center justify-center flex-shrink-0">
                  <FileText size={12} className="text-[#C29B57]" />
                </div>
                <span>Detailed Pricing Sheet &amp; Cost Breakup</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C29B57]/15 flex items-center justify-center flex-shrink-0">
                  <FileText size={12} className="text-[#C29B57]" />
                </div>
                <span>High-Resolution Floor Plans (2, 2.5 &amp; 3 BHK)</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C29B57]/15 flex items-center justify-center flex-shrink-0">
                  <Gift size={12} className="text-[#C29B57]" />
                </div>
                <span>Exclusive Launch Offers &amp; Payment Plans</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C29B57]/15 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck size={12} className="text-[#C29B57]" />
                </div>
                <span>Free Guided Site Visit Assistance</span>
              </li>
            </ul>
          </motion.div>

        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-white/5">
        <p className="text-[10px] text-[#f5f0e8]/30 font-sans tracking-wider">
          © {new Date().getFullYear()} IJM (India) Infrastructure Limited. All Rights Reserved.
        </p>
      </footer>

    </div>
  );
}
