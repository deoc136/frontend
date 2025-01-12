'use client';

import UserOverviewCard from '@/app/components/shared/cards/UserOverviewCard';
import { NewUser, TherapistWithSchedule, User } from '@/types/user';
import { NewAppointmentWithDate } from './CreationView';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { timezone, translatePaymentMethod } from '@/lib/utils';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import { PaymentMethod } from '@/types/appointment';
import { Service } from '@/types/service';

interface IPreviewView {
   values: NewAppointmentWithDate;
   patients: User[];
   newPatient: NewUser | undefined;
   services: Service[];
}

export default function PreviewView({
   newPatient,
   patients,
   values,
   services,
}: IPreviewView) {


   const patient = useMemo(
      () => patients.find(user => user.id.toString() === values.patient_id),
      [patients, values.patient_id],
   );


   const service = useMemo(
      () =>
         services.find(service => service.id?.toString() === values.service_id),
      [services, values.service_id],
   );

   return (
      <div className="mb-10 grid gap-10">
         <h2 className="font-semibold">Detalles de la reserva</h2>
         <section className="mx-20 grid gap-7">
            <div className="grid grid-cols-2 gap-5">
               <div>
                  <p className="mb-2 font-semibold">Fecha</p>
                  <p className="text-on-background-text">
                     {(date => {
                        return `${Intl.DateTimeFormat(undefined, {
                           month: 'long',
                        }).format(
                           date,
                        )} ${date.getDate()} ${date.getFullYear()}`;
                     })(new Date(values.date.toDate(timezone)))}
                  </p>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Hora</p>
                  <p className="text-on-background-text">
                     {`${values.hour}:${values.minute.toString().padStart(2, '0')}`}
                  </p>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Método de pago</p>
                  <p className="text-on-background-text">
                     {translatePaymentMethod(
                        values.payment_method as PaymentMethod,
                     )}
                  </p>
               </div>
            </div>
            <div>
               <p className="mb-2 font-semibold">Paciente</p>
               <UserOverviewCard
                  user={
                     newPatient
                        ? {
                             ...newPatient,
                          }
                        : {
                             ...patient!,
                          }
                  }
               />
            </div>
         </section>
         <h2 className="font-semibold">Resumen de pago</h2>
         <section className="mx-20 grid gap-7">

         </section>
      </div>
   );
}
