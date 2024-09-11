import { auth } from "@/auth";
import LandingDemoSection from "@/components/landing/LandingDemoSection";
import LandingFeatureSection from "@/components/landing/LandingFeatureSection";
import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingServiceSection from "@/components/landing/LandingServiceSection";
import LandingTopFloating from "@/components/landing/LandingTopFloating";
import CustomerService from "@/components/ui/CustomerService";

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="relative">
      <LandingHeroSection isLoggedIn={!!session} />
      <LandingFeatureSection />
      <LandingDemoSection />
      <LandingServiceSection />
      <CustomerService className="my-[6.5rem]" />
      <LandingTopFloating />
    </div>
  );
}
