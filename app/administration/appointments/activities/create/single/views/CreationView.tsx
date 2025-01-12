'use client';

import CreationState from '@/app/components/shared/CreationState';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import { clinicRoutes } from '@/lib/routes';
import { nonEmptyMessage, nonUnselectedMessage } from '@/lib/validations';
import { Service } from '@/types/service';
import {
   NewUser,
   TherapistWithSchedule,
   User,
   UserService,
} from '@/types/user';
import { useEffect, useState } from 'react';
import { ZodError, z } from 'zod';
import FormView from './FormView';
import PreviewView from './PreviewView';
import Button from '@/app/components/shared/Button';
import { useRouter } from 'next/navigation';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { today } from '@internationalized/date';
import { timezone } from '@/lib/utils';
import { DateValue } from 'react-aria';
import {
   Appointment,
   AppointmentState,
   PaymentMethod,
} from '@/types/appointment';
import { AxiosError } from 'axios';
import {
   createAppointment,
   createAppointmentWithPatient,
} from '@/services/appointment';
import ModalTrigger from '@/components/modal/ModalTrigger';
import Dialog from '@/components/modal/Dialog';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import WarningModal from '../../../components/WarningModal';

interface ICreationVIew {
   services: Service[];
   patients: User[];
   userServices: UserService[];
   appointments: Appointment[];
}

enum AppointmentCreationState {
   creation,
   review,
}

export type NewAppointmentWithDate = typeof initialState;

const initialState = {
   service_id: '',
   price: '',
   state: 'TO_PAY' as AppointmentState,
   date: today(timezone) as DateValue,
   hour: '',
   minute: 0,
   patient_id: '',
   therapist_id: '',
   payment_method: 'ONLINE' as PaymentMethod,
};

