import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function VulDBLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          boxShadow: "0px 4px 10px rgba(97, 0, 255, 0.25)",
          zIndex: 999,
          overflow: "visible",
        }}
      />
    </>
  );
}
