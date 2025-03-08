import type React from 'react';
import './globals.css';
import type { Metadata } from 'next';

import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/menu/admin-sidebar';
import AdminHeader from '@/components/custom/admin-header';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'A comprehensive admin dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='vi'>
      <body>
        <SidebarProvider className='w-full'>
          <AdminSidebar />
          <div className='w-full'>
            <AdminHeader />
            {children}
            <Toaster />
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
