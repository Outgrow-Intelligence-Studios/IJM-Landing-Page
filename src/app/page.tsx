"use client";

import { useState, FormEvent, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  User,
  CheckCircle,
  Shield,
  Maximize2,
  Trees,
  Building,
  Award,
  Compass,
  Menu,
  X,
  Star,
} from "lucide-react";

// ReactBits Components
import ShinyText from "@/components/reactbits/ShinyText";
import BlurText from "@/components/reactbits/BlurText";
import CountUp from "@/components/reactbits/CountUp";
import Magnet from "@/components/reactbits/Magnet";
import GlareHover from "@/components/reactbits/GlareHover";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { trackLeadFormSubmit } from "@/lib/gtm";

// ─── ASSET PATHS (mapped from local renders — WebP for performance) ───
const RENDERS = {
  hero: "/renders/3000/ijm-hero-desktop.webp",
  heroMobile: "/renders/3000/ijm-hero-mobile.webp",
  aerial: "/renders/3000/ijm-harmony-aerial-shot-3k.webp",
  entrance: "/renders/3000/ijm-entrace-shot-3k.webp",
  elevation: "/renders/3000/ijm-harmony-elevation-shot-3k.webp",
  elevationBlock: "/renders/3000/ijm-harmony-elevation-block-1-3k.webp",
  backElevation: "/renders/3000/ijm-harmony-back-side-elevation3k.webp",
  ramp: "/renders/3000/ijm-harmony-ramp-to-two-elevation-3k.webp",
  fountain: "/renders/3000/ijm-harmony-water-fountain-3k.webp",
  aerialOpt: "/renders/3000/ijm-harmony-aerial-opt-3k.webp",
  // Landscape — grid cards
  chitChat: "/renders/landscape/cijm-harmony-chit-chat-park.webp",
  childPlay: "/renders/landscape/ijm-harmony-child-playarea.webp",
  cricket: "/renders/landscape/ijm-harmony-cricket-pitch.webp",
  miyawaki: "/renders/landscape/ijm-harmony-miyawaki-mini-shot.webp",
  multiSport: "/renders/landscape/ijm-harmony-multi-sport-court.webp",
  sportLawn: "/renders/landscape/ijm-harmony-multi-sport-lawn.webp",
  library: "/renders/landscape/ijm-harmony-out-door-library.webp",
  gym: "/renders/landscape/ijm-harmony-outdoor-gym.webp",
  peace: "/renders/landscape/ijm-harmony-peace-park.webp",
  topAngle: "/renders/landscape/ijm-harmony-top-angle-shot.webp",
  walking: "/renders/landscape/ijm-harmony-walking-park.webp",
  // Interiors
  balcony: "/renders/interiors/IJM_Balcony_3K.webp",
  bedroom: "/renders/interiors/IJM_Bedroom_3K.webp",
};


// Form Interface
interface FormData {
  name: string;
  phone: string;
  email: string;
  config: string;
  date?: string;
  message?: string;
}

