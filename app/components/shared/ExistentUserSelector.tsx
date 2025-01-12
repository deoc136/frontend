'use client';

import TextField from '@/app/components/inputs/TextField';
import { Radio, RadioGroup } from '@/app/components/inputs/Radio';
import { User } from '@/types/user';
import { Search } from '@mui/icons-material';
import Image from 'next/image';
import CircleRoundedIcon from '@mui/icons-material/Circle';
import CircleOutlinedRoundedIcon from '@mui/icons-material/CircleOutlined';
import { Dispatch, SetStateAction, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/redux-hooks';

interface IExistentUserSelector {
   users: User[];
   selectedUser: string | null;
   setSelectedUser: Dispatch<SetStateAction<string | null>>;
}

export default function ExistentUserSelector({
   users,
   setSelectedUser,
   selectedUser,
}: IExistentUserSelector) {
   const [filter, setFilter] = useState('');

   return (
      <div>
         <TextField
            aria-label="search"
            startIcon={<Search />}
            className="w-full"
            placeholder="Buscar"
            value={filter}
            onChange={setFilter}
         />
         <div className="mt-5 max-h-[50vh] overflow-auto">
            <RadioGroup
               value={selectedUser ?? ''}
               onChange={setSelectedUser}
               aria-label="Users list"
            >
               {users
                  .filter(
                     ({ names, last_names }) =>
                        !filter.length ||
                        `${names} ${last_names}`
                           .toLowerCase()
                           .includes(filter.toLowerCase()),
                  )
                  .map(user => (
                     <UserRow key={user.id} {...user} />
                  ))}
            </RadioGroup>
         </div>
      </div>
   );
}

interface IUserRow extends User {}

function UserRow({ ...user }: IUserRow) {
   return (
      <Radio className="w-full" key={user.id} value={user.id.toString()}>
         <div className="box-border inline-grid w-full grid-cols-[2fr_repeat(2,1fr)_auto] items-center gap-2 p-4">
            <div className="grid w-full grid-cols-[auto_1fr] gap-3">
               <div className="relative aspect-square h-max w-10 overflow-hidden rounded-full">
                  <Image
                     src={
                         '/default_profile_picture.svg'
                     }
                     alt="user profile picture"
                     fill
                  />
               </div>
               <div className="grid w-full justify-start">
                  <p className="w-full truncate text-lg font-semibold">
                     {user.names} {user.last_names}
                  </p>
                  
                     <p className="mt-2">Role</p>

               </div>
            </div>
               <>
                  <p className="w-full truncate">
                     {user.phone}
                  </p>
                  <p className="w-full truncate">{user.email}</p>
               </>
           
               <p className="flex gap-2 justify-self-center">
                  {user.enabled ? (
                     <>
                        <CircleRoundedIcon className="!fill-success" />
                        Activo
                     </>
                  ) : (
                     <>
                        <CircleOutlinedRoundedIcon />
                        Inactivo
                     </>
                  )}
               </p>
         </div>
      </Radio>
   );
}
