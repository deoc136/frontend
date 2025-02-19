'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { SORoutes } from '@/lib/routes';
import { useEffect } from 'react';
import { getUserByCognitoId } from '@/services/user';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { setUser } from '@/lib/features/user/user_slice';
import '@aws-amplify/ui-react/styles.css';

export default function Page() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="grid pb-10 sm:h-full sm:grid-rows-auth-disposition sm:pb-0">
      <Authenticator
        initialState="signIn"
        services={{
          async validateCustomSignIn(user) {
            try {
              const response = await getUserByCognitoId(user.username);
              if (response.data.role !== 'PATIENT') {
                throw new Error('Only patients can access this area');
              }
              dispatch(setUser(response.data));
              router.push(SORoutes.softwareOwner);
            } catch (error) {
              console.error('Error during sign in:', error);
              throw error;
            }
          }
        }}
      >
        {({ signOut }) => (
          <div>
            <h1>You are signed in!</h1>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
      </Authenticator>
    </div>
  );
}
