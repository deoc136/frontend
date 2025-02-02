'use client';

import Button, { Variant } from './Button';
import Card from './Card';
//import { useAppSelector } from '@/lib/hooks/redux-hooks';
//import useClinicCurrency from '@/lib/hooks/useClinicCurrency';
import { clinicRoutes } from '@/lib/routes';
import { formatPrice, secondsToTimeExtended } from '../../lib/utils';
import { Service } from '@/types/service';
import Image from 'next/image';
import useDictionary from '../../lib/hooks/useDictionary';
import es from '../../dictionaries/es.json';

interface IServiceCard {
   service: Service;
}

export default function ServiceCard({ service }: IServiceCard) {
   const dic = useDictionary();

   //const clinicCurrency = useClinicCurrency();


   return (
      <>
         <Card className="grid gap-5 !border-none p-5">
            <div className="relative aspect-[310/164] w-full overflow-hidden rounded-lg">
            
               <Image
                  className="object-cover object-center"
                  fill
                  alt="service image"
                  quality={90} 
                  src={
                     service.picture_url?.length
                        ? service.picture_url
                        : '/default_service_image.png'
                  }
               />
               
            </div>
            <div className="flex flex-col">
               <h2 className="mb-1 w-max text-base font-semibold lg:mb-2 lg:text-lg">
                  {service.name}
               </h2>
               <p className="font-semibold text-primary-variant lg:text-lg">
                  {/* Part of the 
                  <span className="font-semibold">
                     {Number(service.price)}
                     {//formatPrice(Number(service.price), clinicCurrency)}
                     }
                  </span>{' '}
                  
                  <span className="text-xs font-normal lg:text-sm">
                     /{dic.texts.services.per_session?.toLowerCase()}
                  </span>
                  */}
               </p>
            </div>
            <p className="w-full truncate text-xs text-on-background-text lg:text-sm">
               {service.description}
            </p>
            <p className="text-xs text-on-background-text lg:text-sm">
               <span className="font-bold">
                  {dic.texts.attributes.duration}:
               </span>{' '}
               {secondsToTimeExtended(
                  Number(service.service_duration ?? 0),
                  dic,
               )}
            </p>
            <Button
               className="!py-2 text-sm lg:text-base"
               href={clinicRoutes().patient_services_id(service.id).details}
               variant={Variant.secondary}
            >
               {dic.texts.flows.detail}
            </Button>
         </Card>
      </>
   );
}
