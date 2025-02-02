import type { Metadata } from 'next';
import DashboardView from './views/DashboardView';
import {
   getAllAppointments,
   getAllAppointmentsWithNames,
} from '@/services/appointment';
import { getAllPatients } from '@/services/user';


export default async function Page({ params }: { params: { slug: string } }) {
   const [{ data: patients }, { data: appointments }] = await Promise.all([
      getAllPatients(),
      getAllAppointmentsWithNames(),
   ]);

   return (
      <DashboardView
         appointments={appointments.filter(
            ({ appointment: { hidden } }) => !hidden,
         )}
         patients={patients}
      />
   );
}
