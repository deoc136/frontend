'use client';

import Dialog, { IDialog } from '@/components/modal/Dialog';
import { IModal } from '@/components/modal/Modal';
import ModalTrigger, { IModalTrigger } from '@/components/modal/ModalTrigger';
import Button, { Variant } from '@/components/shared/Button';
import { ListBox } from '@/components/shared/ListBox';
import Sidebar from '@/components/sidebar/Sidebar';
import SignOutButton from '@/components/sidebar/SignOutButton';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import { clinicRoutes } from '@/lib/routes';
import Image from 'next/image';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { Item, Section } from 'react-stately';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';

interface IPatientMobileSidebar {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PatientMobileSidebar({
   isOpen,
   setIsOpen,
}: IPatientMobileSidebar) {


   const isLg = useMediaQuery('(min-width:1024px)');

   const router = useRouter();

   useEffect(() => {
      isLg && setIsOpen(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLg]);

   return (
      <ModalTrigger
         className="bot-0 absolute left-0 top-0 translate-x-0 animate-slide lg:hidden"
         isOpen={isOpen}
      >
         {() => (
            <Dialog className="grid h-screen max-h-none w-[90vw] grid-rows-[auto_auto_1fr] !bg-foundation pb-5 pt-10 md:w-[40vw]">
               <div className="mb-5 grid gap-5 px-5">
                  <Button
                     className="ml-auto !w-max bg-transparent !p-0"
                     onPress={() => {
                        setIsOpen(false);
                     }}
                  >
                     <CloseRoundedIcon className="!fill-black" />
                  </Button>
                  
                     <>
                        <Button href={clinicRoutes().login}>
                           Iniciar sesión
                        </Button>
                        <Button
                           href={clinicRoutes().register}
                           variant={Variant.secondary}
                        >
                           Registrarse
                        </Button>
                     </>
                  
               </div>
               <hr className="border-on-background-text" />
               <Sidebar
                  className="block !h-full w-full max-w-none bg-transparent !p-0"
                  noImage
                  signOutButton={
                     <div className="flex h-full items-end">
                        <SignOutButton
                           className="!h-max !bg-transparent !text-error"
                           route={clinicRoutes().login}
                        />
                     </div>
                  }
                  items={[ListBox]}
               >
                  <Item textValue={clinicRoutes().patient_services}>
                     Servicios
                  </Item>
                  
                     <Section title="Mis citas">
                        <Item
                           textValue={
                              clinicRoutes()
                                 .patient_appointments_actives
                           }
                        >
                           Citas agendadas
                        </Item>
                        <Item
                           textValue={
                              clinicRoutes()
                                 .patient_appointments_history
                           }
                        >
                           Historial de citas
                        </Item>
                     </Section>
               </Sidebar>
            </Dialog>
         )}
      </ModalTrigger>
   );
}
