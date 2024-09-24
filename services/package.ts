import { InsertMethodResponse } from '@/types/general';
import axios from 'axios';

export async function createPackage(slug: string, data: NewPackage) {
   return await axios.post<InsertMethodResponse>('/package/create', data, );
}

export async function getPackageById(slug: string, id: string) {
   return await axios.get<Package>(`/package/get/${id}`, );
}

export async function editPackage(slug: string, data: Package) {
   return await axios.put('/package/edit', data, );
}

export async function deletePackage(slug: string, id: string) {
   return await axios.delete(`/package/delete/${id}`, {
      headers: {
         slug,
      },
   });
}

export async function getAllPackagesByServiceId( id: string) {
   return await axios.get<Package[]>(`/package/getAllByServiceId/${id}`);
}

export async function getAllPackages(slug: string) {
   return await axios.get<Package[]>(`/package/getAll`);
}
