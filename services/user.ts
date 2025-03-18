import { InsertMethodResponse } from '@/types/general';
import {
   FullFilledUser,
   NewFullFilledUser,
   NewUser,
   Role,
   TherapistWithSchedule,
   User,
} from '@/types/user';
import axios from 'axios';

export async function createUser(data: NewUser, slug: string) {
   return axios.post<InsertMethodResponse>('/user/create', data, {
      headers: {
         slug,
      },
   });
}

export async function registerUser(data: NewUser, slug: string) {
   return axios.post<InsertMethodResponse>('/user/signUp', data, {
      headers: {
         slug,
      },
   });
}

export async function createUserFullFilled(
   data: NewFullFilledUser,
   slug: string,
) {
   return axios.post<InsertMethodResponse>('/user/createFullFilled', data, {
      headers: {
         slug,
      },
   });
}

export async function editUser(data: User, slug: string) {
   return axios.put('/user/edit', data, {
      headers: {
         slug,
      },
   });
}

export async function getUserById( id: string) {
   return await axios.get<User>(`/user/get/${id}`, {
   });
}

export async function getUserFullFilledById(slug: string, id: string) {
   return await axios.get<FullFilledUser>(`/user/getFullFilledById/${id}`, {
   });
}

export async function getTherapistsByServiceId(slug: string, id: string) {
   return await axios.get<TherapistWithSchedule[]>(
      `/user/getTherapistsByServiceId/${id}`,
      {
         headers: {
            slug,
         },
      },
   );
}

export async function getAllUsers() {
   return axios.get<User[]>('/user/getAll', {
   });
}

export async function getAllDoctors() {
   return axios.get<User[]>('/user/getAllByRole/DOCTOR', {
   });
}

export interface PatientWithAppointment extends User {
   last_appointment: Date | null;
}

export async function getAllPatients() {
   return axios.get<{ user: PatientWithAppointment }[]>(
      '/user/getAllPatients'
   );
}

export async function getAllUsersByRole(role: Role) {
   return axios.get<User[]>(`/user/getAllByRole/${role}`);
}

export async function getUserByCognitoId(cognitoId: string) {
   console.log(`[USER SERVICE] Requesting user with Cognito ID: ${cognitoId}`);
   const requestUrl = `/user/getByCognitoId/${cognitoId}`;
   console.log(`[USER SERVICE] Full request URL: ${requestUrl}`);
   console.log(`[USER SERVICE] Axios baseURL: ${axios.defaults.baseURL || 'Not set'}`);
   
   try {
      console.log(`[USER SERVICE] Sending request to: ${axios.defaults.baseURL || ''}${requestUrl}`);
      const response = await axios.get<User>(requestUrl);
      console.log(`[USER SERVICE] Request successful, status: ${response.status}`);
      return response;
   } catch (error: any) {
      console.error(`[USER SERVICE] Error fetching user with Cognito ID: ${cognitoId}`);
      console.error(`[USER SERVICE] Error details:`, {
         status: error.response?.status,
         statusText: error.response?.statusText,
         data: error.response?.data,
         url: error.config?.url,
         method: error.config?.method,
         headers: error.config?.headers
      });
      
      // Log the full Axios config for debugging
      console.log(`[USER SERVICE] Full request config:`, {
         baseURL: axios.defaults.baseURL,
         timeout: axios.defaults.timeout,
         withCredentials: axios.defaults.withCredentials
      });
      
      throw error;
   }
}
