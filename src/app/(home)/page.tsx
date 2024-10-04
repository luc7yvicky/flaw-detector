import { auth } from "@/auth";
import LandingDemoSection from "./_components/LandingDemoSection";
import LandingFeatureSection from "./_components/LandingFeatureSection";
import LandingHeroSection from "./_components/LandingHeroSection";
import LandingServiceSection from "./_components/LandingServiceSection";
import LandingTopFloating from "./_components/LandingTopFloating";
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
