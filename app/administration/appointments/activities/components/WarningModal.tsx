'use client';

import Dialog from '@/components/modal/Dialog';
import ModalTrigger from '@/components/modal/ModalTrigger';
import Button, { Variant } from '@/components/shared/Button';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { Dispatch, SetStateAction } from 'react';

interface IWarningModal {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
   cancel: () => any;
}

export default function WarningModal({
   isOpen,
   setIsOpen,
   cancel,
}: IWarningModal) {
   return (
      <ModalTrigger className="m-2 animate-appear sm:m-8" isOpen={isOpen}>
         {() => (
            <Dialog className="flex min-w-[40vw] flex-col items-center gap-9 rounded-xl p-12">
               <WarningRoundedIcon className="!text-8xl !text-warning" />
               <div>
                  <h3 className="mb-3 text-center text-xl">
                     ¿Estás seguro de cancelar el proceso?
                  </h3>
                  <p className="text-center !font-normal text-on-background-text body-1">
                     Tus cambios no serán guardados
                  </p>
               </div>
               <div className="grid w-full grid-cols-2 gap-5">
                  <Button
                     variant={Variant.secondary}
                     onPress={() => setIsOpen(false)}
                  >
                     Atrás
                  </Button>
                  <Button onPress={cancel}>Cancelar</Button>
               </div>
            </Dialog>
         )}
      </ModalTrigger>
   );
}
