import HeroSection from "@/components/home/HeroSection";
import Header from "@/components/layout/Header";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-poppins">
      <Header />
      <HeroSection />
    </div>
  );
}