export default function LandingPage() {
  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activePriceTab, setActivePriceTab] = useState<"2bhk" | "2.5bhk" | "3bhk">("2bhk");
  const [activeFloorTab, setActiveFloorTab] = useState<"2bhk" | "2.5bhk" | "3bhk">("2bhk");

  // Auto-show popup 2 seconds after client load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeadModalOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [visitForm, setVisitForm] = useState<FormData>({
    name: "", phone: "", email: "", config: "2.5 BHK", date: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mainRef    = useRef<HTMLDivElement>(null);
  const heroRef    = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);

  // Validation (used by site visit form)
  const validateForm = (data: FormData): boolean => {
    const tempErrors: Record<string, string> = {};
    if (!data.name.trim()) tempErrors.name = "Name is required";
    const phonePattern = /^[6-9]\d{9}$/;
    if (!data.phone.trim()) tempErrors.phone = "Phone is required";
    else if (!phonePattern.test(data.phone)) tempErrors.phone = "Enter valid 10-digit number";
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!data.email.trim()) tempErrors.email = "Email is required";
    else if (!emailPattern.test(data.email)) tempErrors.email = "Invalid email format";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVisitSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm(visitForm)) {
      setIsSubmitting(true);

      // Send payload to Google Sheets Apps Script Web App
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhoWE8UOBwhLH22xnth2ef7XolaSt1CTjz5GkH-ABjZXE5pO_0gn4UBC9wemmtJO3D/exec";
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: visitForm.name,
            phone: visitForm.phone,
            email: visitForm.email,
            config: visitForm.config,
            source: "Inline Website Form"
          }),
        });
      } catch (err) {
        console.error("Google Sheet submission error:", err);
      } finally {
        trackLeadFormSubmit();
        setVisitForm({ name: "", phone: "", email: "", config: "2.5 BHK", date: "" });
        setErrors({});
        setIsSubmitting(false);
        router.push("/thank-you");
      }
    }
  };

  // All enquiry buttons now open the unified LeadCaptureModal
  const openEnquiryModal = useCallback((_title: string, _defaultBhk: string) => {
    setIsLeadModalOpen(true);
  }, []);

  return (
    <div suppressHydrationWarning ref={mainRef} className="relative min-h-screen text-[#f5f0e8] bg-[#151515] antialiased selection:bg-[#C29B57] selection:text-[#151515]">

      {/* ═══════ STICKY NAVBAR ═══════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0c16]/90 backdrop-blur-md py-4 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <a href="#hero" className="flex items-center group">
              <Image src="/images/footer-logo.webp" alt="IJM First City" width={72} height={36} className="object-contain lg:w-[96px] lg:h-[48px]" priority />
            </a>
            <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#f5f0e8]/80">
              <a href="#overview" className="hover:text-[#C29B57] transition-colors">Overview</a>
              <a href="#amenities" className="hover:text-[#C29B57] transition-colors">Amenities</a>
              <a href="#floor-plans" className="hover:text-[#C29B57] transition-colors">Floor Plans</a>
              <a href="#gallery" className="hover:text-[#C29B57] transition-colors">Gallery</a>
              <a href="#configurations" className="hover:text-[#C29B57] transition-colors">Pricing</a>
              <a href="#connectivity" className="hover:text-[#C29B57] transition-colors">Location</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="tel:+919920511119" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#C29B57]/50 text-[#C29B57] hover:bg-[#C29B57] hover:text-[#0a0c16] text-[10px] font-bold tracking-widest uppercase transition-all duration-200 shadow-sm">
                <Phone size={12} /><span className="font-sans">+91 99205 11119</span>
              </a>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-white hover:text-[#C29B57] p-1.5 transition-colors" aria-label="Toggle menu">
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#0a0c16]/95 backdrop-blur-md py-6 px-6 lg:hidden border-b border-white/10">
            <nav className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.2em] font-bold text-white">
              <a href="#overview" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#C29B57] transition-colors border-b border-white/5">Overview</a>
              <a href="#amenities" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#C29B57] transition-colors border-b border-white/5">Amenities</a>
              <a href="#floor-plans" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#C29B57] transition-colors border-b border-white/5">Floor Plans</a>
              <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#C29B57] transition-colors border-b border-white/5">Gallery</a>
              <a href="#configurations" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#C29B57] transition-colors border-b border-white/5">Pricing</a>
              <a href="#connectivity" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-[#C29B57] transition-colors">Location</a>
            </nav>
          </div>
        )}
      </header>

      {/* ═══════ HERO SECTION ═══════ */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-28 sm:py-32">
        {/* Background — Native Responsive Picture Element (100% Identical SSR & CSR HTML) */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none">
          <source media="(max-width: 767px)" type="image/webp" srcSet={RENDERS.heroMobile} />
          <source media="(min-width: 768px)" type="image/webp" srcSet={RENDERS.hero} />
          <img
            src={RENDERS.hero}
            alt="IJM Harmony — Luxury Residence View"
            className="w-full h-full object-cover object-center transform-gpu"
            loading="eager"
            decoding="async"
          />
        </picture>
        {/* Dark gradient overlay — lighter at top (nav area), darker below for text */}
        <div className="absolute inset-0 z-[1]" style={{
          background: "linear-gradient(180deg, rgba(4,6,14,0.25) 0%, rgba(4,6,14,0.35) 12%, rgba(4,6,14,0.5) 30%, rgba(4,6,14,0.55) 45%, rgba(4,6,14,0.45) 60%, rgba(6,8,14,0.55) 80%, rgba(6,8,14,0.75) 100%)"
        }}></div>

        {/* Hero Content */}
        <div ref={heroTextRef} className="relative z-[3] w-full max-w-5xl mx-auto px-5 text-center flex flex-col items-center">

          {/* Eyebrow */}
          <p className="mb-4 text-[#E2B866] text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-[0.35em] px-4 py-1.5 rounded-full bg-[#0a0808]/60 border border-[#C29B57]/35 backdrop-blur-sm inline-block shadow-[0_4px_20px_rgba(0,0,0,0.5)]" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}>
            IJM FIRST CITY — MIHAN, NAGPUR
          </p>

          {/* Main Headline (promoted tagline) */}
          <h1
            className="font-serif text-[40px] sm:text-[56px] lg:text-[76px] font-light leading-[1.1] tracking-wide text-white max-w-3xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 4px 40px rgba(0,0,0,0.4)" }}
          >
            Welcome to the world of infinite possibilities
          </h1>

          {/* Descriptor */}
          <p className="mt-4 text-[#f5f0e8]/50 font-sans text-[11px] sm:text-xs tracking-[0.2em] uppercase" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.5)" }}>
            Premium 2, 2.5 & 3 BHK Apartments
          </p>

          {/* ── Stat Cards Row ── */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg sm:max-w-2xl">
            {[
              { num: "6", label: "Towers" },
              { num: "15", label: "Storeys" },
              { num: "690+", label: "Units" },
              { num: "100+", label: "Amenities" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a0e1a]/80 backdrop-blur-sm border border-[#C29B57]/25 rounded-lg px-3 py-4 text-center">
                <span className="block text-2xl sm:text-3xl font-sans font-bold text-[#C29B57]">{stat.num}</span>
                <span className="block text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-[#f5f0e8]/60 mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* ── CTA Row ── */}
          <div ref={heroCtaRef} className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Magnet>
              <button
                onClick={() => openEnquiryModal("Book a Private Tour", "2.5 BHK")}
                className="pill-btn pill-btn-gold text-sm px-9 py-3.5"
              >
                Book a Tour
              </button>
            </Magnet>
            <Magnet>
              <a
                href="#overview"
                className="pill-btn pill-btn-outline text-sm px-9 py-3.5"
              >
                Explore Project
              </a>
            </Magnet>
          </div>
        </div>
      </section>

      {/* ═══════ CONFIGURATIONS & PRICING (New section) ═══════ */}
      <section className="py-14 sm:py-16 bg-[#151515]">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">Starting Prices</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-white mb-8">Configurations & Pricing</h2>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <span className="px-5 py-3 rounded-full border border-[#C29B57]/30 bg-[#0a0e1a]/70 backdrop-blur-sm text-[#C29B57] text-[11px] sm:text-sm font-sans font-semibold tracking-wide">2 BHK · ₹73L</span>
            <span className="px-5 py-3 rounded-full border border-[#C29B57]/30 bg-[#0a0e1a]/70 backdrop-blur-sm text-[#C29B57] text-[11px] sm:text-sm font-sans font-semibold tracking-wide">2.5 BHK · ₹87L</span>
            <span className="px-5 py-3 rounded-full border border-[#C29B57]/30 bg-[#0a0e1a]/70 backdrop-blur-sm text-[#C29B57] text-[11px] sm:text-sm font-sans font-semibold tracking-wide">3 BHK · ₹1.17Cr</span>
          </div>
        </div>
      </section>

      {/* ═══════ WHAT WE OFFER — ASYMMETRIC GRID (Landscape renders) ═══════ */}
      <section id="overview" className="py-20 sm:py-28 bg-[#FAF9F6] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="WHAT WE OFFER" color="#C29B57" shineColor="#f5f0e8" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-[#1A1A1A]">
              <BlurText text="Sanctuary of Modern Luxury" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          <div className="stagger-container asym-grid">
            {/* Featured large card — aerial 3000px */}
            <div className="stagger-item card-featured luxury-card rounded-xl overflow-hidden relative group">
              <Image src={RENDERS.aerial} alt="Aerial View of IJM Harmony Township" fill className="object-cover" sizes="(max-width:768px) 100vw, 66vw" loading="lazy" quality={60} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/90 via-[#0a0808]/30 to-transparent z-[1]"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-[2]">
                <Trees size={24} className="text-[#b8924a] mb-2" />
                <h3 className="text-lg sm:text-xl font-serif font-bold text-white mb-1">31 Acres Gated Paradise</h3>
                <p className="text-[#f5f0e8]/50 text-xs max-w-sm">Premium integrated township with resort-style landscaping</p>
              </div>
            </div>

            {/* Smaller cards using landscape renders */}
            <div className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src={RENDERS.fountain} alt="Water Fountain Area" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={55} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-4">
                <div>
                  <Building size={18} className="text-[#b8924a] mb-1" />
                  <h3 className="text-sm font-serif font-bold text-white">6 Grand Towers</h3>
                  <p className="text-[#f5f0e8]/40 text-[10px]">RCC shear wall technology</p>
                </div>
              </div>
            </div>

            <div className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src={RENDERS.peace} alt="Peace Park" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={55} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-4">
                <div>
                  <Award size={18} className="text-[#b8924a] mb-1" />
                  <h3 className="text-sm font-serif font-bold text-white">100+ Amenities</h3>
                  <p className="text-[#f5f0e8]/40 text-[10px]">Indoor & outdoor resort living</p>
                </div>
              </div>
            </div>

            <div className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src={RENDERS.walking} alt="Walking Park" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={55} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-4">
                <div>
                  <Compass size={18} className="text-[#b8924a] mb-1" />
                  <h3 className="text-sm font-serif font-bold text-white">3-Side Open</h3>
                  <p className="text-[#f5f0e8]/40 text-[10px]">Natural ventilation & sunlight</p>
                </div>
              </div>
            </div>

            <div className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src={RENDERS.elevationBlock} alt="Smart Layouts" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={55} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-4">
                <div>
                  <Maximize2 size={18} className="text-[#b8924a] mb-1" />
                  <h3 className="text-sm font-serif font-bold text-white">Smart Layouts</h3>
                  <p className="text-[#f5f0e8]/40 text-[10px]">Zero-wastage carpet area</p>
                </div>
              </div>
            </div>

            <div className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src={RENDERS.entrance} alt="Grand Entrance" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={55} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-4">
                <div>
                  <Shield size={18} className="text-[#b8924a] mb-1" />
                  <h3 className="text-sm font-serif font-bold text-white">High ROI</h3>
                  <p className="text-[#f5f0e8]/40 text-[10px]">MIHAN IT hub location</p>
                </div>
              </div>
            </div>

            <div className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src={RENDERS.balcony} alt="Premium Balcony" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={55} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-4">
                <div>
                  <Star size={18} className="text-[#b8924a] mb-1" />
                  <h3 className="text-sm font-serif font-bold text-white">Premium Finish</h3>
                  <p className="text-[#f5f0e8]/40 text-[10px]">Branded fittings & flooring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════ LEAD CAPTURE FORM (Elevated Glassmorphism) ═══════ */}
      <section className="py-16 sm:py-20 bg-[#151515] relative">
        <div className="max-w-md mx-auto px-4">
          <div className="glass-gold rounded-2xl p-8 sm:p-10 neu-shadow">
            <div className="text-center mb-8">
              <span className="text-[#b8924a] font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">Get Exclusive Pricing</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-light text-white">Enquire Now</h3>
              <p className="text-[#f5f0e8]/50 text-xs mt-2">Our team will call back within 15 minutes</p>
            </div>
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div>
                <input type="text" required value={visitForm.name} onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })} placeholder="Full Name" className={`form-input ${errors.name ? "!border-red-500" : ""}`} />
                {errors.name && <p className="text-red-400 text-[10px] mt-1">{errors.name}</p>}
              </div>
              <div>
                <input type="tel" required value={visitForm.phone} onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })} placeholder="Phone Number" className={`form-input ${errors.phone ? "!border-red-500" : ""}`} />
                {errors.phone && <p className="text-red-400 text-[10px] mt-1">{errors.phone}</p>}
              </div>
              <div>
                <input type="email" required value={visitForm.email} onChange={(e) => setVisitForm({ ...visitForm, email: e.target.value })} placeholder="Email Address" className={`form-input ${errors.email ? "!border-red-500" : ""}`} />
                {errors.email && <p className="text-red-400 text-[10px] mt-1">{errors.email}</p>}
              </div>
              <select value={visitForm.config} onChange={(e) => setVisitForm({ ...visitForm, config: e.target.value })} className="form-input">
                <option value="2 BHK">2 BHK</option>
                <option value="2.5 BHK">2.5 BHK</option>
                <option value="3 BHK">3 BHK</option>
              </select>
              <div className="text-center"><Magnet>
                <button type="submit" disabled={isSubmitting} className="pill-btn pill-btn-gold py-3 px-12 disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Magnet></div>
              <p className="text-[9px] text-[#f5f0e8]/30 text-center">I authorize NITPL to contact me, overriding DNC/NDNC.</p>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════ RECOMMENDED PROPERTIES — ASYMMETRIC GRID (Landscape renders) ═══════ */}
      <section id="amenities" className="pt-20 pb-10 sm:pt-28 sm:pb-16 bg-[#151515] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="RESORT LIVING" color="#C29B57" shineColor="#f5f0e8" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
              <BlurText text="100+ World-Class Amenities" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          <div className="stagger-container asym-grid">
            {/* Featured — large card */}
            <GlareHover className="stagger-item card-featured luxury-card rounded-xl overflow-hidden relative group">
              <Image src="/images/amenities/swimming_pool.webp" alt="Swimming Pool" fill className="object-cover" sizes="(max-width:768px) 100vw, 66vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-6">
                <span className="text-white font-serif text-lg font-bold">Swimming Pool</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/gymnasium.webp" alt="Modern Gymnasium" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Modern Gymnasium</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/sauna.webp" alt="Sauna" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Sauna</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/steam_room.webp" alt="Steam Room" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Steam Room</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/spa.webp" alt="Spa" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Spa</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/jacuzzi.webp" alt="Jacuzzi" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Jacuzzi</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/squash.webp" alt="Squash Court" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Squash Court</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/multisport.webp" alt="Multi-Sport Court" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Multi-Sport Court</span>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[200px]">
              <Image src="/images/amenities/cricket.webp" alt="Box Cricket Pitch" fill className="object-cover" sizes="(max-width:768px) 50vw, 33vw" loading="lazy" quality={82} />
              <div className="absolute inset-0 bg-[#0a0808]/30 group-hover:bg-[#b8924a]/70 transition-all duration-500 z-[1] flex items-end p-4">
                <span className="text-white font-serif text-sm font-bold">Box Cricket Pitch</span>
              </div>
            </GlareHover>


          </div>
        </div>
      </section>

      {/* ═══════ INTERIOR HIGHLIGHTS (3000px Interior renders) ═══════ */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="INTERIORS" color="#C29B57" shineColor="#1A1A1A" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A]">
              <BlurText text="Crafted Interiors" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          <div className="stagger-container grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[280px] sm:h-[380px]">
              <Image src={RENDERS.elevation} alt="Superior Wall Finish" fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 50vw" loading="lazy" quality={60} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Superior Wall Finish</h3>
                  <p className="text-[#f5f0e8]/50 text-xs mt-1">Premium wall finishes crafted for durability, elegance, and a luxurious living experience.</p>
                </div>
              </div>
            </GlareHover>

            <GlareHover className="stagger-item luxury-card rounded-xl overflow-hidden relative group h-[280px] sm:h-[380px]">
              <Image src={RENDERS.balcony} alt="Premium Balcony View" fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" loading="lazy" quality={60} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0808]/80 to-transparent z-[1] flex items-end p-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Private Balcony</h3>
                  <p className="text-[#f5f0e8]/50 text-xs mt-1">Panoramic green views from every unit</p>
                </div>
              </div>
            </GlareHover>
          </div>
        </div>
      </section>

      {/* ═══════ PRICING SECTION ═══════ */}
      <section id="configurations" className="py-20 sm:py-28 bg-[#151515] relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="PRICING & PLANS" color="#C29B57" shineColor="#f5f0e8" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
              <BlurText text="Apartment Configurations" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          {/* Pill tab selector */}
          <div className="gsap-fade-up flex justify-center mb-10">
            <div className="glass rounded-[50px] p-1.5 flex gap-1">
              <button onClick={() => setActivePriceTab("2bhk")} className={`pill-btn text-[10px] px-6 py-2 ${activePriceTab === "2bhk" ? "pill-btn-gold" : "pill-btn-outline border-0 text-[#f5f0e8]/60"}`}>2 BHK</button>
              <button onClick={() => setActivePriceTab("2.5bhk")} className={`pill-btn text-[10px] px-6 py-2 ${activePriceTab === "2.5bhk" ? "pill-btn-gold" : "pill-btn-outline border-0 text-[#f5f0e8]/60"}`}>2.5 BHK</button>
              <button onClick={() => setActivePriceTab("3bhk")} className={`pill-btn text-[10px] px-6 py-2 ${activePriceTab === "3bhk" ? "pill-btn-gold" : "pill-btn-outline border-0 text-[#f5f0e8]/60"}`}>3 BHK</button>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 sm:p-10 neu-shadow">
            {activePriceTab === "2bhk" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/5">
                  <h3 className="text-xl font-serif font-bold text-white">2 BHK Spacious</h3>
                  <span className="pill-btn pill-btn-gold text-xs py-2 px-5">Starting ₹73 Lakhs*</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#f5f0e8]/70">
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Carpet Area: 849–912 Sq.Ft.</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>3-Side Open Ventilation</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>2 Modern Bathrooms</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>1 Utility Balcony</div>
                </div>
                <Magnet><button onClick={() => openEnquiryModal("2 BHK Pricing", "2 BHK")} className="pill-btn pill-btn-outline w-full sm:w-auto mt-4">Get Cost Sheet</button></Magnet>
              </div>
            )}
            {activePriceTab === "2.5bhk" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/5">
                  <h3 className="text-xl font-serif font-bold text-white">2.5 BHK Utility</h3>
                  <span className="pill-btn pill-btn-gold text-xs py-2 px-5">Starting ₹87 Lakhs*</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#f5f0e8]/70">
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Carpet Area: 1050–1115 Sq.Ft.</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Dedicated Study Room</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>2 Standing Balconies</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Modular Layout Options</div>
                </div>
                <Magnet><button onClick={() => openEnquiryModal("2.5 BHK Pricing", "2.5 BHK")} className="pill-btn pill-btn-outline w-full sm:w-auto mt-4">Get Cost Sheet</button></Magnet>
              </div>
            )}
            {activePriceTab === "3bhk" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-white/5">
                  <h3 className="text-xl font-serif font-bold text-white">3 BHK Luxury</h3>
                  <span className="pill-btn pill-btn-gold text-xs py-2 px-5">Starting ₹1.17 Crore*</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#f5f0e8]/70">
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Carpet Area: 1250–1417 Sq.Ft.</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>3 Bedrooms & 3 Balconies</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Grand Foyer Entrance</div>
                  <div className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-[#b8924a]"></span>Corner Ventilation Layout</div>
                </div>
                <Magnet><button onClick={() => openEnquiryModal("3 BHK Pricing", "3 BHK")} className="pill-btn pill-btn-outline w-full sm:w-auto mt-4">Get Cost Sheet</button></Magnet>
              </div>
            )}
          </div>
          <p className="gsap-fade-up text-[10px] text-[#f5f0e8]/30 italic text-center mt-6">*BSP only. Excludes statutory charges, parking, amenities & GST.</p>
        </div>
      </section>

      {/* ═══════ FLOOR PLANS ═══════ */}
      <section id="floor-plans" className="py-20 sm:py-28 bg-[#FAF9F6] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="FLOOR LAYOUTS" color="#C29B57" shineColor="#1A1A1A" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-[#1A1A1A]">
              <BlurText text="Typical Floor Plans" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          <div className="gsap-fade-up flex justify-center mb-10">
            <div className="glass rounded-[50px] p-1.5 flex gap-1">
              <button onClick={() => setActiveFloorTab("2bhk")} className={`pill-btn text-[10px] px-6 py-2 ${activeFloorTab === "2bhk" ? "pill-btn-gold" : "pill-btn-outline border-0 text-[#3a3a3a]/60"}`}>2 BHK</button>
              <button onClick={() => setActiveFloorTab("2.5bhk")} className={`pill-btn text-[10px] px-6 py-2 ${activeFloorTab === "2.5bhk" ? "pill-btn-gold" : "pill-btn-outline border-0 text-[#3a3a3a]/60"}`}>2.5 BHK</button>
              <button onClick={() => setActiveFloorTab("3bhk")} className={`pill-btn text-[10px] px-6 py-2 ${activeFloorTab === "3bhk" ? "pill-btn-gold" : "pill-btn-outline border-0 text-[#3a3a3a]/60"}`}>3 BHK</button>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-[#C29B57]/15 rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col lg:flex-row gap-10 items-center">
            {activeFloorTab === "2bhk" && (
              <>
                <div className="lg:w-1/2 space-y-5 text-left">
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">2 BHK Layout</h3>
                  <ul className="space-y-3 text-sm text-[#3a3a3a]">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>Carpet: 849–912 Sq.ft.</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>2 Modern Bathrooms</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>1 Utility Balcony</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>3-Side Open Ventilation</li>
                  </ul>
                  <Magnet><button onClick={() => openEnquiryModal("2 BHK Floor Plan", "2 BHK")} className="pill-btn pill-btn-outline mt-4">Enquire Now</button></Magnet>
                </div>
                <div className="lg:w-1/2 relative w-full h-60 sm:h-[380px] bg-[#f0eeeb] rounded-xl border border-[#C29B57]/10 overflow-hidden">
                  <Image src="/images/Typical-Floor-Plan-v2.webp" alt="2 BHK Floor Plan" fill className="object-contain p-4" loading="lazy" quality={90} />
                </div>
              </>
            )}
            {activeFloorTab === "2.5bhk" && (
              <>
                <div className="lg:w-1/2 space-y-5 text-left">
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">2.5 BHK Layout</h3>
                  <ul className="space-y-3 text-sm text-[#3a3a3a]">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>Carpet: 1050–1115 Sq.ft.</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>2 Bathrooms + Study</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>2 Standing Balconies</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>Modular Customization</li>
                  </ul>
                  <Magnet><button onClick={() => openEnquiryModal("2.5 BHK Floor Plan", "2.5 BHK")} className="pill-btn pill-btn-outline mt-4">Enquire Now</button></Magnet>
                </div>
                <div className="lg:w-1/2 relative w-full h-60 sm:h-[380px] bg-[#f0eeeb] rounded-xl border border-[#C29B57]/10 overflow-hidden">
                  <Image src="/images/Floor-Plan-v2.webp" alt="2.5 BHK Floor Plan" fill className="object-contain p-4" loading="lazy" quality={90} />
                </div>
              </>
            )}
            {activeFloorTab === "3bhk" && (
              <>
                <div className="lg:w-1/2 space-y-5 text-left">
                  <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">3 BHK Layout</h3>
                  <ul className="space-y-3 text-sm text-[#3a3a3a]">
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>Carpet: 1250–1417 Sq.ft.</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>3 Grand Bathrooms</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>3 Large Balconies</li>
                    <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#C29B57]"></span>Corner Ventilation</li>
                  </ul>
                  <Magnet><button onClick={() => openEnquiryModal("3 BHK Floor Plan", "3 BHK")} className="pill-btn pill-btn-outline mt-4">Enquire Now</button></Magnet>
                </div>
                <div className="lg:w-1/2 relative w-full h-60 sm:h-[380px] bg-[#f0eeeb] rounded-xl border border-[#C29B57]/10 overflow-hidden">
                  <Image src="/images/3bhk-Floor-Plan-v2.webp" alt="3 BHK Floor Plan" fill className="object-contain p-4" loading="lazy" quality={90} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ PROJECT GALLERY ═══════ */}
      <section id="gallery" className="py-20 sm:py-28 bg-[#151515] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="VISUAL EXPERIENCE" color="#C29B57" shineColor="#f5f0e8" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
              <BlurText text="Project Gallery" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "/images/gallery/gallery1.webp", title: "Panoramic Township View", caption: "31-acre integrated gated ecosystem" },
              { img: "/images/gallery/gallery2.webp", title: "Water Fountain Plaza", caption: "Central landscaped fountain & promenade" },
              { img: "/images/gallery/gallery3.webp", title: "Miyawaki Mini Forest", caption: "Dense green canopy & peaceful walking trail" },
              { img: "/images/gallery/gallery4.webp", title: "Multi-Sport Court", caption: "Professional outdoor sports facility" },
              { img: "/images/gallery/gallery5.webp", title: "Architectural Elevation", caption: "Modern RCC shear wall structure" },
              { img: "/images/gallery/gallery6.webp", title: "Grand Residential Towers", caption: "15-storey luxury high-rise residences" },
            ].map((item, index) => (
              <GlareHover key={index} className="bg-[#1e1a14] border border-[#C29B57]/20 rounded-xl overflow-hidden shadow-lg group relative h-[260px] sm:h-[300px]">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
                  <h3 className="font-serif font-bold text-white text-base mb-1">{item.title}</h3>
                  <p className="text-[#C29B57]/80 text-xs font-sans">{item.caption}</p>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ BOOK SITE VISIT ═══════ */}
      <section className="py-20 sm:py-28 bg-[#151515] relative">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="gsap-fade-up glass rounded-2xl overflow-hidden neu-shadow p-8">
            <div className="space-y-4 text-center mb-8">
              <span className="text-[#b8924a] font-bold text-[10px] uppercase tracking-[0.3em]">By Appointment</span>
              <h3 className="text-2xl font-serif font-light text-white">Book Site Visit</h3>
              <div className="w-12 h-px bg-[#b8924a] mx-auto"></div>
              <p className="text-[#f5f0e8]/50 text-xs leading-relaxed">Schedule a private tour of MIHAN location.</p>
            </div>
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <input type="text" required value={visitForm.name} onChange={(e) => setVisitForm({...visitForm, name: e.target.value})} placeholder="Full Name" className={`form-input ${errors.name ? "!border-red-500" : ""}`} />
              <input type="tel" required value={visitForm.phone} onChange={(e) => setVisitForm({...visitForm, phone: e.target.value})} placeholder="Phone Number" className={`form-input ${errors.phone ? "!border-red-500" : ""}`} />
              <input type="email" required value={visitForm.email} onChange={(e) => setVisitForm({...visitForm, email: e.target.value})} placeholder="Email Address" className={`form-input ${errors.email ? "!border-red-500" : ""}`} />
              <select value={visitForm.config} onChange={(e) => setVisitForm({...visitForm, config: e.target.value})} className="form-input">
                <option value="2 BHK">2 BHK</option>
                <option value="2.5 BHK">2.5 BHK</option>
                <option value="3 BHK">3 BHK</option>
              </select>
              <div className="text-center"><Magnet>
                <button type="submit" disabled={isSubmitting} className="pill-btn pill-btn-gold py-3.5 px-12 text-xs disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </Magnet></div>
              <p className="text-[9px] text-[#f5f0e8]/30 text-center">I authorize NITPL to contact me, overriding DNC/NDNC.</p>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════ CORPORATE TRUST & LEGACY (About IJM India) ═══════ */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="gsap-fade-up text-center mb-16">
            <span className="text-[#C29B57] font-sans font-bold text-[12px] sm:text-[13px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="ABOUT IJM INDIA" color="#C29B57" shineColor="#1A1A1A" speed={3} />
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-[#1A1A1A]">
              About IJM India
            </h2>
            <p className="text-[#3a3a3a]/60 text-sm sm:text-base lg:text-lg mt-3 uppercase tracking-wider font-sans font-semibold">
              Engineering Excellence. Global Legacy. Trusted Infrastructure.
            </p>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-5"></div>
          </div>

          {/* Overview Grid */}
          <div className="gsap-fade-up grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            {/* Left Column - Company Profile */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-12 bg-white p-2 rounded-xl flex items-center justify-center border border-[#C29B57]/15 shadow-sm">
                  <Image src="/images/corporate/logo.webp" alt="IJM India Logo" width={80} height={48} className="object-contain" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">IJM (India) Infrastructure Limited</h3>
                  <p className="text-[10px] text-[#C29B57] uppercase tracking-wider font-semibold">Excellence Through Quality</p>
                </div>
              </div>
              <p className="text-[#3a3a3a] text-sm leading-relaxed">
                IJM (India) Infrastructure Limited (IJMII), incorporated in 1998, is a subsidiary of IJM Corporation Berhad — one of Malaysia&apos;s largest and most diversified construction groups. Over nearly three decades of operations in India, IJMII has established a sterling record as a pioneer in highway infrastructure and premium property development.
              </p>
              
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#3a3a3a] font-sans font-semibold">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C29B57] mt-1.5 flex-shrink-0"></span>
                  <span>Subsidiary of IJM Corporation Berhad, Malaysia</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C29B57] mt-1.5 flex-shrink-0"></span>
                  <span>Established Indian operations in 1998</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C29B57] mt-1.5 flex-shrink-0"></span>
                  <span>Global infrastructure & construction expertise</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C29B57] mt-1.5 flex-shrink-0"></span>
                  <span>Residential, commercial & highway development</span>
                </li>
              </ul>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              {[
                { value: "40+", suffix: " Years", desc: "Global Group Excellence" },
                { value: "5500+", suffix: " Lane Km", desc: "Highways & Bridges Built" },
                { value: "20.2", suffix: "M Sq.Ft.", desc: "Residential & Commercial" },
                { value: "9+", suffix: " Countries", desc: "Worldwide Operations Presence" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-[#C29B57]/15 rounded-xl p-5 shadow-sm text-center">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C29B57] block">
                    {stat.value.includes(".") ? (
                      <span className="font-serif font-bold">{stat.value}{stat.suffix}</span>
                    ) : (
                      <span className="font-serif font-bold"><CountUp to={parseInt(stat.value)} from={0} suffix={stat.suffix} /></span>
                    )}
                  </span>
                  <span className="block text-[9px] uppercase tracking-[0.15em] text-[#3a3a3a]/60 mt-2 font-sans font-bold leading-normal">
                    {stat.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Awards & Recognition Subsection */}
          <div className="gsap-fade-up mb-24">
            <div className="text-center mb-12">
              <span className="text-[#C29B57] font-sans font-bold text-[9px] uppercase tracking-[0.25em] block mb-1">HONORS</span>
              <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1A1A1A]">Awards & Recognition</h3>
              <div className="h-px bg-[#C29B57] w-12 mx-auto mt-2"></div>
            </div>
            
            <div className="stagger-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  img: "/images/corporate/cidc_managed.jpg", 
                  title: "Best Professionally Managed Company", 
                  desc: "Conferred trophy by CIDC during the prestigious CIDC Vishwakarma Awards." 
                },
                { 
                  img: "/images/corporate/cidc_project.jpg", 
                  title: "Best Construction Project", 
                  desc: "Awarded achievement honor for the Solapur-Bijapur national road project." 
                },
                { 
                  img: "/images/corporate/chairman_commendation.jpg", 
                  title: "Chairman's Commendation Trophy", 
                  desc: "Presented by the Construction Industry Development Council (CIDC) of India." 
                },
                { 
                  img: "/images/corporate/morth_appreciation.webp", 
                  title: "MoRTH Certificate of Appreciation", 
                  desc: "Awarded by Hon'ble Union Minister Nitin Gadkari for setting paving records." 
                },
                { 
                  img: "/images/corporate/india_records.jpg", 
                  title: "India Book of Records", 
                  desc: "Custodian registry for laying bituminous concrete over 25.54 lane-km in 18 hours." 
                },
                { 
                  img: "/images/corporate/asia_records.jpg", 
                  title: "Asia Book of Records", 
                  desc: "Official entry into transnational record list complying with international protocols." 
                }
              ].map((award, i) => (
                <GlareHover key={i} className="stagger-item bg-white border border-[#C29B57]/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md flex flex-col h-full">
                  <div className="relative h-48 w-full bg-[#FAF9F6] border-b border-[#C29B57]/10 flex items-center justify-center p-4">
                    <Image src={award.img} alt={award.title} fill className="object-contain p-3" sizes="(max-width:768px) 100vw, 33vw" loading="lazy" />
                  </div>
                  <div className="p-5 flex flex-col flex-grow justify-between text-left">
                    <h4 className="text-xs sm:text-sm font-serif font-bold text-[#1A1A1A] leading-tight mb-2">{award.title}</h4>
                    <p className="text-[#3a3a3a]/70 text-[10px] leading-relaxed font-sans">{award.desc}</p>
                  </div>
                </GlareHover>
              ))}
            </div>
          </div>

          {/* Customer Testimonials Subsection */}
          <div className="gsap-fade-up">
            <div className="text-center mb-12">
              <span className="text-[#C29B57] font-sans font-bold text-[9px] uppercase tracking-[0.25em] block mb-1">REVIEWS</span>
              <h3 className="text-xl sm:text-2xl font-serif font-light text-[#1A1A1A]">Customer Testimonials</h3>
              <div className="h-px bg-[#C29B57] w-12 mx-auto mt-2"></div>
            </div>
            
            <div className="stagger-container grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  img: "/images/testimonials/nagdeve.webp", 
                  name: "Mr. & Mrs. Nagdeve", 
                  text: "Choosing Harmony Tower felt right from the beginning. The clarity in communication, thoughtful planning, and overall vision of the project gave us complete confidence. We're really looking forward to building our life here." 
                },
                { 
                  img: "/images/testimonials/kaner.webp", 
                  name: "Mr. Yash Kaner", 
                  text: "Buying a home is a big milestone, and First City made it truly special for us. Beyond just a home, it offers the lifestyle upgrade we were looking for—with thoughtful design, great amenities, and a location that perfectly fits our vision of a dream home." 
                },
                { 
                  img: "/images/testimonials/gadkari.webp", 
                  name: "Mr. & Mrs. Gadkari", 
                  text: "From our very first visit, First City gave us a sense of trust. Seeing a well-developed township with a growing community and quality infrastructure made our decision much easier. Today, we're happy to be part of a place that offers both a comfortable lifestyle and strong long-term value." 
                },
                { 
                  img: "/images/testimonials/singh.webp", 
                  name: "Mr. & Mrs. Singh", 
                  text: "A home is more than four walls, and that's exactly what we found at First City. The peaceful environment, well-planned spaces, and vibrant township feeling made it easy for us to imagine our future here." 
                }
              ].map((item, i) => (
                <div key={i} className="stagger-item bg-white border border-[#C29B57]/15 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-left shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 h-full">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#C29B57]/20 flex-shrink-0 shadow-inner bg-[#FAF9F6]">
                    <Image src={item.img} alt={item.name} fill className="object-cover" sizes="96px" loading="lazy" />
                  </div>
                  <div className="flex flex-col justify-between flex-grow space-y-3">
                    <div className="space-y-1">
                      <div className="flex gap-0.5 text-[#C29B57] mb-1">
                        {[...Array(5)].map((_, idx) => <Star key={idx} size={11} fill="#C29B57" stroke="none" />)}
                      </div>
                      <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">{item.name}</h4>
                    </div>
                    <p className="text-[#3a3a3a]/80 text-xs sm:text-[13px] leading-relaxed italic font-sans font-medium">&ldquo;{item.text}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ═══════ CONNECTIVITY & LOCATION ═══════ */}
      <section id="connectivity" className="py-20 sm:py-28 bg-[#151515] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-[#C29B57] font-sans font-bold text-[10px] uppercase tracking-[0.3em] block mb-2">
              <ShinyText text="LOCATION ADVANTAGE" color="#C29B57" shineColor="#f5f0e8" speed={3} />
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-white">
              <BlurText text="Landmarks & Connectivity" delay={80} animateBy="words" direction="bottom" />
            </h2>
            <div className="h-px bg-[#C29B57] w-16 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="gsap-fade-up lg:col-span-5 space-y-5">
              <h3 className="text-xl font-serif text-white mb-6">From First City</h3>
              <div className="space-y-0 divide-y divide-white/5">
                {[
                  { name: "IT Hub", dist: "3 Mins" },
                  { name: "Educational Institutions", dist: "3 Mins" },
                  { name: "Hospitals", dist: "5 Mins" },
                  { name: "Metro", dist: "5 Mins" },
                  { name: "Airport", dist: "10 Mins" },
                ].map((item) => (
                  <div key={item.name} className="py-3.5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b8924a]"></span>
                      <span className="text-sm text-[#f5f0e8]/80">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#b8924a] bg-[#b8924a]/10 border border-[#b8924a]/20 px-3 py-1 rounded-full">{item.dist}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="gsap-fade-up lg:col-span-7 glass rounded-2xl p-3 neu-shadow-sm">
              <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-xl bg-black/30" style={{ filter: "invert(90%) hue-rotate(180deg) brightness(85%) contrast(90%)" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.690397621467!2d79.03568347503189!3d21.04507048060831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4bf55d2d8642b%3A0xcf8f6266e9755bf!2sFirst%20City!5e0!3m2!1sen!2sin!4v1761571621443!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-3 text-center">
                <a href="https://maps.app.goo.gl/cf8f6266e9755bf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#b8924a] text-xs uppercase tracking-[0.15em] font-bold hover:text-white transition-colors">
                  <MapPin size={14} /> Open In Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#121212] pt-16 pb-32 border-t border-[#C29B57]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12 border-b border-white/5">
            <div className="space-y-4">
              <Image src="/images/footer-logo.webp" alt="IJM Logo" width={72} height={40} className="object-contain" loading="lazy" />
              <p className="text-[#f5f0e8]/40 text-xs leading-relaxed max-w-xs">IJM First City, Sector-20, MIHAN, Nagpur, Maharashtra</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#b8924a] uppercase tracking-[0.2em]">Quick Links</h4>
              <nav className="flex flex-col gap-2 text-xs text-[#f5f0e8]/50">
                <a href="#hero" className="hover:text-[#b8924a] transition-colors">Home</a>
                <a href="#overview" className="hover:text-[#b8924a] transition-colors">Overview</a>
                <a href="#amenities" className="hover:text-[#b8924a] transition-colors">Amenities</a>
                <a href="#configurations" className="hover:text-[#b8924a] transition-colors">Pricing</a>
              </nav>
            </div>
            <div className="space-y-3 text-xs text-[#f5f0e8]/40">
              <h4 className="text-xs font-bold text-[#b8924a] uppercase tracking-[0.2em]">Legal</h4>
              <p>MahaRERA: P50500049468 | P50500080409</p>
              <a href="tel:+919920511119" className="flex items-center gap-2 text-[#b8924a] hover:text-white transition-colors mt-3"><Phone size={14} /> +91 99205 11119</a>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-white/30">
            <p>© 2026 <span className="text-white/60 font-semibold">NITPL</span>. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[#b8924a] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#b8924a] transition-colors">Terms of Use</a>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-white/30">
            <span>Powered by OG</span>
            <Image src="https://www.letsoutgrow.com/oglogo.png" alt="OG Logo" width={60} height={20} className="h-[20px] w-auto inline-block" loading="lazy" />
          </div>
        </div>
      </footer>

      {/* ═══════ FLOATING CALL & WHATSAPP BUTTONS ═══════ */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a href="https://wa.me/918956137236" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:scale-110 transition-all duration-200" aria-label="WhatsApp">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        <a href="tel:+919920511119" className="w-14 h-14 bg-[#b8924a] hover:bg-[#d4af70] text-[#0a0808] flex items-center justify-center rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:scale-110 transition-all duration-200" aria-label="Call">
          <Phone size={22} />
        </a>
      </div>

      {/* ═══════ LEAD CAPTURE MODAL (unified — auto popup + all CTA buttons) ═══════ */}
      <LeadCaptureModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

      {/* ═══════ SUCCESS MODAL ═══════ */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass w-full max-w-sm rounded-2xl p-8 text-center neu-shadow border-t-2 border-t-green-500">
            <div className="w-16 h-16 bg-green-950/50 border border-green-500/20 rounded-full flex items-center justify-center text-green-500 mx-auto mb-4"><CheckCircle size={36} /></div>
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Thank You!</h3>
            <p className="text-[#f5f0e8]/50 text-xs leading-relaxed mb-6">Our property relationship manager will contact you shortly with pricing details.</p>
            <button onClick={() => setShowSuccess(false)} className="pill-btn pill-btn-gold w-full py-3">Back to Site</button>
          </div>
        </div>
      )}

    </div>
  );
}
