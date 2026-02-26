import Sidebar from '@/components/dashboard/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
}