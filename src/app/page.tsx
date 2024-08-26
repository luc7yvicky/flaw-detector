import LandingSection1 from "@/components/landing/LandingSection1";
import CustomerService from "@/components/ui/CustomerService";

export default function LandingPage() {
  return (
    <>
      <LandingSection1 />
      <CustomerService className="my-[6.5rem]" />
    </>
  );
}
