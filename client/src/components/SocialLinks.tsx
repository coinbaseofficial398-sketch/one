import { Button } from "@/components/ui/button";
import { Zap, ChevronDown } from "lucide-react";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";

export default function SocialLinks() {
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    toast({
      title: "Language Updated",
      description: `Language changed to ${event.target.selectedOptions[0].text}`,
    });
  };

  const { data: socialLinks } = useQuery({
    queryKey: ["/api/social-links"],
  });

  const openTelegramGroups = () => {
    toast({
      title: "Opening Telegram Groups",
      description: "Redirecting to BitNest Telegram groups...",
    });
    window.open(socialLinks?.telegram?.groups || "https://t.me/bitnest_groups", "_blank");
  };

  const openTelegramNews = () => {
    toast({
      title: "Opening Telegram News",
      description: "Redirecting to BitNest news channel...",
    });
    window.open(socialLinks?.telegram?.news || "https://t.me/bitnest_news", "_blank");
  };

  return (
    <section className="px-4 mb-8" data-testid="social-links">
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-bitnest rounded-lg flex items-center justify-center">
            <Zap className="text-black text-sm" />
          </div>
          <span className="text-sm font-semibold text-gray-400">BITNEST</span>
        </div>

        <div className="relative">
          <select
            className="bg-dark-card border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 appearance-none pr-8"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            data-testid="select-language"
          >
            <option value="en">Choose Language</option>
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="es">Español</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
          onClick={openTelegramGroups}
          data-testid="button-telegram-groups"
        >
          <span className="text-lg">📱</span>
          <span className="font-semibold">Telegram Groups</span>
        </Button>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors"
          onClick={openTelegramNews}
          data-testid="button-telegram-news"
        >
          <span className="text-lg">📱</span>
          <span className="font-semibold">Telegram News</span>
        </Button>
      </div>
    </section>
  );
}