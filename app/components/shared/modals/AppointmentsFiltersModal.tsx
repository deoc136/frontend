'use client';

import Dialog from '@/components/modal/Dialog';
import ModalTrigger from '@/components/modal/ModalTrigger';
import Button, { Variant } from '@/components/shared/Button';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuButton from '@/app/components/inputs/MenuButton';
import { Item } from 'react-stately';
import { Service } from '@/types/service';
import { User } from '@/types/user';
import { cutFullName } from '@/lib/utils';

interface IAppointmentsFiltersModal {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
   services?: Service[];
   patients?: User[];
   selectedServices: number[];
   selectedPatients: number[];
   setSelectedServices: Dispatch<SetStateAction<number[]>>;
   setSelectedPatients: Dispatch<SetStateAction<number[]>>;
}

export default function AppointmentsFiltersModal({
   isOpen,
   setIsOpen,
   services,
   patients,
   selectedPatients,
   selectedServices,
   setSelectedPatients,
   setSelectedServices,
}: IAppointmentsFiltersModal) {
   const [servicesAux, setServicesAux] = useState(selectedServices);
   const [patientsAux, setPatientsAux] = useState(selectedPatients);

   function save() {
      setSelectedPatients(patientsAux);
      setSelectedServices(servicesAux);
   }

   useEffect(() => {
      if (!isOpen) {
         setServicesAux(selectedServices);
         setPatientsAux(selectedPatients);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isOpen]);

   return (
      <ModalTrigger className="m-2 animate-appear sm:m-8" isOpen={isOpen}>
         {() => (
            <Dialog className="grid gap-14 rounded-xl p-7">
               <div className="flex min-w-[40vw] items-center justify-between">
                  <h2 className="text-2xl font-semibold">Filtros</h2>
                  <Button
                     className="!w-max bg-transparent !p-0"
                     onPress={() => {
                        setIsOpen(false);
                     }}
                  >
                     <CloseRoundedIcon className="!fill-black" />
                  </Button>
               </div>
               <div className="grid gap-5 md:grid-cols-2">
                  {services && (
                     <MenuButton
                        selectionMode="multiple"
                        selectedKeys={servicesAux}
                        onSelectionChange={vals => {
                           vals && setServicesAux(Array.from(vals) as number[]);
                        }}
                        label="Tipo de servicio"
                        content={`${servicesAux.length} servicios seleccionados`}
                     >
                        {services.map(service => (
                           <Item key={service.id} textValue={service.name}>
                              {service.name}
                           </Item>
                        ))}
                     </MenuButton>
                  )}
                  {patients && (
                     <MenuButton
                        selectionMode="multiple"
                        selectedKeys={patientsAux}
                        onSelectionChange={vals => {
                           vals && setPatientsAux(Array.from(vals) as number[]);
                        }}
                        label="Pacientes"
                        content={`${patientsAux.length} pacientes seleccionados`}
                     >
                        {patients.map(patient => (
                           <Item
                              key={patient.id}
                              textValue={cutFullName(patient.names, patient.last_names)}
                           >
                              {cutFullName(patient.names, patient.last_names)}
                           </Item>
                        ))}
                     </MenuButton>
                  )}
               </div>
               <div className="flex justify-center gap-5">
                  <Button
                     className="max-w-[16rem]"
                     variant={Variant.secondary}
                     onPress={() => {
                        setIsOpen(false);
                     }}
                  >
                     Cancelar
                  </Button>
                  <Button
                     className="max-w-[16rem]"
                     onPress={() => {
                        save();
                        setIsOpen(false);
                     }}
                  >
                     Aplicar filtros
                  </Button>
               </div>
            </Dialog>
         )}
      </ModalTrigger>
   );
}
