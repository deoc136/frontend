'use client';

import AppointmentStateChip from '@/app/components/shared/AppointmentStateChip';
import Button, { Variant } from '@/components/shared/Button';
import UserOverviewCard from '@/app/components/shared/cards/UserOverviewCard';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import { cutFullName, formatPrice, isSameDay, timezone, translateRole } from '@/lib/utils';
import { Appointment } from '@/types/appointment';
import { Service } from '@/types/service';
import { TherapistWithSchedule, User, UserService } from '@/types/user';
import { Key, useEffect, useMemo, useState, useTransition } from 'react';
import { Item, SortDirection } from 'react-stately';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DatePicker from '@/app/components/inputs/DatePicker';
import { ZodError, z } from 'zod';
import { CalendarDate, today } from '@internationalized/date';
import ComboBox from '@/app/components/inputs/ComboBox';
import Image from 'next/image';
import CancelConfirmationModal from '@/app/components/shared/modals/CancelConfirmationModal';
import { clinicRoutes } from '@/lib/routes';
import { nonUnselectedMessage } from '@/lib/validations';
import { useRouter } from 'next/navigation';
import ModalTrigger from '@/app/components/modal/ModalTrigger';
import Dialog from '@/app/components/modal/Dialog';
import axios from 'axios';
import { renderToStaticMarkup } from 'react-dom/server';
import { editAppointment } from '@/services/appointment';

interface IEditView {
   appointment: Appointment;
   appointments: Appointment[];
   patient: User;
   service: Service;
   userServices: UserService[];
   therapists: User[];
}

