import CustomerService from "@/components/ui/CustomerService";
import { IconCaretLeft } from "@/components/ui/Icons";

export default function CustomerServicePage() {
  return (
    <>
      <button className="flex-center-center mx-auto mt-[4.5rem] h-[4.938rem] w-[35.125rem] gap-5 rounded-full border-4 border-primary-500 p-5 text-[2.5rem] font-normal leading-[3rem] tracking-[-0.01em] text-primary-500">
        <IconCaretLeft />
        <span>Customer Service center</span>
      </button>
      <CustomerService />
    </>
  );
}
