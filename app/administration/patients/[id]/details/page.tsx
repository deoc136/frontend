import { clinicRoutes } from '@/lib/routes';
import { getUserById } from '@/services/user';
import { redirect } from 'next/navigation';
import DetailsView from './views/DetailsView';

export const revalidate = 0;

export default async function Page({
   params,
}: {
   params: { id: string; };
}) {
   try {
      const user = (await getUserById(params.id)).data;

      if (user.role !== 'PATIENT' || user.retired) throw Error();


      return (
         <DetailsView
            user={user}
         />
      );
   } catch (error) {
      redirect(clinicRoutes().receptionist_patients);
   }
}
