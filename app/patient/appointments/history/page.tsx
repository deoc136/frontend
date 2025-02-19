'use client';

import { clinicRoutes } from '@/lib/routes';
import {
   getAllAppointmentsByPatientIdWithRating,
} from '@/services/appointment';
import { getAllServices } from '@/services/service';
import { getAllUsersByRole, getUserByCognitoId } from '@/services/user';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppointmentsList from './views/AppointmentsList';
import { AppointmentWithNamesAndRating, AppointmentWithRating } from '@/types/appointment';
import { Service } from '@/types/service';
import { User } from '@/types/user';

export default function Page() {
   const router = useRouter();
   const { user } = useAuthenticator((context) => [context.user]);
   const [appointments, setAppointments] = useState<AppointmentWithNamesAndRating[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     async function loadData() {
       try {
         if (!user?.username) {
           console.log('User not authenticated, redirecting to login');
           router.push('/auth/login');
           return;
         }

         console.log('Fetching user by Cognito ID:', user.username);
         const patient = (await getUserByCognitoId(user.username)).data;
         console.log('Fetched patient:', patient);
         
         const [
           appointmentsRes,
           servicesRes,
           therapistsRes,
         ] = await Promise.all([
           getAllAppointmentsByPatientIdWithRating(patient.id.toString()),
           getAllServices(),
           getAllUsersByRole('DOCTOR'),
         ]);

         console.log('Fetched appointments:', appointmentsRes.data);
         console.log('Fetched services:', servicesRes.data);
         console.log('Fetched therapists:', therapistsRes.data);

         const filteredAppointments = appointmentsRes.data
           .filter(appt => 
             appt.state === 'CANCELED' || appt.state === 'CLOSED'
           )
           .map(appt => ({
             appointment: appt,
             data: {
               therapist_names: therapistsRes.data.find(t => t.id === appt.therapist_id)?.names ?? '',
               therapist_last_names: therapistsRes.data.find(t => t.id === appt.therapist_id)?.last_names ?? '',
               patient_names: patient.names,
               patient_last_names: patient.last_names,
               patient_phone: patient.phone,
               service_name: servicesRes.data.find(s => s.id === appt.service_id)?.name ?? '',
             }
           }));

         console.log('Filtered appointments:', filteredAppointments);
         setAppointments(filteredAppointments);
       } catch (error) {
         console.error('Error loading appointments:', error);
         router.push(clinicRoutes().patient_services);
       } finally {
         setLoading(false);
       }
     }

     loadData();
   }, [user, router]);

   if (loading) {
     return <div>Cargando...</div>;
   }

   return <AppointmentsList appointments={appointments} />;
}
