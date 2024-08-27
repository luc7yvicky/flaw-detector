import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingFeatureSection from "@/components/landing/LandingFeatureSection";
import LandingDemoSection from "@/components/landing/LandingDemoSection";
import LandingServiceSection from "@/components/landing/LandingServiceSection";
import CustomerService from "@/components/ui/CustomerService";

export default async function LandingPage() {
  return (
    <>
      <LandingHeroSection />
      <LandingFeatureSection />
      <LandingDemoSection />
      <LandingServiceSection />
      <CustomerService className="my-[6.5rem]" />
    </>
  );
}
