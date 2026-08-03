"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface LeadForm {
  name: string;
  phone: string;
  email: string;
  config: string;
}

interface LeadErrors {
  name?: string;
  phone?: string;
  email?: string;
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validate(form: LeadForm): LeadErrors {
  const e: LeadErrors = {};
  if (!form.name.trim()) e.name = "Full name is required";
  if (!form.phone.trim()) e.phone = "Mobile number is required";
  else if (!PHONE_RE.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
  if (form.email && !EMAIL_RE.test(form.email)) e.email = "Enter a valid email address";
  return e;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LeadCaptureModal({ isOpen, onClose }: LeadCaptureModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<LeadForm>({ name: "", phone: "", email: "", config: "2.5 BHK" });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [success, setSuccess] = useState(false);
  const [visible, setVisible] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // ── 1. Client mount gate — prevents any SSR/hydration discrepancy ─────────
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── 2. Trigger entry animation after modal opens ──────────────────────────
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      const raf = requestAnimationFrame(() => {
        setVisible(true);
        setTimeout(() => firstInputRef.current?.focus(), 100);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // ── 3. Keyboard handling: Escape key & focus trap ──────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { handleClose(); return; }
      if (e.key !== "Tab") return;
      const modal = document.getElementById("lead-modal-panel");
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setForm({ name: "", phone: "", email: "", config: "2.5 BHK" });
      setErrors({});
      (previousFocusRef.current as HTMLElement | null)?.focus();
    }, 280);
  }, [onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSuccess(true);

    // Send payload to Google Sheets Apps Script Web App
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhoWE8UOBwhLH22xnth2ef7XolaSt1CTjz5GkH-ABjZXE5pO_0gn4UBC9wemmtJO3D/exec";
    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        email: form.email,
        config: form.config,
        source: "Popup Lead Modal"
      }),
    }).catch(err => console.error("Google Sheet submission error:", err));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Do not render anything during SSR or before hydration completes
  if (!isMounted || !isOpen) return null;

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lcm-heading"
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ backgroundColor: "rgba(10,8,8,0.82)", backdropFilter: "blur(6px)" }}
      onClick={handleBackdropClick}
    >
      <div
        id="lead-modal-panel"
        className={`relative w-full max-w-[500px] transition-all duration-300 transform ${
          visible ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-3 opacity-0"
        }`}
        style={{
          background: "linear-gradient(165deg, #2a241c 0%, #1a1610 50%, #151210 100%)",
          borderRadius: "1rem",
          border: "1px solid rgba(194,155,87,0.35)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(194,155,87,0.1)",
        }}
      >
        {success ? (
          /* ── Success State ── */
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-5 text-green-500">
              <CheckCircle size={32} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#f5f0e8] mb-2">
              Thank You!
            </h3>
            <p className="text-[#C29B57]/70 text-sm leading-relaxed mb-7">
              Our property advisor will contact you within <strong className="text-[#C29B57]">15 minutes</strong> with pricing details and exclusive offers.
            </p>
            <button
              onClick={handleClose}
              className="px-10 py-3.5 bg-gradient-to-r from-[#C29B57] to-[#a87d3e] text-[#0a0808] rounded-full font-bold text-xs tracking-widest uppercase hover:brightness-110 transition-all shadow-lg"
            >
              Back to Website
            </button>
          </div>
        ) : (
          <>
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Close popup"
              className="absolute top-4 right-4 w-7 h-7 bg-transparent border border-[#C29B57]/25 rounded-full flex items-center justify-center text-[#C29B57]/60 hover:border-[#C29B57]/60 hover:text-[#C29B57] transition-all"
            >
              <X size={13} />
            </button>

            {/* Header */}
            <div className="pt-8 px-8 pb-0 text-center">
              <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#C29B57] mb-2">
                GET EXCLUSIVE PRICING
              </p>
              <h2 id="lcm-heading" className="font-serif text-2xl font-normal text-[#f5f0e8] leading-tight">
                Enquire Now
              </h2>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-8 flex flex-col gap-4"
            >
              {/* Name */}
              <div>
                <input
                  id="lcm-name"
                  ref={firstInputRef}
                  type="text"
                  autoComplete="name"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3.5 bg-white/[0.04] border ${
                    errors.name ? "border-red-400 focus:ring-red-400/20" : "border-[#C29B57]/30 focus:border-[#C29B57] focus:ring-[#C29B57]/15"
                  } rounded-lg text-[#f5f0e8] text-sm placeholder:text-[#C29B57]/50 outline-none transition-all focus:ring-2`}
                  value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (errors.name) setErrors(er => ({ ...er, name: undefined })); }}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1 pl-1">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <input
                  id="lcm-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="Phone Number"
                  className={`w-full px-4 py-3.5 bg-white/[0.04] border ${
                    errors.phone ? "border-red-400 focus:ring-red-400/20" : "border-[#C29B57]/30 focus:border-[#C29B57] focus:ring-[#C29B57]/15"
                  } rounded-lg text-[#f5f0e8] text-sm placeholder:text-[#C29B57]/50 outline-none transition-all focus:ring-2`}
                  value={form.phone}
                  maxLength={10}
                  onChange={e => { const v = e.target.value.replace(/\D/g, ""); setForm(f => ({ ...f, phone: v })); if (errors.phone) setErrors(er => ({ ...er, phone: undefined })); }}
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1 pl-1">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <input
                  id="lcm-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  className={`w-full px-4 py-3.5 bg-white/[0.04] border ${
                    errors.email ? "border-red-400 focus:ring-red-400/20" : "border-[#C29B57]/30 focus:border-[#C29B57] focus:ring-[#C29B57]/15"
                  } rounded-lg text-[#f5f0e8] text-sm placeholder:text-[#C29B57]/50 outline-none transition-all focus:ring-2`}
                  value={form.email}
                  onChange={e => { setForm(f => ({ ...f, email: e.target.value })); if (errors.email) setErrors(er => ({ ...er, email: undefined })); }}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1 pl-1">{errors.email}</p>}
              </div>

              {/* BHK Select */}
              <div>
                <select
                  id="lcm-config"
                  className="w-full px-4 py-3.5 bg-[#1e1a14] border border-[#C29B57]/30 rounded-lg text-[#f5f0e8] text-sm outline-none cursor-pointer focus:border-[#C29B57] transition-all"
                  value={form.config}
                  onChange={e => setForm(f => ({ ...f, config: e.target.value }))}
                >
                  <option value="2 BHK">2 BHK</option>
                  <option value="2.5 BHK">2.5 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                </select>
              </div>

              {/* Submit */}
              <div className="text-center mt-1">
                <button
                  type="submit"
                  className="px-10 py-3.5 bg-gradient-to-r from-[#C29B57] to-[#b8924a] text-[#0a0808] border-none rounded-full font-extrabold text-xs tracking-widest uppercase shadow-[0_4px_16px_rgba(194,155,87,0.3)] hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(194,155,87,0.45)] transition-all"
                >
                  Submit
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-center text-[10px] text-[#C29B57]/40 italic leading-relaxed">
                I authorize NITPL to contact me, overriding DNC/NDNC.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// ─── Auto-popup hook — starts 2 second timer ONLY after client mount ─────────
export function useAutoLeadPopup(openModal: () => void) {
  useEffect(() => {
    // Only runs on the client after hydration is complete
    const timer = setTimeout(() => {
      openModal();
    }, 2000);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
