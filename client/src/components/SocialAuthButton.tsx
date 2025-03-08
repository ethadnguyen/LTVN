'use client';

import { Button } from '@/components/ui/button';
import { Facebook, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function SocialAuthButtons() {
  const [isLoading, setIsLoading] = useState<{
    google: boolean;
    facebook: boolean;
  }>({
    google: false,
    facebook: false,
  });

  const handleGoogleLogin = async () => {
    setIsLoading((prev) => ({ ...prev, google: true }));
    // Implement Google OAuth login here
    setTimeout(
      () => setIsLoading((prev) => ({ ...prev, google: false })),
      1000
    );
  };

  const handleFacebookLogin = async () => {
    setIsLoading((prev) => ({ ...prev, facebook: true }));
    // Implement Facebook OAuth login here
    setTimeout(
      () => setIsLoading((prev) => ({ ...prev, facebook: false })),
      1000
    );
  };

  return (
    <div className='flex flex-col gap-3 w-full'>
      <Button
        variant='outline'
        type='button'
        disabled={isLoading.google || isLoading.facebook}
        onClick={handleGoogleLogin}
      >
        {isLoading.google ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Image
            src='/google.svg'
            alt='Google'
            width={16}
            height={16}
            className='mr-2'
          />
        )}
        Continue with Google
      </Button>
      <Button
        variant='outline'
        type='button'
        disabled={isLoading.google || isLoading.facebook}
        onClick={handleFacebookLogin}
      >
        {isLoading.facebook ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <Facebook className='mr-2 h-4 w-4' />
        )}
        Continue with Facebook
      </Button>
    </div>
  );
}
