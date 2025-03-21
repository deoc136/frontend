'use client';

import { Key, SortDirection } from 'react-stately';
import { useEffect, useState } from 'react';
import Pagination from '@/components/shared/Pagination';
import { AppointmentWithNamesAndRating } from '@/types/appointment';
import AppointmentsHistoryTable from '../components/AppointmentTable';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux-hooks';
import { changeTitle } from '@/lib/features/title/title_slice';
import { Catalog } from '@/types/catalog';
import { User } from '@/types/user';
import { Service } from '@/types/service';
import { useRouter } from 'next/navigation';
import Button, { Variant } from '@/components/shared/Button';
import { clinicRoutes } from '@/lib/routes';
import { capitalize } from '@mui/material';
import Link from 'next/link';
import {
   translateAppointmentAssistance,
   translateAppointmentState,
} from '@/lib/utils';
import useDictionary from '@/lib/hooks/useDictionary';

interface IAppointmentsHistoryList {
   appointments: AppointmentWithNamesAndRating[];
}

export default function AppointmentsHistoryList({
   appointments,
}: IAppointmentsHistoryList) {
   const dic = useDictionary();

   const directionState = useState<SortDirection>('ascending');
   const columnState = useState<Key>();

   const [page, setPage] = useState(0);
   const limit = 7;

   const [sortedAppointments, setSortedAppointments] = useState(appointments);

   function sort(direction: string, column: Key | undefined) {
      const aux = [...appointments];

      aux.sort((data1, data2) => {
         const first = direction === 'ascending' ? data1 : data2,
            sec = direction === 'ascending' ? data2 : data1;

         switch (column) {
            case 'date':
               return (
                  new Date(first.appointment.date).getTime() -
                  new Date(sec.appointment.date).getTime()
               );
            case 'hour':
               return first.appointment.hour - sec.appointment.minute;
            case 'service':
               return first.data.service_name.localeCompare(
                  sec.data.service_name,
               );
            case 'therapist':
               return `${first.data.therapist_names} ${first.data.therapist_last_names}`.localeCompare(
                  `${sec.data.therapist_names} ${sec.data.therapist_last_names}`,
               );
            default:
               return data2.appointment.id - data1.appointment.id;
         }
      });

      setSortedAppointments(aux);
   }

   useEffect(() => {
      sort(directionState[0], columnState[0]);

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [...directionState, ...columnState, appointments]);

   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(
         changeTitle({
            goBackRoute: null,
            value: dic.texts.appointments.appointments_history,
         }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dispatch, dic]);

   return (
      <div className="flex h-full flex-col justify-between gap-10">
         <div className="hidden xl:block">
            <AppointmentsHistoryTable
               directionState={directionState}
               columnState={columnState}
               appointments={sortedAppointments.slice(
                  page * limit,
                  page * limit + limit,
               )}
            />
         </div>
         <div className="xl:hidden">
            {sortedAppointments
               .slice(page * limit, page * limit + limit)
               .map((data, i) => (
                  <AppointmentRow
                     key={i}
                     data={data}
                  />
               ))}
         </div>
         <div className="flex justify-center w-full mt-8 mb-4">
            <a 
               href="https://wa.me/573105345062?text=Hola,%20vi%20tus%20servicios%20en%20la%20p%C3%A1gina%20web%20y%20me%20interesa%20m%C3%A1s%20informaci%C3%B3n.&utm_source=website&utm_medium=button&utm_campaign=next-session-button"
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white transition-all duration-200 bg-secondary hover:bg-secondary-700 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transform hover:scale-105"
            >
               <svg className="w-6 h-6 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
               </svg>
               Agenda tu siguiente sesión
            </a>
         </div>
         <Pagination
            page={page}
            setPage={setPage}
            totalPages={Math.ceil(sortedAppointments.length / limit)}
         />
      </div>
   );
}

interface IAppointmentRow {
   hour?: Catalog;
   data: AppointmentWithNamesAndRating;
   therapist?: User;
   service?: Service;
}

function AppointmentRow({
   data: { appointment, data },
   hour,
}: IAppointmentRow) {
   const dic = useDictionary();

   const date = new Date(appointment.date ?? new Date());


   return (
      <>
         <div className="grid grid-cols-[1fr_auto] items-center gap-5 py-5 text-xs text-on-background-text lg:text-sm">
            <Link
               href={
                  clinicRoutes().patient_appointments_id(appointment.id)
                     .details
               }
               className="grid gap-2"
            >
               <div className="font-semibold">
                  <p className="text-sm text-black lg:text-base">
                     {data.service_name}
                  </p>
                  <p>
                     {data.therapist_names} {data.therapist_last_names}
                  </p>
               </div>
               <p>
                  <span>
                     {capitalize(
                        Intl.DateTimeFormat(dic.language, {
                           month: 'short',
                        }).format(date),
                     )}{' '}
                     {date.getDate()} / {date.getFullYear()}{' '}
                     { appointment.hour.toString()}:{appointment.minute?.toString().padStart(2, '0')}
                  </span>
               </p>
            </Link>
            {Number(appointment.ratings) > 0 ? (
               <p className="font-semibold p-basic">
                  ¡{dic.texts.appointments.rated}!
               </p>
            ) : (
               <Button
                  href={
                     clinicRoutes().patient_appointments_id(appointment.id)
                        .rate
                  }
                  isDisabled={
                     appointment.state !== 'CLOSED' ||
                     appointment.assistance !== 'ATTENDED'
                  }
                  className="h-max"
                  variant={Variant.secondary}
               >
                  {appointment.state === 'CANCELED'
                     ? translateAppointmentState(appointment.state, dic)
                     : appointment.assistance === 'MISSED'
                     ? translateAppointmentAssistance(
                          appointment.assistance,
                          dic,
                       )
                     : dic.texts.appointments.rate_service}
               </Button>
            )}
         </div>
         <hr />
         <hr />
      </>
   );
}
