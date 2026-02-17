'use client';

import { createContext, useContext, useState, useEffect } from "react";
import nlTranslations from "../i18n/locales/nl.json";
import enTranslations from "../i18n/locales/en.json";

const CreativeChatI18nContext = createContext();

export const useCreativeChatI18n = () => {
  const context = useContext(CreativeChatI18nContext);
  if (!context) {
    throw new Error("useCreativeChatI18n must be used within CreativeChatI18nProvider");
  }
  return context;
};

const STORAGE_KEY = "creativeChat_language";

export function CreativeChatI18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "nl";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "en" ? "en" : "nl";
  });

  const translations = {
    en: enTranslations,
    nl: nlTranslations,
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === "object") {
        value = value[k];
      } else {
        return key;
      }
    }
    return value || key;
  };

  const changeLanguage = (lang) => {
    if (lang === "nl" || lang === "en") setLanguage(lang);
  };

  return (
    <CreativeChatI18nContext.Provider value={{ t, language, changeLanguage }}>
      {children}
    </CreativeChatI18nContext.Provider>
  );
}
