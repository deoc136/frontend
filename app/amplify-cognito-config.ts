"use client";

import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';

const authConfig = {
  Cognito: {
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || '',
    userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '',
  }
};

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true }
);
export default function ConfigureAmplifyClientSide() {
  return null;
}