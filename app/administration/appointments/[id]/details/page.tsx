import DetailsView from './views/DetailsView';
import { getAppointmentById } from '@/services/appointment';
import { getUserById } from '@/services/user';
import { getServiceById } from '@/services/service';
//import { getAllForms, getAllSubmittedFormsByPatientId } from '@/services/forms';
//import { getHeadquarterById } from '@/services/headquarter';
import { redirect } from 'next/navigation';
import { clinicRoutes } from '@/lib/routes';
import { Metadata } from 'next';
//import { meta_descriptions } from '@/lib/seo/meta_descriptions';



export const revalidate = 0;

export default async function Page({
   params,
}: {
   params: { id: string };
}) {
   try {
      const appointment = (await getAppointmentById(params.id))
         .data;

      if (appointment.hidden) throw Error();

      const [
         { data: patient },
         { data: therapist },
         { data: service },
      ] = await Promise.all([
         getUserById(appointment.patient_id.toString()),
         getUserById(appointment.therapist_id.toString()),
         getServiceById(appointment.service_id.toString()),
      ]);

      return (
         <DetailsView
            appointment={appointment}
            patient={patient}
            therapist={therapist}
            service={service}
         />
      );
   } catch (error) {
      redirect(clinicRoutes().receptionist_appointments_actives);
   }
}
