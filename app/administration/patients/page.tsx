import { PatientWithAppointment, getAllPatients } from '@/services/user';
import type { Metadata } from 'next';
import PatientsList from './views/PatientsList';




export const revalidate = 0;

export default async function Page() {
   try {
      const users = (await getAllPatients()).data;

      return (
         <PatientsList
            users={
               users
                  .map(({ user }) => (!user.retired ? user : undefined))
                  .filter(
                     user => user !== undefined,
                  ) as PatientWithAppointment[]
            }
         />
      );
   } catch (error) {
      <PatientsList users={[]}  />;
   }
}
