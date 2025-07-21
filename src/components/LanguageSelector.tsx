import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import i18n from "@/i18n";

const LanguageSelector = () => {
  const currentLang = localStorage.getItem("preferredLanguage") || "en";

  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  return (
    <Select defaultValue={currentLang} onValueChange={handleChange}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">🇬🇧 English</SelectItem>
        <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
        <SelectItem value="te">🇮🇳 తెలుగు</SelectItem>
        <SelectItem value="ta">🇮🇳 தமிழ்</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
