import Section1 from "@/components/landing/Section1";
import Section3 from "@/components/landing/Section3";
import CustomerService from "@/components/ui/CustomerService";

export default function LandingPage() {
  return (
    <>
      <Section1 />
      <Section3 />
      <CustomerService className="my-[6.5rem]" />
    </>
  );
}
