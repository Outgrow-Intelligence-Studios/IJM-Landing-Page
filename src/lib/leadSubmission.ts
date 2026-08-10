export interface LeadData {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  message?: string;
  config?: string;
  source?: string;
}

export function getUtmParams() {
  if (typeof window === "undefined") {
    return {
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
      utm_adgroup: "",
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_term: params.get("utm_term") || "",
    utm_content: params.get("utm_content") || "",
    utm_adgroup: params.get("utm_adgroup") || "",
  };
}

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwgKCi77e96FlwyQaZm5PV6UUYiBfS6xnmpuIfi8X7OuX2IHTVsn9p7HXhlm8aBKsVA/exec";

export async function submitLead(data: LeadData): Promise<boolean> {
  const utms = getUtmParams();
  const payload = {
    fullName: data.fullName ? data.fullName.trim() : "",
    mobileNumber: data.mobileNumber ? data.mobileNumber.trim() : "",
    emailAddress: data.emailAddress ? data.emailAddress.trim() : "",
    message: data.message ? data.message.trim() : "",
    config: data.config || "2.5 BHK",
    source: data.source || "Website Lead Form",
    utm_source: utms.utm_source,
    utm_medium: utms.utm_medium,
    utm_campaign: utms.utm_campaign,
    utm_term: utms.utm_term,
    utm_content: utms.utm_content,
    utm_adgroup: utms.utm_adgroup,
  };

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (err) {
    console.error("Lead submission error:", err);
    return false;
  }
}
