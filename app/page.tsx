
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


export default async function Page() {
  const services = (await getAllServices()).data;

  return (
     <ServicesList
        services={services}//.filter(({ active, removed }) => active && !removed)}
     />
   );
}
