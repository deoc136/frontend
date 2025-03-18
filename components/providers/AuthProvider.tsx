'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { PropsWithChildren, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { View, Image, Text, Heading, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify with environment variables only
// This configuration ONLY uses your existing Cognito User Pool
// and doesn't create a new one via CloudFormation
const configureAmplify = () => {
  if (typeof window === "undefined") return; // Skip on server-side
  
  if (!process.env.NEXT_PUBLIC_USER_POOL_ID || 
      !process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 
      !process.env.NEXT_PUBLIC_AWS_REGION) {
    console.error('[AUTH] Required environment variables for Amplify are not set');
    return;
  }

  // Log configuration for debugging
  console.log('[AUTH] Configuring Amplify with:', {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID
  });

  // Configure Amplify with just the auth config
  try {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID ?? '',
          userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ?? '',
        }
      }
    }, { ssr: true });
    console.log('[AUTH] Amplify configured successfully');
  } catch (error) {
    console.error('[AUTH] Error configuring Amplify:', error);
  }
};

// Custom components for Authenticator
const components = {
  Header() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="App logo"
          src="/logo.png"
          className="mx-auto h-16 w-auto"
        />
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>
          &copy; 2024 DCC. All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();
      return (
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Iniciar Sesión
        </Heading>
      );
    },
    Footer() {
      return (
        <View textAlign="center">
          <Text>¿Necesitas ayuda? Contáctanos</Text>
        </View>
      );
    }
  }
};

// Form field customization
const formFields = {
  signIn: {
    username: {
      placeholder: 'Ingresa tu correo electrónico',
      label: 'Correo Electrónico:',
      isRequired: true,
    },
    password: {
      placeholder: 'Ingresa tu contraseña',
      label: 'Contraseña:',
      isRequired: true,
    }
  },
  signUp: {
    email: {
      placeholder: 'Ingresa tu correo electrónico',
      label: 'Correo Electrónico:',
      isRequired: true,
      order: 1
    },
    phone_number: {
      placeholder: 'Ingresa tu número de teléfono',
      label: 'Teléfono:',
      isRequired: true,
      order: 2
    },
    password: {
      placeholder: 'Crea una contraseña',
      label: 'Contraseña:',
      isRequired: true,
      order: 3
    },
    confirm_password: {
      placeholder: 'Confirma tu contraseña',
      label: 'Confirmar Contraseña:',
      isRequired: true,
      order: 4
    }
  }
};

export default function AuthProvider({ children }: PropsWithChildren) {
  // Configure Amplify when component mounts
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <Authenticator
      components={components}
      formFields={formFields}
      variation="modal"
      loginMechanisms={['email', 'phone_number']}
    >
      {children}
    </Authenticator>
  );
} 