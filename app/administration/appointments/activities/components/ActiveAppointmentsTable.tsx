'use client';

import Table from '@/app/components/table/Table';
import {
   Cell,
   Column,
   Item,
   Row,
   SortDirection,
   TableBody,
   TableHeader,
   Key
} from 'react-stately';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { AppointmentWithNames } from '@/types/appointment';
import AppointmentStateChip from '@/app/components/AppointmentStateChip';
import { cutFullName, translatePaymentMethod } from '@/lib/utils';
import PopoverTrigger from '@/app/components/shared/PopoverTrigger';
import Dialog from '@/components/modal/Dialog';
import { ListBox } from '@/components/shared/ListBox';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';

interface IActiveAppointmentsTable {
   appointments: AppointmentWithNames[];
   directionState: [SortDirection, Dispatch<SetStateAction<SortDirection>>];
   columnState: [Key | undefined, Dispatch<SetStateAction<Key | undefined>>];
}

export default function ActiveAppointmentsTable({
   appointments,
   directionState,
   columnState,
}: IActiveAppointmentsTable) {
   const [direction, setDirection] = directionState;
   const [column, setColumn] = columnState;

   return (
      <>
         <Table
            className="w-full"
            selectionMode="none"
            onSortChange={desc => {
               setDirection(prev =>
                  prev === 'ascending' ? 'descending' : 'ascending',
               );
               setColumn(desc.column);
            }}
            sortDescriptor={{ column: column ?? 'date' as Key, direction }}
         >
            <TableHeader>
               <Column allowsSorting key="date">
                  Fecha
               </Column>
               <Column allowsSorting key="hour">
                  Hora
               </Column>
               <Column allowsSorting key="patient">
                  Paciente
               </Column>
               <Column allowsSorting key="phone">
                  Teléfono
               </Column>
               <Column allowsSorting key="service">
                  Servicio
               </Column>
               <Column allowsSorting key="therapist">
                  Doctor
               </Column>
               <Column allowsSorting key="payment">
                  Pago
               </Column>
               <Column allowsSorting key="state">
                  Estado
               </Column>
               <Column key="details">{true}</Column>
               <Column key="see_more">{true}</Column>
            </TableHeader>
            <TableBody>
               {appointments.map(({ appointment, data }) => (
                  <Row key={appointment.id}>
                     <Cell>
                        {(date => {
                           return `${date.getDate()}/${
                              date.getMonth() + 1
                           }/${date.getFullYear()}`;
                        })(new Date(appointment.date))}
                     </Cell>
                     <Cell>
                        {`${appointment.hour}:${appointment.minute.toString().padStart(2, '0')}`}
                     </Cell>
                     <Cell>
                        {cutFullName(
                           data.patient_names,
                           data.patient_last_names,
                        )}
                     </Cell>
                     <Cell>
                        +57 {data.patient_phone}
                     </Cell>
                     <Cell>{data.service_name}</Cell>
                     <Cell>
                        {cutFullName(
                           data.therapist_names,
                           data.therapist_last_names,
                        )}
                     </Cell>
                     <Cell>
                        {translatePaymentMethod(appointment.payment_method)}
                     </Cell>
                     <Cell>
                        <AppointmentStateChip state={appointment.state} />
                     </Cell>
                     <Cell>
                        <Link
                           className="text-secondary underline underline-offset-2"
                           href={`/administration/appointments/${appointment.id}/details`}
                        >
                           Ver detalles
                        </Link>
                     </Cell>
                     <Cell>
                        <SeeMoreButton id={appointment.id} />
                     </Cell>
                  </Row>
               ))}
            </TableBody>
         </Table>
      </>
   );
}

function SeeMoreButton({ id }: { id: number }) {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <PopoverTrigger
         isOpen={isOpen}
         onOpenChange={setIsOpen}
         trigger={<MoreVertRoundedIcon className="!fill-on-background-text" />}
      >
         <Dialog className="rounded">
            <ListBox className="right-0 ml-0 !p-0 !py-2 shadow-xl">
               <Item textValue="Editar">
                  <Link href={`/appointments/${id}/edit`}>
                     <div className="w-full py-3 pl-8">Editar</div>
                  </Link>
               </Item>
            </ListBox>
         </Dialog>
      </PopoverTrigger>
   );
}
