'use client';

//import SubmittedFormsTable from '@/components/shared/tables/SubmittedFormsTable';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux-hooks';
//import useClinicCurrency from '@/lib/hooks/useClinicCurrency';
import { Appointment } from '@/types/appointment';
//import { Headquarter } from '@/types/headquarter';
import { Service } from '@/types/service';
import { User } from '@/types/user';
import {
   Dispatch,
   Key,
   SetStateAction,
   useEffect,
   useMemo,
   useState,
} from 'react';
import { Item, SortDirection } from 'react-stately';
import UserOverviewCard from '@/app/components/shared/cards/UserOverviewCard';
import { clinicRoutes } from '@/lib/routes';
import AppointmentStateChip from '@/app/components/shared/AppointmentStateChip';
import { changeTitle } from '@/lib/features/title/title_slice';
import Button, { Variant } from '@/components/shared/Button';
import { useRouter } from 'next/navigation';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { formatPrice, translateAppointmentAssistance } from '@/lib/utils';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { Select } from '@/app/components/inputs/Select';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import { editAppointment } from '@/services/appointment';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import ModalTrigger from '@/components/modal/ModalTrigger';
import Dialog from '@/components/modal/Dialog';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

interface IDetailsView {
   appointment: Appointment;
   patient: User;
   therapist: User;
   service: Service;
}

