'use client';

import React from 'react';

interface PageBodyProps {
  children: React.ReactNode;
}

const PageBody: React.FC<PageBodyProps> = ({ children }) => {
  return (
    <main className='flex min-h-screen justify-center p-4 gap-4'>
      <div className='w-full max-w-screen-xl'>{children}</div>
    </main>
  );
};

export { PageBody };
