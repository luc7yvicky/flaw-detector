import Section1 from "@/components/landing/Section1";
import Section2 from "@/components/landing/Section2";
import CustomerService from "@/components/ui/CustomerService";

export default function LandingPage() {
  return (
    <>
      <Section1 />
      <Section2 />
      <CustomerService className="my-[6.5rem]" />
    </>
  );
}
