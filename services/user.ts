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



export async function getAllUsers(slug: string) {
   return axios.get<User[]>('/user/getAll', {
      headers: {
         slug,
      },
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
   return axios.get<User>(`/user/getByCognitoId/${cognitoId}`);
}
