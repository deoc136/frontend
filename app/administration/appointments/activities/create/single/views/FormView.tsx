'use client';

import {
   Dispatch,
   SetStateAction,
   useEffect,
   useMemo,
   useState,
   useTransition,
} from 'react';
import { z } from 'zod';
import {
   FullFilledUser,
   NewUser,
   User,
   UserService,
} from '@/types/user';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import ComboBox from '@/app/components/inputs/ComboBox';
import { Item } from 'react-stately';
import { NewAppointmentWithDate } from './CreationView';
import { Service } from '@/types/service';
import DatePicker from '@/app/components/inputs/DatePicker';
import { CalendarDate, CalendarDateTime, today } from '@internationalized/date';
import { cutFullName, isSameDay, timezone } from '@/lib/utils';
import UserOverviewCard from '@/app/components/shared/cards/UserOverviewCard';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Button from '@/app/components/shared/Button';
import Image from 'next/image';
import { Appointment, PaymentMethod } from '@/types/appointment';
import SelectPatientModal from '../../../components/SelectPatientModal';
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded';
import TextField from '@/app/components/inputs/TextField';

interface IFormView {
   errors?: z.ZodError['errors'];
   setValues: Dispatch<SetStateAction<NewAppointmentWithDate>>;
   values: NewAppointmentWithDate;
   services: Service[];
   userServices: UserService[];
   patients: User[];
   appointments: Appointment[];
   newPatient?: NewUser;
   setNewPatient: Dispatch<SetStateAction<NewUser | undefined>>;
   doctors: User[];
}

export type ChangeValuesFunction = <T extends keyof NewAppointmentWithDate>(
   param: T,
   value: NewAppointmentWithDate[T],
) => void;

