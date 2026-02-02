// app/(dashboard)/layout.tsx
import Header from '@/components/MainHeader';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </>
  );
}