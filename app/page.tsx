

import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { clinicRoutes } from '@/lib/routes';
import ServicesList from './patient/services/views/ServicesList';
import { Service } from '@/types/service';
import { getAllServices } from '@/services/service';

interface IServicesList {
  services: Service[];
}


export default async function Page() {
  const services = (await getAllServices()).data;
  // Show loading state while determining auth status
  return (
    <ServicesList
       services={services}//.filter(({ active, removed }) => active && !removed)}
    />
  );
}
