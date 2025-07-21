// Map your i18n language codes to Web‑Speech API locales
export const speechLocale = (lng: string) => {
  switch (lng) {
    case "hi": return "hi-IN";   // Hindi
    case "te": return "te-IN";   // Telugu
    // add more as you translate the UI:
    // case "bn": return "bn-IN";
    default:   return "en-IN";   // fallback – Indian English
  }
};