export default function CreationView({
   services,
   patients,
   userServices,
   appointments,
}: ICreationVIew) {
   const router = useRouter();

   const [state, setState] = useState(AppointmentCreationState.creation);
   const [creating, setCreating] = useState(false);
   const [creationError, setCreationError] = useState<string>();

   const [appointmentId, setAppointmentId] = useState<number>();

   const [values, setValues] = useState(initialState);

   const [errors, setErrors] = useState<ZodError['errors']>();

   const [newPatient, setNewPatient] = useState<NewUser>();

   const [randomTherapist, setRandomTherapist] = useState<string>();

   const [closing, setClosing] = useState(false);

   const valuesSchema = z.object({
      service_id: z.string().nonempty(nonUnselectedMessage),
      price: z.string().nonempty(nonEmptyMessage),
      state: z.string().nonempty(nonEmptyMessage),
      date: z.unknown({ required_error: nonEmptyMessage }),
      hour: z.string().nonempty(nonUnselectedMessage),
      patient_id: !!newPatient
         ? z.any().optional()
         : z.string().nonempty(nonUnselectedMessage),
      payment_method: z.string().nonempty(nonUnselectedMessage),
   });

   const steps = [
      { name: 'Datos generales', state: AppointmentCreationState.creation },
      {
         name: 'Resumen',
         state: AppointmentCreationState.review,
      },
   ];

   useEffect(() => {
      setErrors(undefined);
   }, [state]);

   async function create() {
      if (creating) return;

      setCreating(true);
      setCreationError(undefined);

      try {
         if (newPatient) {
            const { id } = await createAppointmentWithPatient({
               appointment: {
                  date: values.date.toDate(timezone).toString(),
                  hour: Number(values.hour),
                  minute: values.minute,
                  patient_id: -1,
                  payment_method: values.payment_method,
                  service_id: Number(values.service_id),
                  price: values.price,
                  state: values.state,
                  creation_date: new Date().toString(),
               },
               user: newPatient,
            });
            console.log('Appointment created with new patient, id:', id);
            setAppointmentId(id);
         } else {
            const { id } = await createAppointment({
               date: values.date.toDate(timezone).toString(),
               hour: Number(values.hour),
               minute: values.minute,
               patient_id: Number(values.patient_id),
               payment_method: values.payment_method,
               service_id: Number(values.service_id),
               price: values.price,
               state: values.state,
               creation_date: new Date().toString(),
            });
            console.log('Appointment created with existing patient, id:', id);
            setAppointmentId(id);
         }
      } catch (error) {
         console.error('Error creating appointment:', error);
         setCreationError('Ocurrió un error inesperado.');
      }
      setCreating(false);
   }

   return (
      <>
         <WarningModal
            cancel={() =>
               router.push(clinicRoutes().receptionist_appointments_actives)
            }
            isOpen={closing}
            setIsOpen={setClosing}
         />
         <SuccessModal
            isOpen={appointmentId !== undefined}
            id={appointmentId}
         />
         <div className="grid h-max min-h-full grid-rows-[auto_auto_1fr_auto]">
            <CreationState
               className="w-1/3 grid-cols-[auto_1fr_auto]"
               steps={steps}  
               state={state}
            />
            {state === AppointmentCreationState.creation ? (
               <FormView
                  errors={errors}
                  setValues={setValues}
                  values={values}
                  services={services}
                  patients={patients}
                  userServices={userServices}
                  appointments={appointments}
                  newPatient={newPatient}
                  setNewPatient={setNewPatient}
               />
            ) : (
               <PreviewView
                  values={values}
                  patients={patients}
                  newPatient={newPatient}
                  services={services}
               />
            )}
            <div />
            <div className="my-5 flex flex-wrap justify-between gap-y-4">
               {creationError && (
                  <div className="w-full flex-none text-end text-error">
                     {creationError}
                  </div>
               )}
               <Button
                  isDisabled={creating}
                  onPress={() => {
                     if (creating) return;
                     switch (state) {
                        case AppointmentCreationState.creation:
                           setClosing(true);
                           break;
                        default:
                           setState(AppointmentCreationState.creation);
                           break;
                     }
                  }}
                  className="flex w-max items-center gap-2 bg-transparent !text-black"
               >
                  <ArrowBackRoundedIcon />
                  {state === AppointmentCreationState.creation
                     ? 'Regresar a reservas activas'
                     : 'Anterior'}
               </Button>
               <Button
                  isDisabled={creating}
                  onPress={() => {
                     console.log('Creating appointment');
                     setErrors(undefined);
                     if (creating) return;
                     console.log(state);
                     console.log(AppointmentCreationState.creation);

                     if (state === AppointmentCreationState.creation) {
                        console.log(values);
                        const valuesParsing = valuesSchema.safeParse(values);
                        console.log(valuesParsing);
                        valuesParsing.success
                           ? setState(AppointmentCreationState.review)
                           : setErrors(valuesParsing.error.errors);
                     } else {
                        create();
                     }
                  }}
                  className="flex w-max items-center gap-2 !px-20"
               >
                  {creating ? (
                     <>
                        Cargando...
                        <RefreshRoundedIcon className="animate-spin" />
                     </>
                  ) : state === AppointmentCreationState.creation ? (
                     <>
                        Continuar
                        <ArrowForwardRoundedIcon />
                     </>
                  ) : (
                     'Crear reserva'
                  )}
               </Button>
            </div>
         </div>
      </>
   );
}

function SuccessModal({
   isOpen,
   id,
}: {
   isOpen: boolean;
   id?: number;
}) {
   const router = useRouter();

   return (
      <ModalTrigger className="m-2 animate-appear sm:m-8" isOpen={isOpen}>
         {() => (
            <Dialog className="flex  flex-col items-center gap-9 rounded-xl p-8 sm:p-14">
               <CheckCircleRoundedIcon className="!text-8xl text-primary" />
               <div>
                  <h3 className="mb-3 text-center text-xl">
                     Has creado una nueva reserva
                  </h3>
                  <p className="text-center  !font-normal text-on-background-text body-1">
                     Tu reserva estará visible en tu lista de reservas. Recuerda
                     que la reserva <br /> cambiará a confirmada una vez el
                     cliente haya hecho efectivo el pago.
                  </p>
               </div>
               <Button
                  onPress={() => {
                     console.log('Button pressed, id:', id);
                     if (!id) {
                        console.log('No id available');
                        return;
                     }
                     const route = clinicRoutes().admin_home;
                     console.log('Navigating to:', route);
                     router.push(route);
                  }}
                  className="!w-max !px-24"
               >
                  Continuar
               </Button>
            </Dialog>
         )}
      </ModalTrigger>
   );
}
