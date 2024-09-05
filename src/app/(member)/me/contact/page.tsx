import TitleBar from "@/components/ui/TitleBar";
import CustomerService from "@/components/ui/CustomerService";

export default function ContactPage() {
  return (
    <div className="flex w-full max-w-[96.125rem] flex-col gap-y-[7.75rem]">
      <TitleBar
        title="Customer Service"
        align="center"
        className="mb-0 mt-[4.5rem]"
      />
      <CustomerService />
    </div>
  );
}
