'use client';

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { clinicRoutes } from '@/lib/routes';
import type { Metadata } from 'next';
import ServicesList from './patient/services/views/ServicesList';
import { Service } from '@/types/service';
import { getAllServices } from '@/services/service';

interface IServicesList {
  services: Service[];
}

export const metadata: Metadata = {
  title: 'APP DCC',
};

export default function Home() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);
  const router = useRouter();

  useEffect(() => {
    if (authStatus === 'authenticated') {
      // If user is authenticated, redirect to patient services
      router.push(clinicRoutes().patient_services);
    } else if (authStatus === 'unauthenticated') {
      // If user is not authenticated, redirect to login
      router.push('/auth/login');
    }
    // If authStatus is 'configuring', we'll wait for it to resolve
  }, [authStatus, router]);

  // Show loading state while determining auth status
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Cargando...</h1>
    </div>
  );
}