export default function EditView({
   appointment,
   patient,
   service,
   userServices,
   therapists,
   appointments,
}: IEditView) {

   const [values, setValues] = useState(appointment);
   const valuesDate = useMemo(() => new Date(values.date), [values.date]);

   const directionState = useState<SortDirection>('ascending');
   const columnState = useState<Key>();

   const [isEditing, setIsEditing] = useState(false);
   const [isClosing, setIsClosing] = useState(false);

   const [editionError, setEditionError] = useState<string>();
   const [errors, setErrors] = useState<ZodError['errors']>();

   const [randomTherapist, setRandomTherapist] = useState<number>();
   const [cardTherapist, setCardTherapist] = useState(true);

   const [edited, setEdited] = useState(false);

   const [_, startTransition] = useTransition();

   const selectedTherapist = useMemo(
      () =>
         therapists.find(
            ({ id }) =>
               id.toString() === values.therapist_id.toString(),
         ),
      [values.therapist_id, therapists],
   );

   const valuesSchema = z.object({
      date: z.string().nonempty(nonUnselectedMessage),
      hour: z.number({ invalid_type_error: nonUnselectedMessage }),
   });

   async function edit() {
      if (isEditing) return;

      setIsEditing(true);
      setEditionError(undefined);

      try {
         await editAppointment({
            ...values,
            therapist_id:
               values.therapist_id === -1 && randomTherapist
                  ? Number(randomTherapist)
                  : Number(values.therapist_id),
         });

         setEdited(true);
      } catch (error) {
         setEditionError('Ocurrió un error inesperado.');
         setIsEditing(false);
      }
   }

   useEffect(() => {
      values.therapist_id === -1 &&
         startTransition(() =>
            setRandomTherapist(
               therapists[Math.floor(Math.random() * therapists.length)].id,
            ),
         );
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [values.hour]);

   function dateToCalendarDate(date: Date) {
      return new CalendarDate(
         date.getFullYear(),
         date.getMonth() + 1,
         date.getDate(),
      );
   }

   return (
      <>
         <SuccessModal id={appointment.id} isOpen={edited} />
         <CancelConfirmationModal
            isOpen={isClosing}
            setIsOpen={setIsClosing}
            route={
               clinicRoutes().receptionist_appointments_id(
                  appointment.id,
               ).details
            }
         />
         <div className="grid h-max gap-10">
            <div className="flex items-center justify-between">
               <h3 className="text-xl">Información de la reserva</h3>
               <div className="flex flex-wrap justify-end gap-5 justify-self-end">
                  <Button
                     className="h-min w-max !px-12"
                     variant={Variant.secondary}
                     isDisabled={isEditing}
                     onPress={() => setIsClosing(true)}
                  >
                     Cancelar
                  </Button>
                  <Button
                     isDisabled={isEditing}
                     onPress={() => {
                        setErrors(undefined);

                        const parsing = valuesSchema.safeParse(values);

                        !parsing.success
                           ? setErrors(parsing.error.errors)
                           : edit();
                     }}
                     className="h-min w-max !px-12"
                  >
                     {isEditing ? (
                        <>
                           Cargando...
                           <RefreshRoundedIcon className="animate-spin" />
                        </>
                     ) : (
                        'Guardar'
                     )}
                  </Button>
                  {editionError && (
                     <div className="w-full flex-none text-end text-error">
                        {editionError}
                     </div>
                  )}
               </div>
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
                  <DatePicker
                     errorMessage={
                        errors?.find(error => error.path.at(0) === 'date')
                           ?.message
                     }
                     minValue={today(timezone)}
                     value={(() => dateToCalendarDate(valuesDate))()}
                     onChange={val => {
                        val &&
                           setValues(prev => ({
                              ...prev,
                              date: val.toDate(timezone).toString(),
                              hour: NaN,
                              minute: 0,
                           }));
                     }}
                  />
               </div>
               <div>
                  <p className="mb-2 font-semibold">Hora</p>
                  <ComboBox
                     placeholder="Selecciona un horario"
                     selectedKey={`${values.hour}:${values.minute.toString().padStart(2, '0')}`}
                     onSelectionChange={val => {
                        if (val) {
                           const [selectedHour, selectedMinute] = val.toString().split(':').map(Number);
                           setValues(prev => ({ ...prev, hour: selectedHour, minute: selectedMinute }));
                        }
                     }}
                     errorMessage={errors?.find(error => error.path.at(0) === 'hour')?.message}
                  >
                     {Array.from({ length: 14 * 4 }, (_, i) => {
                        const hour = Math.floor(i / 4) + 7;
                        const minutes = (i % 4) * 15;
                        const timeString = `${hour}:${minutes.toString().padStart(2, '0')}`;
                        return (
                           <Item key={timeString} textValue={timeString}>
                              <div className="px-4 py-3 hover:bg-primary-100">
                                 {timeString}
                              </div>
                           </Item>
                        );
                     })}
                  </ComboBox>
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
            </section>
            <h3 className="text-xl">Información del paciente</h3>
            <section className="mx-24">
               <UserOverviewCard user={patient} />
            </section>
            <h3 className="text-xl">Información del Doctor</h3>
            <section className="mx-24">
               {cardTherapist && selectedTherapist ? (
                  <UserOverviewCard
                     user={selectedTherapist}
                     extra={
                        <Button
                           className="!bg-transparent !py-0 !text-secondary"
                           aria-label="change therapist"
                           onPress={() => setCardTherapist(false)}
                        >
                           Cambiar
                        </Button>
                     }
                  />
               ) : (
                  <ComboBox
                     placeholder="Selecciona un terapeuta"
                     selectedKey={values.therapist_id?.toString()}
                     onSelectionChange={val => {
                        if (val) {
                           setValues(prev => ({
                              ...prev,
                              therapist_id: Number(val),
                              hour: NaN,
                              minute: 0,
                           }));
                           setCardTherapist(true);
                        }
                     }}
                     errorMessage={
                        errors?.find(
                           error => error.path.at(0) === 'therapist_id',
                        )?.message
                     }
                  >
                     {therapists.map(user => (
                        <Item
                           key={user.id}
                           textValue={cutFullName(user.names, user.last_names)}
                        >
                           <div className="flex w-full gap-3 px-4 py-3 hover:bg-primary-100">
                              <div className="relative aspect-square h-max w-10 overflow-hidden rounded-full">
                                 <Image
                                    src={
                                       user.profile_picture.length
                                          ? user.profile_picture
                                          : '/default_profile_picture.svg'
                                    }
                                    className="rounded-full object-cover object-center"
                                    alt="Profile picture"
                                    fill
                                 />
                              </div>
                              <div>
                                 <p className="mb-2 text-lg font-semibold">
                                    {user.names} {user.last_names}
                                 </p>
                                 <p>{translateRole(user.role)}</p>
                              </div>
                           </div>
                        </Item>
                     ))}
                  </ComboBox>
               )}
            </section>
            <h3 className="text-xl opacity-50">Documentos adjuntos</h3>
         </div>
      </>
   );
}

function SuccessModal({
   isOpen,
   id,
}: {
   isOpen: boolean;
   id: number;
}) {
   const router = useRouter();

   return (
      <ModalTrigger className="m-2 animate-appear sm:m-8" isOpen={isOpen}>
         {() => (
            <Dialog className="flex flex-col items-center gap-9 rounded-xl p-8 sm:p-14">
               <CheckCircleRoundedIcon className="!text-8xl text-primary" />
               <div>
                  <h3 className="mb-3 text-center text-xl">
                     Tus cambios se han guardado
                  </h3>
                  <p className="text-center !font-normal text-on-background-text body-1">
                     Tu y paciente podrán ver los datos actualizados en el
                     detalle de la cita
                  </p>
               </div>
               <Button
                  href={
                     clinicRoutes().receptionist_appointments_id(id).details
                  }
                  className="!w-max !px-24"
               >
                  Continuar
               </Button>
            </Dialog>
         )}
      </ModalTrigger>
   );
}
