'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import { PropsWithChildren, useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { View, Image, Text, Heading, useTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import logo from '@/public/logodcc.svg';

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
        <div className="relative mx-auto w-48 h-24">
          <Image 
            alt="DCC logo" 
            src="/logodcc.svg"
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();
    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text className="dark:text-gray-300" color={tokens.colors.neutral[80]}>
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
          className="dark:text-white text-black"
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
          style={{
            color: 'inherit'
          }}
        >
          Iniciar Sesión
        </Heading>
      );
    },
    Footer() {
      return (
        <View textAlign="center">
          <Text className="dark:text-gray-300">¿Necesitas ayuda? Contáctanos</Text>
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
      className: 'dark:text-white'
    },
    password: {
      placeholder: 'Ingresa tu contraseña',
      label: 'Contraseña:',
      isRequired: true,
      className: 'dark:text-white'
    }
  },
  signUp: {
    email: {
      placeholder: 'Ingresa tu correo electrónico',
      label: 'Correo Electrónico:',
      isRequired: true,
      order: 1,
      className: 'dark:text-white'
    },
    phone_number: {
      placeholder: 'Ingresa tu número de teléfono',
      label: 'Teléfono:',
      isRequired: true,
      order: 2,
      className: 'dark:text-white'
    },
    password: {
      placeholder: 'Crea una contraseña',
      label: 'Contraseña:',
      isRequired: true,
      order: 3,
      className: 'dark:text-white'
    },
    confirm_password: {
      placeholder: 'Confirma tu contraseña',
      label: 'Confirmar Contraseña:',
      isRequired: true,
      order: 4,
      className: 'dark:text-white'
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
      className="dark:bg-gray-900"
    >
      {children}
    </Authenticator>
  );
} 