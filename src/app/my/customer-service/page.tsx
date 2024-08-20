import TitleBar from "@/components/ui/TitleBar";
import CustomerService from "@/components/ui/CustomerService";

export default function CustomerServicePage() {
  return (
    <>
      <TitleBar
        title="Customer Service"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />
      <CustomerService />
    </>
  );
}
