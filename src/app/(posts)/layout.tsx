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
          zIndex: 999,
          overflow: "visible",
          backgroundColor: "#3F3F3F", // gray.dark
        }}
      />
    </>
  );
}
