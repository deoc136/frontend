import ServicesList from '../patient/services/views/ServicesList';
import { Service } from '@/types/service';
import { getAllServices } from '@/services/service';
import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Servicios'
};

export const revalidate = 0;

export default async function Page() {
   const services = (await getAllServices()).data;

   return (
      <ServicesList
         services={services}
      />
   );
} 