export default function DetailsView({
   appointment,
   patient,
   service,
   therapist,
}: IDetailsView) {
   const router = useRouter();

   const dispatch = useAppDispatch();


   const directionState = useState<SortDirection>('ascending');
   const columnState = useState<Key>();

   const [changingState, setChangingState] = useState(false);

   const [isClosing, setIsClosing] = useState(false);
   const [isMissed, setIsMissed] = useState(false);



   useEffect(() => {

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [...directionState, ...columnState]);


   const isClosed = useMemo(
      () => ['CANCELED', 'CLOSED'].some(state => appointment.state === state),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [appointment.state, appointment.assistance],
   );

   useEffect(() => {
      dispatch(
         changeTitle({
            goBackRoute: isClosed
               ? clinicRoutes().receptionist_appointments_history
               : clinicRoutes().receptionist_appointments_actives,
            value: isClosed
               ? 'Reservas / Historial de reservas / Detalles de reserva'
               : 'Reservas / Reservas activas / Detalles de reserva',
         }),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dispatch, appointment.state, appointment.assistance]);

   return (
      <>
         <ClosedModal isOpen={isMissed} setIsOpen={setIsMissed} />
         <InAssistanceModal
            action={async () => {
               setChangingState(true);

               try {
                  await editAppointment( {
                     ...appointment,
                     assistance: 'MISSED',
                     state: 'CLOSED',
                  });

                  setIsClosing(false);
                  setIsMissed(true);
               } catch (error) {}

               setChangingState(false);
            }}
            isClosing={changingState}
            isOpen={isClosing}
            setIsOpen={setIsClosing}
         />
         <div className="grid h-max gap-10">
            <div className="flex items-center justify-between">
               <h3 className="text-xl">Información de la reserva</h3>
               {!isClosed && (
                  <div className="flex items-center gap-4">
                     <Button
                        href={
                           clinicRoutes(
                           ).receptionist_appointments_id(appointment.id).edit
                        }
                        className="flex items-center gap-2 !px-6 !py-2"
                        variant={Variant.secondary}
                     >
                        <EditRoundedIcon /> Editar
                     </Button>
                     {!!appointment.assistance ? (
                        <Button
                           className={`flex w-max items-center gap-2 whitespace-nowrap !px-6 !py-2 ${
                              appointment.assistance === 'ATTENDED'
                                 ? '!bg-success'
                                 : '!bg-error'
                           }`}
                        >
                           <FlagRoundedIcon />{' '}
                           {appointment.assistance === 'ATTENDED'
                              ? 'El paciente asistió'
                              : 'El paciente no asistió'}
                        </Button>
                     ) : (
                        <Select
                           isDisabled={changingState}
                           staticWidth
                           className="flex items-center gap-2 border border-secondary bg-transparent !px-10 !py-2 !text-secondary"
                           onSelectionChange={async val => {
                              if (val === 'ATTENDED') {
                                 setChangingState(true);

                                 try {
                                    await editAppointment( {
                                       ...appointment,
                                       assistance: 'ATTENDED',
                                    });

                                    router.refresh();
                                 } catch (error) {}

                                 setChangingState(false);
                              } else {
                                 setIsClosing(true);
                              }
                           }}
                           triggerContent={
                              <>
                                 {changingState ? (
                                    <>
                                       Cargando...
                                       <RefreshRoundedIcon className="animate-spin" />
                                    </>
                                 ) : (
                                    <>
                                       <FlagOutlinedIcon /> Asistencia
                                    </>
                                 )}
                              </>
                           }
                        >
                           <Item key="ATTENDED">
                              <div className="w-full truncate py-3 pl-8">
                                 Paciente asistió
                              </div>
                           </Item>
                           <Item key="MISSED">
                              <div className="w-full truncate py-3 pl-8">
                                 Marcar inasistencia
                              </div>
                           </Item>
                        </Select>
                     )}
                  </div>
               )}
            </div>
            <section className="mx-24 grid grid-cols-2 gap-5">
               <div>
                  <p className="mb-2 font-semibold">Servicio</p>
                  <p className="text-on-background-text">{service.name}</p>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Estado de la atención</p>
                  <div className="w-max text-on-background-text">
                     <AppointmentStateChip state={appointment.state} />
                  </div>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Fecha</p>
                  <p className="text-on-background-text">
                     {(date =>
                        `${Intl.DateTimeFormat(undefined, {
                           month: 'long',
                        }).format(
                           date,
                        )} ${date.getDate()} ${date.getFullYear()}`)(
                        new Date(appointment.date),
                     )}
                  </p>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Hora</p>
                  <p className="text-on-background-text">
                     {`${appointment.hour.toString().padStart(2, '0')}:${appointment.minute.toString().padStart(2, '0')}`}
                  </p>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Precio</p>
                  <p className="text-on-background-text">
                     {formatPrice(Number(appointment.price))}
                  </p>
               </div>
               <div>
                  <p className="mb-2 font-semibold">Lugar del servicio</p>
               </div>
               {!!appointment.assistance && isClosed && (
                  <div>
                     <p className="mb-2 font-semibold">
                        Asistencia del paciente
                     </p>
                     <p className="text-on-background-text">
                        {translateAppointmentAssistance(appointment.assistance)}
                     </p>
                  </div>
               )}
            </section>
            <h3 className="text-xl">Información del paciente</h3>
            <section className="mx-24">
               <UserOverviewCard
                  url={
                     clinicRoutes().receptionist_patients_id(
                        patient.id,
                     ).details
                  }
                  user={patient}
               />
            </section>
            <h3 className="text-xl">Información del Doctor</h3>
            <section className="mx-24">
               <UserOverviewCard user={therapist} />
            </section>
            {isClosed && (
               <section className="flex justify-between">
                  <h3 className="text-xl">Historia clínica</h3>
                  <Button
                     className="flex !w-max items-center gap-2 !px-9"
                     href={
                        clinicRoutes().receptionist_appointments_id(
                           appointment.id,
                        ).history
                     }
                     variant={Variant.secondary}
                  >
                     Abrir historia clínica <ArrowForwardRoundedIcon />
                  </Button>
               </section>
            )}
         </div>
      </>
   );
}

interface IInAssistanceModal {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
   action: () => any;
   isClosing: boolean;
}

function InAssistanceModal({
   isOpen,
   setIsOpen,
   action,
   isClosing,
}: IInAssistanceModal) {
   return (
      <ModalTrigger className="m-2 animate-appear sm:m-8" isOpen={isOpen}>
         {() => (
            <Dialog className="flex  flex-col items-center gap-9 rounded-xl p-12">
               <WarningRoundedIcon className="!text-8xl !text-warning" />
               <div>
                  <h3 className="mb-3 text-center text-xl">
                     ¿Deseas marcar inasistencia y finalizar esta reserva?
                  </h3>
                  <p className="text-center !font-normal text-on-background-text body-1">
                     Si marcas la inasistencia del paciente, se finalizará{' '}
                     <br />
                     la reserva de forma automática. El estado no se podrá
                     cambiar
                  </p>
               </div>
               <div className="grid w-full grid-cols-2 gap-5">
                  <Button
                     variant={Variant.secondary}
                     onPress={() => setIsOpen(false)}
                  >
                     Atrás
                  </Button>
                  <Button isDisabled={isClosing} onPress={action}>
                     {isClosing ? (
                        <>
                           Cargando...
                           <RefreshRoundedIcon className="animate-spin" />
                        </>
                     ) : (
                        <>Marcar inasistencia y finalizar</>
                     )}
                  </Button>
               </div>
            </Dialog>
         )}
      </ModalTrigger>
   );
}

interface IClosedModal {
   isOpen: boolean;
   setIsOpen: Dispatch<SetStateAction<boolean>>;
}

function ClosedModal({ isOpen, setIsOpen }: IClosedModal) {
   const router = useRouter();


   return (
      <ModalTrigger className="m-2 animate-appear sm:m-8" isOpen={isOpen}>
         {() => (
            <Dialog className="flex  flex-col items-center gap-9 rounded-xl p-8 sm:p-14">
               <CheckCircleRoundedIcon className="!text-8xl text-primary" />
               <div>
                  <h3 className="mb-3 text-center text-xl">
                     Finalizaste la reserva
                  </h3>
                  <p className="text-center !font-normal text-on-background-text body-1">
                     Ahora podrás ver los datos de la reserva en el historial de
                     reservas
                  </p>
               </div>
               <div className="grid w-full grid-cols-2 gap-5">
                  <Button
                     variant={Variant.secondary}
                     href={clinicRoutes().receptionist_appointments_actives}
                  >
                     Volver a reservas activas
                  </Button>
                  <Button
                     onPress={() => {
                        router.refresh();
                        setIsOpen(false);
                     }}
                  >
                     Ver detalles en el historial
                  </Button>
               </div>
            </Dialog>
         )}
      </ModalTrigger>
   );
}
