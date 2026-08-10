"use client";

import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { trackLeadFormSubmit } from "@/lib/gtm";
import { submitLead } from "@/lib/leadSubmission";

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
  onSuccess?: () => void;
}

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

function validate(form: LeadForm): LeadErrors {
  const e: LeadErrors = {};
  if (!form.name.trim()) e.name = "Full name is required";
  if (!form.phone.trim()) e.phone = "Phone number is required";
  else if (!PHONE_RE.test(form.phone.trim())) e.phone = "Enter a valid 10-digit phone number";
  if (!form.email.trim()) e.email = "Email address is required";
  else if (!EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address";
  return e;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LeadCaptureModal({ isOpen, onClose, onSuccess }: LeadCaptureModalProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<LeadForm>({ name: "", phone: "", email: "", config: "2.5 BHK" });
  const [errors, setErrors] = useState<LeadErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // ── 1. Client mount gate — prevents any SSR/hydration discrepancy ─────────
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ── 2. Trigger entry animation after modal opens ──────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      setVisible(true);
      setIsSubmitting(false);
      setForm({ name: "", phone: "", email: "", config: "2.5 BHK" });
      setErrors({});
      document.body.style.overflow = "hidden";
      setTimeout(() => firstInputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
      setVisible(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── 3. Accessibility & Keyboard trap ─────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { handleClose(); return; }
      if (e.key !== "Tab") return;
      const modal = document.getElementById("lead-modal-panel");
      if (!modal) return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
      );
      if (focusable.length === 0) return;
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
      setIsSubmitting(false);
      setForm({ name: "", phone: "", email: "", config: "2.5 BHK" });
      setErrors({});
      if (previousFocusRef.current && typeof (previousFocusRef.current as any).focus === "function") {
        try {
          (previousFocusRef.current as HTMLElement).focus();
        } catch (_) {}
      }
    }, 280);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);

    const success = await submitLead({
      fullName: form.name,
      mobileNumber: form.phone,
      emailAddress: form.email,
      config: form.config,
      source: "Popup Lead Modal",
    });

    if (success) {
      trackLeadFormSubmit();
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Do not render anything during SSR or before hydration completes
  if (!isMounted || !isOpen) return null;

  const modalContent = (
    <div
      suppressHydrationWarning
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
              disabled={isSubmitting}
              className="px-10 py-3.5 bg-gradient-to-r from-[#C29B57] to-[#b8924a] text-[#0a0808] border-none rounded-full font-extrabold text-xs tracking-widest uppercase shadow-[0_4px_16px_rgba(194,155,87,0.3)] hover:scale-[1.01] hover:shadow-[0_8px_24px_rgba(194,155,87,0.45)] transition-all disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-[10px] text-[#C29B57]/40 italic leading-relaxed">
            I authorize NITPL to contact me, overriding DNC/NDNC.
          </p>
        </form>
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
