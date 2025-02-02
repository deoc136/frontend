//import { ReminderInputType } from '@/app/api/reminder/route';
import {
   Appointment,
   AppointmentWithNames,
   AppointmentWithRating,
   NewAppointment,
} from '@/types/appointment';
import { InsertMethodResponse } from '@/types/general';
import { NewUser } from '@/types/user';
import axios from 'axios';
/*
async function createReminder(data: ReminderInputType) {
   try {
      await axios.post('/api/reminder', data, { baseURL: '' });
   } catch (error) {}
}
async function editReminder(data: ReminderInputType) {
   try {
      axios.put('/api/reminder', data, { baseURL: '' });
   } catch (error) {}
}
async function cancelReminder(data: ReminderInputType) {
   try {
      axios.delete('/api/reminder', {
         data,
         baseURL: '',
      });
   } catch (error) {}
}
*/
export async function getAppointmentById(id: string) {
   return await axios.get<Appointment>(`/appointment/get/${id}`, {
   });
}

export async function getAllAppointments() {
   return await axios.get<Appointment[]>(`/appointment/getAll`);
}

export async function getAllAppointmentsByPatientId(slug: string, id: string) {
   return await axios.get<Appointment[]>(
      `/appointment/getAllByPatientId/${id}`,
      {
         headers: {
            slug,
         },
      },
   );
}

export async function getAllAppointmentsByPatientIdWithRating(
   slug: string,
   id: string,
) {
   return await axios.get<AppointmentWithRating[]>(
      `/appointment/getAllByPatientIdWithRating/${id}`,
      {
         headers: {
            slug,
         },
      },
   );
}

export async function getAllAppointmentsWithNames() {
   return await axios.get<AppointmentWithNames[]>(
      `/appointment/getAllWithNames`
   );
}

export async function createAppointment(appointment: NewAppointment) {
   try {
      console.log('Creating appointment with data:', appointment);
      console.log('Using API URL:', axios.defaults.baseURL);
      
      const response = await axios.post<InsertMethodResponse>(
         '/appointment/create',
         appointment,
         {
            headers: {
               'Content-Type': 'application/json',
            },
            validateStatus: (status) => status < 500, // Accept all responses < 500
         }
      );

      console.log('Appointment creation response:', response.data);
      return { id: response.data.id };
   } catch (error: unknown) {
      if (error instanceof Error) {
         console.error('Appointment creation error:', {
            message: error.message,
            response: (error as any).response?.data,
            status: (error as any).response?.status,
            config: (error as any).config
         });
      }
      
      if (axios.isAxiosError(error)) {
         if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`Server error: ${error.response.data.error || error.message}`);
         } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server. Please check your connection.');
         }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error('Failed to create appointment: ' + errorMessage);
   }
}

export async function createAppointmentWithPatient(data: {
   user: NewUser;
   appointment: NewAppointment;
}) {
   try {
      console.log('Creating appointment with data:', {
         user: { ...data.user, email: data.user.email || 'not provided' },
         appointment: data.appointment
      });

      // Use the configured axios instance
      const response = await axios.post('/appointment/createWithPatient', data, {
         validateStatus: (status) => status < 500, // Accept all responses < 500
      });

      console.log('Appointment creation response:', response.data);
      return response.data;
   } catch (error: unknown) {
      // Detailed error logging
      if (error instanceof Error) {
         console.error('Appointment creation error:', {
            message: error.message,
            response: (error as any).response?.data,
            status: (error as any).response?.status,
            config: (error as any).config
         });
      }
      
      if (axios.isAxiosError(error)) {
         if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(`Server error: ${error.response.data.error || error.message}`);
         } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server. Please check your connection.');
         }
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error('Failed to create appointment: ' + errorMessage);
   }
}

export async function createMultipleWithPatient(
   slug: string,
   data: {
      user: NewUser;
      appointments: NewAppointment[];
   },
) {
   const {
      data: { appointment_ids, id },
   } = await axios.post<{ id: number; appointment_ids: number[] }>(
      '/appointment/createMultipleWithPatient',
      data,
      {
         headers: {
            slug,
         },
      },
   );
/*
   await Promise.all([
      [...appointment_ids].map(id =>
         createReminder({ slug, appointmentId: id }),
      ),
   ]);
*/
   return { id };
}

export async function editAppointment( appointment: Appointment) {
   const response = await axios.put('/appointment/edit', appointment, {
   });

   return response;
}

export async function cancelAppointmentById(slug: string, id: number) {
   const response = await axios.post(
      `/appointment/cancelById/${id}`,
      undefined,
      {
         headers: {
            slug,
         },
      },
   );

   //cancelReminder({ slug, appointmentId: id });

   return response;
}
