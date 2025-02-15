'use client';

import { getUserByCognitoId } from '@/services/user';
import { User } from '@/types/user';
import BasicLogin from '@/components/shared/auth/BasicLogin';
import { signIn } from '@/lib/actions/signIn';
import { signOut } from '@/lib/actions/signOut';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { SORoutes, clinicRoutes } from '@/lib/routes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';
import Link from 'next/link';
import { setUser } from '@/lib/features/user/user_slice';
import useDictionary from '@/lib/hooks/useDictionary';
import '@aws-amplify/ui-react/styles.css';

export default function Page() {
   const dic = useDictionary();
   const dispatch = useAppDispatch();
   const [password, setPassword] = useState('');
   const [email, setEmail] = useState('');
   const [error, setError] = useState<string>();
   const router = useRouter();

   async function handleSubmit(setLoading: (value: SetStateAction<boolean>) => void) {
      setError(undefined);
      try {
         setLoading(true);
         const user = await signIn({ email, password });
         if (user) {
            const response = await getUserByCognitoId();
            dispatch(setUser(response.data));
            router.push(SORoutes.softwareOwner);
         }
      } catch (err: any) {
         setError(err.message || 'An error occurred during sign in');
      } finally {
         setLoading(false);
      }
   }

   return (
      <>
         <div
            className="relative -left-5 -top-5 right-5 w-[calc(100%+2.5rem)] rounded-bl-3xl bg-primary bg-waves bg-cover bg-right bg-no-repeat p-5 pr-0 pt-10
            sm:hidden"
         >
         </div>
         <div className="grid pb-10 sm:h-full sm:grid-rows-auth-disposition sm:pb-0">
            <BasicLogin
               resetPasswordUrl={clinicRoutes().clinic_resetPassword}
               error={error}
               password={password}
               setPassword={setPassword}
               setUsername={setEmail}
               username={email}
               onSubmit={handleSubmit}
            />
         </div>
      </>
   );
}
