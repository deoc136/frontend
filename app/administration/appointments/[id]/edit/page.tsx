import { clinicRoutes } from '@/lib/routes';
import { getAllAppointments, getAppointmentById } from '@/services/appointment';
import { getServiceById } from '@/services/service';
import { getAllDoctors, getUserById } from '@/services/user';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import EditView from './views/EditView';
import { getAllUserServices } from '@/services/user_service';

export const revalidate = 0;

export default async function Page({
   params,
}: {
   params: { id: string; };
}) {
   try {
      console.log('Fetching appointment with ID:', params.id);
      const appointment = (await getAppointmentById(params.id)).data;
      console.log('Fetched appointment:', appointment);

      if (
         appointment.hidden ||
         appointment.state === 'CLOSED' ||
         appointment.state === 'CANCELED'
      ) {
         console.warn('Appointment is hidden, closed, or canceled:', appointment);
         throw Error();
      }

      console.log('Fetching related data for appointment...');
      const [
         { data: patient },
         { data: service },
         therapists,
         { data: userServices },
         { data: appointments },
      ] = await Promise.all([
         getUserById(appointment.patient_id.toString()),
         getServiceById(appointment.service_id.toString()),
         getAllDoctors(),
         getAllUserServices(),
         getAllAppointments(),
      ]);

      console.log('Fetched patient:', patient);
      console.log('Fetched service:', service);
      console.log('Fetched therapists:', therapists);
      console.log('Fetched user services:', userServices);
      console.log('Fetched appointments:', appointments);

      return (
         <EditView
            appointments={appointments.filter(
               ({ id }) => id !== appointment.id,
            )}
            appointment={appointment}
            patient={patient}
            service={service}
            therapists={therapists.data}
            userServices={userServices}
         />
      );
   } catch (error) {
      console.error('Error in Page component:', error);
      redirect(clinicRoutes().receptionist_appointments_actives);
   }
}
