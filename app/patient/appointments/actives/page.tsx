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
           console.log('[APPOINTMENTS] User not authenticated, redirecting to login');
           router.push('/auth/login');
           return;
         }

         const cognitoId = user.username;
         console.log('[APPOINTMENTS] User authenticated with Cognito ID:', cognitoId);
         console.log('[APPOINTMENTS] User object:', JSON.stringify(user, null, 2));
         
         console.log('[APPOINTMENTS] Fetching user by Cognito ID:', cognitoId);
         try {
           // Use a direct URL for debugging
           const directUrl = `http://localhost:5000/user/getByCognitoId/${cognitoId}`;
           console.log('[APPOINTMENTS] Making direct API call to:', directUrl);
           
           // Try a fetch call to isolate the issue from axios
           const fetchResponse = await fetch(directUrl);
           console.log('[APPOINTMENTS] Fetch response status:', fetchResponse.status);
           if (!fetchResponse.ok) {
             console.error('[APPOINTMENTS] Fetch failed with status:', fetchResponse.status);
             const errorText = await fetchResponse.text();
             console.error('[APPOINTMENTS] Error response:', errorText);
           } else {
             const fetchData = await fetchResponse.json();
             console.log('[APPOINTMENTS] Fetch succeeded with data:', fetchData);
           }
         } catch (fetchError) {
           console.error('[APPOINTMENTS] Fetch error:', fetchError);
         }
         
         // Continue with the original axios request
         try {
           const patient = (await getUserByCognitoId(cognitoId)).data;
           console.log('[APPOINTMENTS] Fetched patient via axios:', patient);
           
           const [
             appointmentsRes,
             servicesRes,
             therapistsRes,
           ] = await Promise.all([
             getAllAppointmentsByPatientId(patient.id.toString()),
             getAllServices(),
             getAllUsersByRole('DOCTOR'),
           ]);

           console.log('[APPOINTMENTS] Fetched appointments:', appointmentsRes.data);
           console.log('[APPOINTMENTS] Fetched services:', servicesRes.data);
           console.log('[APPOINTMENTS] Fetched therapists:', therapistsRes.data);

           const filteredAppointments = appointmentsRes.data
             .filter(appt => appt.state !== 'CANCELED' && appt.state !== 'CLOSED');

           setAppointments(filteredAppointments);
           setServices(servicesRes.data);
           setTherapists(therapistsRes.data);
         } catch (axiosError) {
           console.error('[APPOINTMENTS] Axios error:', axiosError);
           throw axiosError; // Rethrow to be caught by the outer catch
         }
       } catch (error) {
         console.error('[APPOINTMENTS] Error loading appointments:', error);
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
