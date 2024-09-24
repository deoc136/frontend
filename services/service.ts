//import { InsertMethodResponse } from '@/types/general';
import { NewService, Service } from '@/types/service';
import axios from 'axios';

// Function to get all services
export async function getAllServices() {
   // Axios GET request to fetch all services
   return await axios.get<Service[]>('service/getAll');
}

export async function getServiceById(id: string) {
   if (!id) {
     throw new Error("Service ID is not defined");
   }
   return await axios.get<Service>(`/service/get/${id}`);
}