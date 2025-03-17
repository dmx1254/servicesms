import HeroSection from "@/components/home/HeroSection";
import ServicesGrid from "@/components/home/ServicesGrid";
import FeaturesSection from "@/components/home/FeaturesSection";
import IntegrationSection from "@/components/home/IntegrationSection";
import TrustedBy from "@/components/TrustedBy";
import CampaignSection from "@/components/CampaignSection";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Home() {
  return (
    <main className="min-h-screen font-rubik">
      <HeroSection />
      <ServicesGrid />
      <CampaignSection />
      <FeaturesSection />
      <TrustedBy />
      <IntegrationSection />
      <TestimonialsSection />
    </main>
  );
}
