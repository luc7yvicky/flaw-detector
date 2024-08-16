export default function MyLibraryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="mx-auto mb-[7.75rem] mt-[3.375rem] flex w-[82.125rem] flex-col gap-y-[7.75rem]">
      {children}
    </section>
  );
}
