'use client';

import { PropsWithChildren } from 'react';
import LayoutChildrenWrapper from './components/LayoutChildrenWrapper';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({
   children,
}: PropsWithChildren) {
   const { authStatus } = useAuthenticator((context) => [context.authStatus]);
   const router = useRouter();

   useEffect(() => {
     if (authStatus === 'unauthenticated') {
       router.push('/auth/login');
       return;
     }
   }, [authStatus, router]);

   if (authStatus !== 'authenticated') {
     return null;
   }

   return <LayoutChildrenWrapper>{children}</LayoutChildrenWrapper>;
}
