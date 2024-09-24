'use client';

import Button from '@/app/components/shared/Button';
import Card from '@/app/components/shared/cards/Card';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
//import useClinicCurrency from '@/lib/hooks/useClinicCurrency';
import useDictionary from '@/lib/hooks/useDictionary';
import { GlobalRoute, clinicRoutes } from '@/lib/routes';
import { formatPrice } from '@/lib/utils';
import { Service } from '@/types/service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ISessionCard {
   description?: string;
   price: number;
   url: GlobalRoute;
   title: string;
}

export default function SessionCard({
   price,
   description,
   url,
   title,
}: ISessionCard) {
   const dic = useDictionary();

   const clinicCurrency = "COP"

   const router = useRouter();

   const [isLoginOpen, setIsLoginOpen] = useState(false);

   return (
      <>
         <Card className="min-w-[calc(50% - 10px)] flex w-full flex-col justify-between gap-7 text-center lg:gap-10">
            <h2 className="text-2xl font-semibold">{dic.texts.services.first_appointment} </h2>
            {description && <p>{description}</p>}
            <p className="text-3xl font-bold">
               {//formatPrice(price, clinicCurrency)
               }
               $90.000 COP
            </p>
            <Button
               className="self-center lg:max-w-sm"
               onPress={() =>
                  router.push("https://api.whatsapp.com/send/?phone=573105345062&text&type=phone_number&app_absent=0") 
               }
            >
               {dic.texts.flows.book}
            </Button>
         </Card>
      </>
   );
}
