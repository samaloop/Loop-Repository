import './globals.css';
import Header from '@/components/MainHeader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {/* Header akan muncul di semua halaman dashboard/program */}
        
        {/* Main Content */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}