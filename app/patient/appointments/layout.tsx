'use client';

import { PropsWithChildren } from 'react';
import LayoutChildrenWrapper from './components/LayoutChildrenWrapper';
import AuthProvider from '@/components/providers/AuthProvider';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function Layout({
   children,
}: PropsWithChildren) {
   return (
     <AuthProvider>
       <AppointmentsContent>{children}</AppointmentsContent>
     </AuthProvider>
   );
}

function AppointmentsContent({ children }: PropsWithChildren) {
  // Get authentication status
  const { authStatus } = useAuthenticator((context) => [context.authStatus]);

  // Only render the appointments content if authenticated
  if (authStatus !== 'authenticated') {
    return null;
  }

  return <>{children}</>;
}
