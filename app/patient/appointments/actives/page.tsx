'use client';

import { clinicRoutes } from '@/lib/routes';
import {
   getAllAppointmentsByPatientId,
} from '@/services/appointment';
import { getAllServices } from '@/services/service';
import { getAllUsersByRole, getUserByCognitoId } from '@/services/user';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppointmentsList from './views/AppointmentsList';
import { Appointment } from '@/types/appointment';
import { Service } from '@/types/service';
import { User } from '@/types/user';

export default function Page() {
   const router = useRouter();
   const { user } = useAuthenticator((context) => [context.user]);
   const [appointments, setAppointments] = useState<Appointment[]>([]);
   const [services, setServices] = useState<Service[]>([]);
   const [therapists, setTherapists] = useState<User[]>([]);
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
           getAllAppointmentsByPatientId(patient.id.toString()),
           getAllServices(),
           getAllUsersByRole('DOCTOR'),
         ]);

         console.log('Fetched appointments:', appointmentsRes.data);
         console.log('Fetched services:', servicesRes.data);
         console.log('Fetched therapists:', therapistsRes.data);

         const filteredAppointments = appointmentsRes.data
           .filter(appt => appt.state !== 'CANCELED' && appt.state !== 'CLOSED');

         setAppointments(filteredAppointments);
         setServices(servicesRes.data);
         setTherapists(therapistsRes.data);
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

   return (
     <AppointmentsList 
       appointments={appointments}
       services={services}
       therapists={therapists}
     />
   );
}
