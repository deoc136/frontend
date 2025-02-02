'use client';

import Button, { Variant } from '@/components/shared/Button';
import { clinicRoutes } from '@/lib/routes';
import { User } from '@/types/user';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux-hooks';
import { Key, useEffect, useRef, useState } from 'react';
import {
   cutFullName,
   makeNegativeNumberZero,
} from '@/lib/utils';
import { Item, SortDirection } from 'react-stately';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { changeTitle } from '@/lib/features/title/title_slice';
import { Select } from '@/app/components/inputs/Select';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

interface IDetailsView {
   user: User;
}

export default function DetailsView({
   user
}: IDetailsView) {
   const router = useRouter();
   const dispatch = useAppDispatch();

   const { current: today } = useRef(new Date());

   const directionState = useState<SortDirection>('ascending');
   const columnState = useState<Key>();


   useEffect(() => {
      dispatch(
         changeTitle({
            goBackRoute: clinicRoutes().receptionist_patients,
            value: 'Pacientes / Detalles del paciente',
         }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return (
      <>
         <div className="my-12 grid grid-cols-[1fr_3fr] gap-14">
            <div className="mx-10 flex flex-col items-center">
               <div className="relative mb-10 aspect-square w-full">
                  <Image
                     src={
                        user.profile_picture.length
                           ? user.profile_picture
                           : '/default_profile_picture.svg'
                     }
                     className="rounded-full object-cover object-center"
                     alt="user image"
                     fill
                  />
               </div>
               <h2 className="text-lg font-semibold">
                  {cutFullName(user.names, user.last_names)}
               </h2>
            </div>
            <div className="grid h-max gap-10">
               <div className="flex w-full items-center justify-between">
                  <h3 className="text-xl">Datos del paciente</h3>
                  <Select
                     className="!px-12"
                     triggerContent={
                        <div className="flex w-min items-center justify-center gap-2">
                           <AddRoundedIcon />
                           Crear reserva
                        </div>
                     }
                     onSelectionChange={route =>
                        !!route && router.push(route.toString())
                     }
                  >
                     <Item
                        aria-label="single"
                        textValue="Cita individual"
                        key={
                           clinicRoutes()
                              .receptionist_appointments_actives_create_single
                        }
                     >
                        <div className="w-full py-3 pl-8">Cita individual</div>
                     </Item>
                     <Item
                        aria-label="package"
                        textValue="Reservar paquete"
                        key={
                           clinicRoutes()
                              .receptionist_appointments_actives_create_package
                        }
                     >
                        <div className="w-full py-3 pl-8">Reservar paquete</div>
                     </Item>
                  </Select>
               </div>
               <section className="grid grid-cols-2 gap-5">
                  <div>
                     <p className="mb-2 font-semibold">Nombres:</p>
                     <p className="text-on-background-text">{user.names}</p>
                  </div>
                  <div>
                     <p className="mb-2 font-semibold">Apellidos:</p>
                     <p className="text-on-background-text">
                        {user.last_names}
                     </p>
                  </div>
                  <div>
                     <p className="mb-2 font-semibold">Fecha de nacimiento:</p>
                     <p className="text-on-background-text">
                        {user.birth_date
                           ? (date =>
                                `${date.getDate()}/${
                                   date.getMonth() + 1
                                }/${date.getFullYear()}`)(
                                new Date(user.birth_date),
                             )
                           : 'No registra'}
                     </p>
                  </div>
                  <div>
                     <p className="mb-2 font-semibold">Edad:</p>
                     <p className="text-on-background-text">
                        {user.birth_date
                           ? makeNegativeNumberZero(
                                (date =>
                                   today.getFullYear() -
                                   date.getFullYear() +
                                   (today.getMonth() > date.getMonth()
                                      ? 1
                                      : 0))(new Date(user.birth_date)),
                             )
                           : 'No registra'}
                     </p>
                  </div>
                  <div>
                     <p className="mb-2 font-semibold">Sexo:</p>
                     <p className="break-words text-on-background-text">
                        {user.genre
                           ? user.genre
                           : 'No registra'}
                     </p>
                  </div>
                  <div>
                     <p className="mb-2 font-semibold">Nacionalidad:</p>
                     <p className="break-words text-on-background-text">
                         {user.nationality}
                     </p>
                  </div>
               </section>
                  <>
                     <h3 className="text-xl">Datos de contacto</h3>
                     <section className="grid grid-cols-2 gap-5">
                        <div>
                           <p className="mb-2 font-semibold">
                              Correo electrónico:
                           </p>
                           <p className="text-on-background-text">
                              {user.email}
                           </p>
                        </div>
                        <div>
                           <p className="mb-2 font-semibold">Teléfono:</p>
                           <p className="text-on-background-text">
                              {user.phone}
                           </p>
                        </div>
                        <div className="col-span-2">
                           <p className="mb-2 font-semibold">
                              Dirección de residencia:
                           </p>
                           <p className="break-words text-on-background-text">
                              {user.address}
                           </p>
                        </div>
                        <div>
                           <p className="mb-2 font-semibold">
                              País de residencia:
                           </p>
                           <p className="text-on-background-text">
                               {user.residence_country}
                           </p>
                        </div>
                        <div>
                           <p className="mb-2 font-semibold">
                              Ciudad y región de residencia:
                           </p>
                           <p className="text-on-background-text">
                              {user.residence_city}
                           </p>
                        </div>
                     </section>
                  </>
               
               <h3 className="text-xl">Documentos adjuntos</h3>
               <section className="flex justify-between">
                  <h3 className="text-xl">Historia clínica</h3>
                  <Button
                     variant={Variant.secondary}
                     className="flex !w-max flex-none items-center justify-center gap-2 !px-10"
                     href={
                        clinicRoutes().receptionist_patients_id(user.id)
                           .details_history
                     }
                  >
                     Abrir historia clínica <ArrowForwardRoundedIcon />
                  </Button>
               </section>
            </div>
         </div>
      </>
   );
}
