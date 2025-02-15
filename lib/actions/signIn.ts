import { CognitoUser } from '@/types/amplify';
import { signIn as amplifySignIn, SignInInput } from '@aws-amplify/auth';

type SignInParameters = {
   email: string;
   password: string;
};

export async function signIn({ email, password }: SignInParameters) {
   try {
      const signInInput: SignInInput = {
         username: email,
         password,
      };
      const result = await amplifySignIn(signInInput);
      return result as unknown as CognitoUser;
   } catch (error) {
      console.error('error signing in', error);
      throw error;
   }
}