export default function FormView({
   setValues,
   values,
   errors,
   patients,
   services,
   userServices,
   appointments,
   newPatient,
   doctors,
   setNewPatient,
}: IFormView) {
   function changeValues<T extends keyof typeof values>(
      param: T,
      value: (typeof values)[T],
   ) {
      setValues(prev => ({ ...prev, [param]: value }));
   }

   const [patientModalOpen, setPatientModalOpen] = useState(false);

   const patient = useMemo(
      () => patients.find(user => user.id.toString() === values.patient_id),
      [patients, values.patient_id],
   );
   const [cardTherapist, setCardTherapist] = useState(!!values.doctor_id);

   const filteredDoctors = useMemo(() => {
      return doctors;
   }, [doctors]);

   const selectedDoctor = useMemo(
      () =>
         filteredDoctors.find(
            ({ id }) => id.toString() === values.doctor_id,
         ),
      [values.doctor_id, filteredDoctors],
   );


   return (
      <>
         <SelectPatientModal
            newUser={newPatient}
            setNewUser={setNewPatient}
            isOpen={patientModalOpen}
            setIsOpen={setPatientModalOpen}
            selectedUserId={values.patient_id}
            users={patients}
            changeValues={id => changeValues('patient_id', id)}
         />
         <div className="mb-10 grid gap-10">
            <h2 className="font-semibold">Datos generales de la reserva</h2>
            <section className="mx-20 grid grid-cols-2 gap-5">
               <div className="col-span-2">
                  <p className="mb-2 text-on-background-text label">Paciente</p>
                  {newPatient || patient ? (
                     <UserOverviewCard
                        user={newPatient ?? patient!}
                        extra={
                           <Button
                              onPress={() => setPatientModalOpen(true)}
                              className="flex w-max items-center gap-2 bg-transparent !text-secondary"
                           >
                              Cambiar
                           </Button>
                        }
                     />
                  ) : (
                     <Button
                        onPress={() => setPatientModalOpen(true)}
                        className="flex !w-full justify-center border-2 border-dashed border-on-background-light !bg-transparent !p-6 !text-on-background-text"
                     >
                        <AddRoundedIcon /> Agregar paciente
                     </Button>
                  )}

                  {(message =>
                     message && (
                        <div className="mt-4 text-error">{message}</div>
                     ))(
                     errors?.find(error => error.path.at(0) === 'patient_id')
                        ?.message,
                  )}
               </div>

               <div className="col-span-2">
                  {cardTherapist && selectedDoctor ? (
                     <>
                        <p className="mb-2 text-on-background-text label">
                           Doctor
                        </p>
                        <UserOverviewCard
                           user={selectedDoctor}
                           extra={
                              <Button
                                 className="!bg-transparent !p-0"
                                 aria-label="change therapist"
                                 onPress={() => setCardTherapist(false)}
                              >
                                 <ChevronRightRoundedIcon className="!rotate-90 !fill-on-background-text" />
                              </Button>
                           }
                        />
                     </>
                  ) : (
                     <ComboBox
                        placeholder="Selecciona un doctor"
                        label="Doctor"
                        selectedKey={values.doctor_id?.toString()}
                        onSelectionChange={val => {
                           if (val) {
                              setValues(prev => ({
                                 ...prev,
                                 doctor_id: val.toString(),
                                 hour: '',
                              }));
                              setCardTherapist(true);
                           }
                        }}
                        errorMessage={
                           errors?.find(
                              error => error.path.at(0) === 'doctor_id',
                           )?.message
                        }
                     >
                        {doctors.map(({ id, names, last_names }) => (
                           <Item
                              key={id}
                              textValue={cutFullName(names, last_names)}
                           >
                              <div className="flex w-full gap-3 px-4 py-3 hover:bg-primary-100">
                                 <div className="relative aspect-square h-max w-10 overflow-hidden rounded-full">
                                 </div>
                                 <div>
                                    <p className="mb-2 text-lg font-semibold">
                                       {names} {last_names}
                                    </p>
                                 </div>
                              </div>
                           </Item>
                        ))}
                     </ComboBox>
                  )}
               </div>
               <ComboBox
                  placeholder="Selecciona un servicio"
                  label="Tipo de servicio"
                  selectedKey={values.service_id?.toString()}
                  onSelectionChange={val => {
                     if (!val) return;
                     const aux = services.find(
                        ({ id }) => id.toString() === val.toString(),
                     );
                     setValues(prev => ({
                        ...prev,
                        price: aux?.price ?? '',
                        service_id: val.toString(),
                     }));
                  }}
                  errorMessage={
                     errors?.find(error => error.path.at(0) === 'service_id')
                        ?.message
                  }
               >
                  {services
                     .filter(service => service.active && !service.removed)
                     .map(type => (
                        <Item key={type.id} textValue={type.name}>
                           <div className="px-4 py-3 hover:bg-primary-100">
                              {type.name}
                           </div>
                        </Item>
                     ))}
               </ComboBox>
               <DatePicker
                  label="Fecha de la reserva"
                  isDisabled={!values.service_id}
                  errorMessage={errors?.find(error => error.path.at(0) === 'date')?.message}
                  minValue={today(timezone)}
                  value={values.date}
                  onChange={val => {
                     val && setValues(prev => ({
                        ...prev,
                        date: val,
                        hour: '',
                     }));
                  }}
               />
               <ComboBox
                  isDisabled={!values.service_id}
                  placeholder="Selecciona un horario"
                  label="Horario de la reserva"
                  selectedKey={`${values.hour}:${values.minute.toString().padStart(2, '0')}`}
                  onSelectionChange={val => {
                     if (!val) return;
                     const [hours, minutes] = val.toString().split(':').map(Number);
                     changeValues('hour', hours.toString());
                     changeValues('minute', minutes);
                  }}
                  errorMessage={
                     errors?.find(error => error.path.at(0) === 'hour')?.message
                  }
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
               <ComboBox
                  placeholder="Selecciona un método"
                  label="Método de pago"
                  selectedKey={values.payment_method.toString()}
                  onSelectionChange={val => {
                     val &&
                        changeValues(
                           'payment_method',
                           val.toString() as PaymentMethod,
                        );
                  }}
                  errorMessage={
                     errors?.find(
                        error => error.path.at(0) === 'payment_method',
                     )?.message
                  }
               >
                  {(
                     [
                        {
                           name: 'Pago online',
                           code: 'ONLINE',
                        },
                        {
                           name: 'Pago en efectivo',
                           code: 'CASH',
                        },
                        {
                           name: 'Pago con tarjeta',
                           code: 'CARD',
                        },
                     ] as const
                  ).map(method => (
                     <Item key={method.code} textValue={method.name}>
                        <div className="px-4 py-3 hover:bg-primary-100">
                           {method.name}
                        </div>
                     </Item>
                  ))}
               </ComboBox>

                   
            </section>
         </div>
      </>
   );
}
