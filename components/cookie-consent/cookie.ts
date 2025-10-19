"use client";

import { sendGTMEvent } from "@next/third-parties/google";

type ConsentValue = "granted" | "denied";

export type GTMConsentState = {
  consent_analytics: ConsentValue;
  consent_marketing: ConsentValue;
  consent_personalization: ConsentValue;
};

export type ConsentState = {
  essential: true;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
};

export const COOKIE_CONSENT_KEY = "cookie-consent";

const REJECT_ALL_CONSENT: ConsentState = {
  essential: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

const ACCEPT_ALL_CONSENT: ConsentState = {
  essential: true,
  analytics: true,
  marketing: true,
  personalization: true,
};

export const DEFAULT_CONSENT = REJECT_ALL_CONSENT;

export function getConsentFromStorage(): ConsentState | null {
  try {
    const savedPreference = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!savedPreference) return null;

    const parsedPreference = JSON.parse(savedPreference);
    return {
      essential: true,
      analytics: parsedPreference.analytics ?? false,
      marketing: parsedPreference.marketing ?? false,
      personalization: parsedPreference.personalization ?? false,
    };
  } catch {
    return null;
  }
}

export function saveConsentToStorage(consent: ConsentState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  } catch (error) {
    console.error("Failed to save cookie consent:", error);
  }
}

export function acceptAllCookies(): ConsentState {
  const consent = ACCEPT_ALL_CONSENT;
  updateCookieConsent(consent);
  return consent;
}

export function rejectAllCookies(): ConsentState {
  const consent = REJECT_ALL_CONSENT;
  updateCookieConsent(consent);
  return consent;
}

export function updateCookieConsent(consent: ConsentState): void {
  saveConsentToStorage(consent);
  updateGTMConsent(consent);
}

function convertToGTMConsent(consent: ConsentState): GTMConsentState {
  return {
    consent_analytics: consent.analytics ? "granted" : "denied",
    consent_marketing: consent.marketing ? "granted" : "denied",
    consent_personalization: consent.personalization ? "granted" : "denied",
  };
}

function updateGTMConsent(consent: ConsentState): void {
  const gtmConsent = convertToGTMConsent(consent);
  sendGTMEvent({
    event: "cookie_consent_updated",
    ...gtmConsent,
  });
}
