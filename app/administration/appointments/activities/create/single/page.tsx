import type { Metadata } from 'next';
import CreationView from './views/CreationView';
import { getAllServices } from '@/services/service';
import { getAllUsersByRole } from '@/services/user';
import { getAllUserServices } from '@/services/user_service';
import { getAllAppointments } from '@/services/appointment';


export const revalidate = 0;

export default async function Page() {
   const [
      { data: services },
      { data: patients },
      { data: userServices },
      { data: appointments },
      { data: doctors },
   ] = await Promise.all([
      getAllServices(),
      getAllUsersByRole('PATIENT'),
      getAllUserServices(),
      getAllAppointments(),
      getAllUsersByRole('DOCTOR'),
   ]);

   return (
      <CreationView
         services={services.filter(({ removed, active }) => active && !removed)}
         patients={patients.filter(
            ({ retired, enabled }) => enabled && !retired,
         )}
         userServices={userServices}
         appointments={appointments.filter(({ state }) => state !== 'CANCELED')}
         doctors={doctors}
      />
   );
}
