export default function MyLibraryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="mx-auto mb-[7.75rem] flex w-full max-w-[82.125rem] flex-col gap-y-[7.75rem]">
      {children}
    </section>
  );
}
