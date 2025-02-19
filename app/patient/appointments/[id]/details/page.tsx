import { getAppointmentById } from '@/services/appointment';
import { getUserById } from '@/services/user';
import { getServiceById } from '@/services/service';
import { redirect } from 'next/navigation';
import { clinicRoutes } from '@/lib/routes';
import DetailsView from './views/DetailsView';
import { Metadata } from 'next';
import { getAllRatingsByAppointmentId } from '@/services/rating';

export const revalidate = 0;



export default async function Page({
   params,
}: {
   params: { id: string; slug: string };
}) {
   try {
      const appointment = (await getAppointmentById(params.id))
         .data;

      if (appointment.hidden) throw Error();

      const [
         { data: therapist },
         { data: service },
         {
            data: { length: ratingsCount },
         },
      ] = await Promise.all([
         getUserById(appointment.therapist_id.toString()),
         getServiceById(appointment.service_id.toString()),
         getAllRatingsByAppointmentId(params.id),
      ]);

      return (
         <DetailsView
            appointment={appointment}
            therapist={therapist}
            service={service}
            isRated={ratingsCount > 0}
         />
      );
   } catch (error) {
      redirect(clinicRoutes().patient_appointments_actives);
   }
}
