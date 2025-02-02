import { getAllAppointmentsWithNames } from '@/services/appointment';
import { getAllServices } from '@/services/service';
import { getAllUsersByRole } from '@/services/user';
import type { Metadata } from 'next';
import ActiveAppointmentsList from './views/ActiveAppointmentsList';



export const revalidate = 0;

export default async function Page() {
   const [appointments, services, patients] = await Promise.all([
      (await getAllAppointmentsWithNames()).data,
      (await getAllServices()).data,
      (await getAllUsersByRole('PATIENT')).data,
   ]);

   return (
      <ActiveAppointmentsList
         appointments={appointments}
         patients={patients}
         services={services}
      />
   );
}
