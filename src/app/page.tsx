import LandingDemoSection from "@/components/landing/LandingDemoSection";
import LandingFeatureSection from "@/components/landing/LandingFeatureSection";
import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingServiceSection from "@/components/landing/LandingServiceSection";
import CustomerService from "@/components/ui/CustomerService";
import { redirectIfLoggedIn } from "@/lib/redirect";

export default async function LandingPage() {
  await redirectIfLoggedIn("/my/repos");
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
