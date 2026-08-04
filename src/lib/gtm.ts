declare global {
  interface Window {
    dataLayer?: Record<string, any>[];
  }
}

/**
 * Pushes GTM lead_form_submit event to dataLayer safely on client side.
 */
export function trackLeadFormSubmit() {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "lead_form_submit",
    });
  }
}
