import Section1 from "@/components/landing/Section1";
import Section2 from "@/components/landing/Section2";
import Section3 from "@/components/landing/Section3";
import CustomerService from "@/components/ui/CustomerService";

export default async function LandingPage() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <CustomerService className="my-[6.5rem]" />
    </>
  );
}
