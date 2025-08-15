import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NavigationZone from "@/components/NavigationZone";
import ProductCards from "@/components/ProductCards";
import AboutSection from "@/components/AboutSection";
import AutomationFeature from "@/components/AutomationFeature";
import TechnicalIntegrations from "@/components/TechnicalIntegrations";
import SocialLinks from "@/components/SocialLinks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface text-foreground overflow-x-hidden">
      <Header />
      <HeroSection />
      <NavigationZone />
      <ProductCards />
      <AboutSection />
      <AutomationFeature />
      <TechnicalIntegrations />
      <SocialLinks />
      <Footer />
    </div>
  );
}
