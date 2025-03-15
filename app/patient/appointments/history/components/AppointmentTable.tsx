'use client';

import Table from '@/components/shared/tables/Table';
import {
   Cell,
   Column,
   Row,
   SortDirection,
   TableBody,
   TableHeader,
   Key
} from 'react-stately';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import { clinicRoutes } from '@/lib/routes';
import { AppointmentWithNamesAndRating } from '@/types/appointment';
import {
   cutFullName,
   translateAppointmentAssistance,
   translateAppointmentState,
} from '@/lib/utils';
import Button, { Variant } from '@/components/shared/Button';
import useDictionary from '@/lib/hooks/useDictionary';

interface IAppointmentsHistoryTable {
   appointments: AppointmentWithNamesAndRating[];
   directionState: [SortDirection, Dispatch<SetStateAction<SortDirection>>];
   columnState: [Key | undefined, Dispatch<SetStateAction<Key | undefined>>];
}

export default function AppointmentsHistoryTable({
   appointments,
   directionState,
   columnState,
}: IAppointmentsHistoryTable) {
   const dic = useDictionary();

   const [direction, setDirection] = directionState;
   const [column, setColumn] = columnState;

   return (
      <Table
         className="w-full"
         selectionMode="none"
         onSortChange={desc => {
            setDirection(prev =>
               prev === 'ascending' ? 'descending' : 'ascending',
            );
            setColumn(desc.column);
         }}
         sortDescriptor={{ column, direction }}
      >
         <TableHeader>
            <Column allowsSorting key="date">
               {dic.texts.attributes.date}
            </Column>
            <Column allowsSorting key="hour">
               {dic.texts.attributes.hour}
            </Column>
            <Column allowsSorting key="service">
               {dic.texts.attributes.therapy}
            </Column>
            <Column allowsSorting key="Doctor">
               {dic.texts.attributes.therapist}
            </Column>
            <Column key="details">Detalles</Column>
            <Column key="qualification">calificación</Column>
         </TableHeader>
         <TableBody>
            {appointments.map(({ appointment, data }) => (
               <Row key={appointment.id}>
                  <Cell>
                     {(date => {
                        return `${date.getFullYear()}/${
                           date.getMonth() + 1
                        }/${date.getDate()}`;
                     })(new Date(appointment.date))}
                  </Cell>
                  <Cell>
                     {appointment.hour.toString()}:{appointment.minute.toString().padStart(2, '0')}
                  </Cell>
                  <Cell>{data.service_name}</Cell>
                  <Cell>
                     {cutFullName(
                        data.therapist_names,
                        data.therapist_last_names,
                     )}
                  </Cell>
                  <Cell>
                     <Link
                        className="text-secondary underline underline-offset-2"
                        href={
                           clinicRoutes().patient_appointments_id(
                              appointment.id,
                           ).details
                        }
                     >
                        {dic.texts.flows.see_details}
                     </Link>
                  </Cell>
                  <Cell>
                     {Number(appointment.ratings) > 0 ? (
                        <p className="font-semibold p-basic">
                           ¡{dic.texts.appointments.rated}!
                        </p>
                     ) : (
                        <Button
                           href={
                              clinicRoutes().patient_appointments_id(
                                 appointment.id,
                              ).rate
                           }
                           isDisabled={
                              appointment.state !== 'CLOSED' ||
                              appointment.assistance !== 'ATTENDED'
                           }
                           className="h-max"
                           variant={Variant.secondary}
                        >
                           {appointment.state === 'CANCELED'
                              ? translateAppointmentState(
                                   appointment.state,
                                   dic,
                                )
                              : appointment.assistance === 'MISSED'
                              ? translateAppointmentAssistance(
                                   appointment.assistance,
                                   dic,
                                )
                              : dic.texts.appointments.rate_service}
                        </Button>
                     )}
                  </Cell>
               </Row>
            ))}
         </TableBody>
      </Table>
   );
}
