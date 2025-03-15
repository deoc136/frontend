'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
  const { signOut } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    // Sign out the user
    signOut();
    
    // Redirect to login page after a short delay
    const redirectTimer = setTimeout(() => {
      router.push('/auth/login');
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [signOut, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Cerrando sesión...</h1>
      <p>Serás redirigido en un momento.</p>
    </div>
  );
} 