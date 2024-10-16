import type { Metadata } from 'next';
import CreationView from './views/CreationView';
import { getAllServices } from '@/services/service';
import {getAllUsersByRole } from '@/services/user';
import { getAllUserServices } from '@/services/user_service';
import { getAllAppointments } from '@/services/appointment';




export const revalidate = 0;

export default async function Page({ params }: { params: { slug: string } }) {
   const [
      { data: services },
      { data: headquarters },
      { data: therapists },
      { data: patients },
      { data: userServices },
      { data: appointments },
   ] = await Promise.all([
      getAllServices(),
      getAllUsersByRole('PATIENT'),
      getAllUserServices(),
      getAllAppointments(),
   ]);

   return (
      <CreationView
         headquarters={headquarters}
         services={services}
         patients={patients}
         userServices={userServices}
         appointments={appointments.filter(({ state }) => state !== 'CANCELED')}
      />
   );
}
