'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { clinicRoutes } from '@/lib/routes';
import { useEffect } from 'react';
import { getUserByCognitoId } from '@/services/user';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { setUser } from '@/lib/features/user/user_slice';

interface AuthenticatedContentProps {
  signOut?: () => void;
  user?: {
    username?: string;
  };
}

// Create a separate component for authenticated content
// This allows proper use of hooks
function AuthenticatedContent({ signOut, user }: AuthenticatedContentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // This effect runs when the user is authenticated
  useEffect(() => {
    async function handleAuthentication() {
      try {
        if (user?.username) {
          console.log('[LOGIN] Processing authentication for cognito ID:', user.username);
          
          // Try with direct URL to bypass any potential axios config issues
          const response = await getUserByCognitoId(user.username, true);
          console.log('[LOGIN] User data retrieved successfully:', response.data);
          
          if (response.data.role !== 'PATIENT') {
            console.error('[LOGIN] Role check failed: Only patients can access this area');
            if (signOut) signOut();
            return;
          }
          
          // Store user in Redux
          dispatch(setUser(response.data));
          console.log('[LOGIN] User stored in Redux, redirecting to services page');
          
          // Redirect to patient services page
          router.push(clinicRoutes().patient_services);
        }
      } catch (error) {
        console.error('[LOGIN] Error during authentication:', error);
        if (signOut) signOut();
      }
    }
    
    handleAuthentication();
  }, [user, router, dispatch, signOut]);

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h1 className="mb-6 text-2xl font-bold">¡Inicio de sesión exitoso!</h1>
      <p className="mb-4">Redireccionando a tu cuenta...</p>
      <button 
        onClick={() => signOut && signOut()}
        className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid pb-10 sm:h-full sm:grid-rows-auth-disposition sm:pb-0">
      <Authenticator
        initialState="signIn"
        loginMechanisms={['email']}
        signUpAttributes={['email', 'name', 'family_name', 'phone_number']}
        formFields={{
          signIn: {
            username: {
              placeholder: 'Correo electrónico',
              label: 'Correo electrónico',
              isRequired: true,
            },
            password: {
              placeholder: 'Contraseña',
              label: 'Contraseña',
              isRequired: true,
            },
          },
        }}
      >
        {(props) => <AuthenticatedContent {...props} />}
      </Authenticator>
    </div>
  );
}