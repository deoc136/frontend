'use client';

import { Service } from '@/types/service';
import ServiceCard from '@/app/components/ServiceCard';
import { useEffect, useState } from 'react';
import { secondsToTimeExtended } from '@/lib/utils';
import TextField from '@/app/components/TextField';
import SessionCard from '../[id]/details/components/SessionCard';
import { clinicRoutes } from '@/lib/routes';
import { createPortal } from 'react-dom';
import useDictionary from '@/lib/hooks/useDictionary';

interface IServicesList {
   services: Service[];
}

export default function ServicesList({ services }: IServicesList) {
   const dic = useDictionary();
   const [search, setSearch] = useState('');
   const [page, setPage] = useState(0);
   const limit = 15;
   const [patientNavbar, setPatientNavbar] = useState<Element | null>(null);

   function filter($services: Service[]) {
      return $services.filter(el =>
         search.length
            ? [
                 el.price,
                 secondsToTimeExtended(Number(el.service_duration)),
                 el.name,
              ].some(att => att.toLowerCase().includes(search.toLowerCase()))
            : true,
      );
   }

   useEffect(() => {
      setPage(0);
   }, [search, services.length]);

   useEffect(() => {
      setPatientNavbar(document.querySelector('#patient-navbar') ?? null);
   }, []);

   return (
      <>
         {patientNavbar &&
            createPortal(
               <>
                  <h1 className="mb-3 text-xl font-semibold lg:mb-5 lg:text-2xl text-white">
                     {dic.pages.patient.services.title}
                  </h1>
                  <TextField
                     aria-label="search"
                     value={search}
                     onChange={setSearch}
                     className="w-full text-xs lg:text-base"
                     placeholder={dic.texts.flows.search}
                  />
               </>,
               patientNavbar,
            )}
         <section className="grid min-h-full grid-rows-[1fr_auto] gap-10 xl:px-8">
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
               {filter(services)
                  .slice(page * limit, page * limit + limit)
                  .map(service => (
                     <ServiceCard key={service.id} service={service} />
                  ))}
            </div>

            <div className="flex flex-col gap-x-5 gap-y-10 md:flex-row">
               <SessionCard
                  price={9000}
                  title={`1 ${dic.texts.various.session?.toLowerCase()}`}
                  url={clinicRoutes().patient_services}
               />
            </div>
         </section>

         {/* WhatsApp Icon */}
         <a
            href="https://wa.me/573105345062?text=Hola,%20vi%20tus%20servicios%20en%20la%20p%C3%A1gina%20web%20y%20me%20interesa%20m%C3%A1s%20informaci%C3%B3n.&utm_source=website&utm_medium=button&utm_campaign=wa-button" // Replace with your WhatsApp link
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-40 right-1 md:right-5 z-50"
         >
            <img
               src="https://appdccimages.s3.us-east-1.amazonaws.com/Services/waicon.svg"
               alt="Contact us on WhatsApp"
               className="w-12 h-12" // Adjust size as needed
            />
         </a>
      </>
   );
}
