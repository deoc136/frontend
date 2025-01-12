'use client';

import TextField from '@/app/components/inputs/TextField';
import { Dispatch, SetStateAction } from 'react';
import { z } from 'zod';
import { onlyLettersRegex, onlyNumbersRegex } from '@/lib/regex';
import { NewUserOutline } from '@/types/user';
import { useAppSelector } from '@/lib/hooks/redux-hooks';

interface ICreateUserForm {
   newUser: NewUserOutline | undefined;
   setNewUser: Dispatch<SetStateAction<NewUserOutline | undefined>>;
   errors: z.ZodIssue[] | undefined;
}

export default function CreateUserForm({
   newUser,
   setNewUser,
   errors,
}: ICreateUserForm) {
   return (
      <div className="my-14 grid grid-cols-2 gap-5">
         <TextField
            value={newUser?.names}
            onChange={val => {
               if (onlyLettersRegex.test(val) || val === '') {
                  setNewUser(prev => prev && { ...prev, names: val });
               }
            }}
            errorMessage={
               errors?.find(error => error.path.at(0) === 'names')?.message
            }
            placeholder="Ingresar nombres"
            label="Nombres"
            isRequired
         />
         <TextField
            value={newUser?.last_names}
            onChange={val => {
               if (onlyLettersRegex.test(val) || val === '') {
                  setNewUser(prev => prev && { ...prev, last_names: val });
               }
            }}
            errorMessage={
               errors?.find(error => error.path.at(0) === 'last_names')?.message
            }
            placeholder="Ingresar apellidos"
            label="Apellidos"
            isRequired
         />
         <TextField
            value={newUser?.email}
            onChange={val =>
               setNewUser(prev => prev && { ...prev, email: val })
            }
            errorMessage={
               errors?.find(error => error.path.at(0) === 'email')?.message
            }
            placeholder="Ingresar email"
            type="email"
            label="Correo electrónico"
            isRequired
         />
         <TextField
            value={newUser?.phone}
            onChange={val => {
               if (onlyNumbersRegex.test(val) || val === '') {
                  setNewUser(prev => prev && { ...prev, phone: val });
               }
            }}
            errorMessage={
               errors?.find(error => error.path.at(0) === 'phone')?.message
            }
            placeholder="Ingresar número"
            label="Número de teléfono"
            isRequired
         />
         <div className="col-span-2">
            <TextField
               value={newUser?.address || ''}
               onChange={val =>
                  setNewUser(prev => prev && { ...prev, address: val || undefined })
               }
               errorMessage={
                  errors?.find(error => error.path.at(0) === 'address')?.message
               }
               placeholder="Ingresar dirección (opcional)"
               label="Dirección de residencia (opcional)"
            />
         </div>
      </div>
   );
}
