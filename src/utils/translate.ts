import axios from "axios";

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "en",
      target: targetLang,
      format: "text"
    });
    return response.data.translatedText;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
};

// ✅ Optional: For Google Translate Widget programmatic change
export function changeLanguage(lang: string) {
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = lang; // Example: 'hi' for Hindi
    select.dispatchEvent(new Event("change"));
  }
}
