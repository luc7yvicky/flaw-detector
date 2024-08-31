import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingFeatureSection from "@/components/landing/LandingFeatureSection";
import LandingDemoSection from "@/components/landing/LandingDemoSection";
import LandingServiceSection from "@/components/landing/LandingServiceSection";
import CustomerService from "@/components/ui/CustomerService";
import { auth } from "@/auth";

export default async function LandingPage() {
  const session = await auth();
  return (
    <>
      <LandingHeroSection isLoggedIn={!!session} />
      <LandingFeatureSection />
      <LandingDemoSection />
      <LandingServiceSection />
      <CustomerService className="my-[6.5rem]" />
    </>
  );
}
