'use client';

import Table from '@/app/components/table/Table';
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
import { PatientWithAppointment } from '@/services/user';
import Image from 'next/image';
import { cutFullName } from '@/lib/utils';

interface IPatientsTable {
   users: PatientWithAppointment[];
   directionState: [SortDirection, Dispatch<SetStateAction<SortDirection>>];
   columnState: [Key | undefined, Dispatch<SetStateAction<Key | undefined>>];
}

export default function PatientsTable({
   users,
   directionState,
   columnState,
}: IPatientsTable) {
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
            sortDescriptor={{ column: column ?? 'names' as Key, direction }}
         >
            <TableHeader>
               <Column allowsSorting key="names">
                  Nombre del paciente
               </Column>
               <Column allowsSorting key="phone">
                  Teléfono
               </Column>
               <Column allowsSorting key="email">
                  Correo
               </Column>
               <Column allowsSorting key="last_appointment">
                  Fecha última reserva
               </Column>
               <Column key="details">Detalles</Column>
            </TableHeader>
            <TableBody>
               {users.map(user => (
                  <Row key={user.id}>
                     <Cell>
                        <div
                           aria-label="user name"
                           className={`grid w-full max-w-sm grid-cols-5 items-center gap-3 ${
                              !user.enabled && 'text-on-background-disabled'
                           }`}
                        >
                           <p className="col-span-4 col-start-2 w-full justify-self-start truncate font-semibold">
                              {cutFullName(user.names, user.last_names)}
                           </p>
                        </div>
                     </Cell>
                     <Cell>
                        <span
                           className={`${
                              !user.enabled && 'text-on-background-disabled'
                           }`}
                        >
                           {user.phone}
                        </span>
                     </Cell>
                     <Cell>
                        <span
                           className={`${
                              !user.enabled && 'text-on-background-disabled'
                           }`}
                        >
                           {user.email}
                        </span>
                     </Cell>
                     <Cell>
                        <span
                           className={`${
                              !user.enabled && 'text-on-background-disabled'
                           }`}
                        >
                           {user.last_appointment
                              ? (date =>
                                   `${date.getDate()}/${
                                      date.getMonth() + 1
                                   }/${date.getFullYear()}`)(
                                   new Date(user.last_appointment),
                                )
                              : 'No hay reservas'}
                        </span>
                     </Cell>
                     <Cell>
                        <Link
                           href={`/administration/patients/${user.id}/details`}
                           className="text-primary hover:underline"
                        >
                           Ver detalles
                        </Link>
                     </Cell>
                  </Row>
               ))}
            </TableBody>
         </Table>
      </>
   );
}
