'use client';

import { PropsWithChildren } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthProvider from '@/components/providers/AuthProvider';

export default function PatientLayout({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <PatientLayoutContent>{children}</PatientLayoutContent>
    </AuthProvider>
  );
}

function PatientLayoutContent({ children }: PropsWithChildren) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [authStatus, router]);

  if (authStatus !== 'authenticated') {
    return null;
  }

  return <>{children}</>;
}
