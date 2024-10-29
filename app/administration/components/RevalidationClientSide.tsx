'use client';

import { getUserByCognitoId } from '@/services/user';
import { signOut } from '@/lib/actions/signOut';
import { GlobalRoute } from '@/lib/routes';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface IRevalidationClientSide {
   route: GlobalRoute;
   slug: string;
}

export default function RevalidationClientSide({
   route,
   slug,
}: IRevalidationClientSide) {
   const router = useRouter();

   useEffect(() => {
      (async () => {
         try {
            const { username } = await Auth.currentAuthenticatedUser();

            const [
               { data: user },,
            ] = await Promise.all([
               getUserByCognitoId(slug),
            ]);

            if (
               user.role !== 'ADMINISTRATOR'
            ) {
               throw Error("The users isn't the ADMINISTRATOR");
            }
         } catch (error) {
            signOut();
            router.push(route);
         }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return <></>;
}
