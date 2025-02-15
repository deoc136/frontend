'use client';

import Link from 'next/link';
import TextField from '@/app/components/TextField';
import Button, { Variant } from '../Button';
import { Dispatch, SetStateAction, useState } from 'react';
import { useKeyboard } from 'react-aria';
import { useRouter } from 'next/navigation'; 
import { clinicRoutes } from '@/lib/routes';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import useDictionary from '@/lib/hooks/useDictionary';

interface IBasicLogin {
   username: string;
   password: string;
   error: string | undefined;
   setUsername: Dispatch<SetStateAction<string>>;
   setPassword: Dispatch<SetStateAction<string>>;
   resetPasswordUrl: string;
   closerButton?: boolean;
   onSubmit?: (setLoading: (value: SetStateAction<boolean>) => void) => Promise<void>;
}

export default function BasicLogin({
   resetPasswordUrl,
   error,
   password,
   setPassword,
   setUsername,
   username,
   closerButton,
   onSubmit
}: IBasicLogin) {
   const dic = useDictionary();
   const router = useRouter(); 
   const [loading, setLoading] = useState(false);

   const handleLogin = async () => {
      if (onSubmit) {
         await onSubmit(setLoading);
      }
   };

   return (
      <div className="text-sm sm:text-base">
         <div className="flex flex-col gap-5">
            <TextField
               onChange={setUsername}
               type="text"
               label={dic.texts.users.email}
               placeholder={dic.inputs.enter_email}
            />
            <TextField
               onChange={setPassword}
               type="password"
               label={dic.texts.users.password}
               placeholder={dic.inputs.enter_password}
               errorMessage={error}
            />
            <Link
               className="self-end font-semibold text-secondary underline"
               href={resetPasswordUrl}
            >
               {dic.pages.auth.login.forgot_my_password}
            </Link>
         </div>
         <Button
            variant={Variant.primary}
            onPress={handleLogin}
            isDisabled={!(username.length && password.length) || loading}
            className={`${closerButton ? 'mt-5' : 'mt-16 sm:mt-12'}`}
         >
            {loading ? (
               <>
                  {dic.texts.flows.loading}...
                  <RefreshRoundedIcon className="animate-spin" />
               </>
            ) : (
               dic.texts.flows.login
            )}
         </Button>
      </div>
   );
}
