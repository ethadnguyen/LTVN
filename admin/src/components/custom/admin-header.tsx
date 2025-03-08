'use client';
import { InputSearch } from '@/components/custom/input-search';
import { SidebarTrigger } from '@/components/ui/sidebar';

const AdminHeader = () => {
  return (
    <header className='sticky top-0 z-50 bg-sidebar border-b'>
      <div className='container mx-auto flex items-center justify-between py-2 px-4'>
        <div className='text-2xl font-bold dark:text-white flex gap-4'>
          <SidebarTrigger />
          <p className='font-medium text-xl'>Admin E-thad-commerce</p>
        </div>

        <InputSearch className='pl-4 lg:w-[260px]' />
      </div>
    </header>
  );
};

export default AdminHeader;
