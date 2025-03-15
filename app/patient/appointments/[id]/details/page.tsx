'use client';

import { getAppointmentById } from '@/services/appointment';
import { getUserByCognitoId, getUserById } from '@/services/user';
import { getServiceById } from '@/services/service';
import { redirect, useRouter } from 'next/navigation';
import { clinicRoutes } from '@/lib/routes';
import DetailsView from './views/DetailsView';
import { Metadata } from 'next';
import { getAllRatingsByAppointmentId } from '@/services/rating';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { Appointment } from '@/types/appointment';
import { Service } from '@/types/service';
import { User } from '@/types/user';

interface ViewData {
   appointment: Appointment;
   therapist: User;
   service: Service;
   isRated: boolean;
}

export default function Page({
   params,
}: {
   params: { id: string };
}) {
   const { user } = useAuthenticator((context) => [context.user]);
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      async function checkAccess() {
         try {
            if (!user?.username) {
               router.push('/auth/login');
               return;
            }

            // Get logged in user
            const loggedInUser = (await getUserByCognitoId(user.username)).data;
            
            // Get appointment
            const appointment = (await getAppointmentById(params.id)).data;

            // Check if appointment belongs to user
            if (loggedInUser.id !== appointment.patient_id) {
               router.push(clinicRoutes().patient_appointments_actives);
               return;
            }

            setLoading(false);
         } catch (error) {
            router.push(clinicRoutes().patient_services);
         }
      }

      checkAccess();
   }, [user, params.id, router]);

   if (loading) {
      return <div>Cargando...</div>;
   }

   return <AppointmentDetails params={params} />;
}

// Separate component to handle appointment data loading
function AppointmentDetails({ params }: { params: { id: string } }) {
   const [viewData, setViewData] = useState<ViewData | null>(null);
   const router = useRouter();

   useEffect(() => {
      async function loadData() {
         try {
            const appointment = (await getAppointmentById(params.id)).data;

            if (appointment.hidden) {
               router.push(clinicRoutes().patient_appointments_actives);
               return;
            }

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

            setViewData({
               appointment,
               therapist,
               service,
               isRated: ratingsCount > 0
            });
         } catch (error) {
            router.push(clinicRoutes().patient_appointments_actives);
         }
      }

      loadData();
   }, [params.id, router]);

   if (!viewData) {
      return <div>Cargando...</div>;
   }

   return (
      <DetailsView
         appointment={viewData.appointment}
         therapist={viewData.therapist}
         service={viewData.service}
         isRated={viewData.isRated}
      />
   );
}
