import { createContext, useContext, useState, ReactNode } from "react";
import { translateText } from "@/utils/translate";

interface TranslationContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  translate: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextProps | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState("en");

  const translate = async (text: string) => {
    if (language === "en") return text;
    return await translateText(text, language);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error("useTranslationContext must be used within TranslationProvider");
  return context;
};
