import { auth } from "@/auth";
import CustomerService from "@/components/ui/CustomerService";
import LandingDemoSection from "./_components/LandingDemoSection";
import LandingFeatureSection from "./_components/LandingFeatureSection";
import LandingHeroSection from "./_components/LandingHeroSection";
import LandingServiceSection from "./_components/LandingServiceSection";
import LandingTopFloating from "./_components/LandingTopFloating";

export default async function LandingPage() {
  const session = await auth();
  return (
    <>
      <LandingHeroSection isLoggedIn={!!session} />
      <LandingFeatureSection />
      <LandingDemoSection />
      <LandingServiceSection />
      <CustomerService className="my-[8.5rem] snap-center snap-always" />
      <LandingTopFloating />
    </>
  );
}
