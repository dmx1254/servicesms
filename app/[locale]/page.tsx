import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";
import PricingSection from "@/components/home/PricingSection";

export default function Home() {
  return (
    <div className="font-poppins">
      <Header />
      <HeroSection />
      <PricingSection />
    </div>
  );
}
