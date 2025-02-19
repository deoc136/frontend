'use client';

import Button, { Variant } from '@/components/shared/Button';
import { useAppSelector } from '@/lib/hooks/redux-hooks';
import { Genre, Role } from '@/types/user';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useRouter } from 'next/navigation';
import { clinicRoutes } from '@/lib/routes';
import TextField from '@/app/components/inputs/TextField';
import { ZodError, z } from 'zod';
import { onlyLettersRegex, onlyNumbersRegex } from '@/lib/regex';
import DatePicker from '@/app/components/inputs/DatePicker';
import { CalendarDate, today } from '@internationalized/date';
import { password_regex, timezone, translateGenre } from '@/lib/utils';
import ComboBox from '@/app/components/inputs/ComboBox';
import { Item } from 'react-stately';
import Checkbox from '@/components/shared/Checkbox';
import {
   invalidEmailMessage,
   maxLengthError,
   minLengthError,
   nonEmptyMessage,
   nonUnselectedMessage,
} from '@/lib/validations';
import { registerUser } from '@/services/user';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import Link from 'next/link';
import { resendVerificationCode } from '@/lib/actions/confirm-signUp';
import { IAmplifyError } from '@/types/amplify';
import { translateError } from '@/lib/amplify_aux/error_messages';
import { AxiosError } from 'axios';
import useDictionary from '@/lib/hooks/useDictionary';

const Message_description =
   'La contraseña debe tener al menos una letra mayúscula, una minúscula, un numero y un caracter especial.';
const Message_min = 'La contraseña debe contener mínimo 8 caracteres';

interface ISignUpView {}

export default function SignUpView({}: ISignUpView) {
   const dic = useDictionary();

   const clinic = useAppSelector(store => store.clinic);
   const { cities, countries, nationalities, identification_types } =
      useAppSelector(store => store.catalogues);

   const [values, setValues] = useState({
      enabled: true,
      names: '',
      last_names: '',
      phone: '',
      address: '',
      email: '',
      profile_picture: '',
      cognito_id: '',
      role: 'PATIENT' as Role,
      birth_date: new Date(),
      genre: '' as Genre,
      nationality: '',
      residence_city: '',
      residence_country: clinic.country.toString(),
      identification_type: '',
      identification: '',
      retired: false,
   });

   const [errors, setErrors] = useState<ZodError['errors']>();

   const [isLoading, setIsLoading] = useState(false);

   const [creationError, setCreationError] = useState<string>();

   const [termsAgree, setTermsAgree] = useState(false);

   const [isSent, setIsSent] = useState(false);

   function changeValue<T extends keyof typeof values>(
      param: T,
      value: (typeof values)[T],
   ) {
      setValues(prev => ({ ...prev, [param]: value }));
   }

   const valuesSchema = z.object({
      names: z
         .string()
         .nonempty(nonEmptyMessage)
         .min(2, minLengthError(2))
         .max(70, maxLengthError(70))
         .regex(
            onlyLettersRegex,
            'El nombre solo puede contener letras y espacios.',
         ),
      last_names: z
         .string()
         .nonempty(nonEmptyMessage)
         .min(2, minLengthError(2))
         .max(70, maxLengthError(70))
         .regex(
            onlyLettersRegex,
            'El nombre solo puede contener letras y espacios.',
         ),
      birth_date: z.date({ required_error: nonEmptyMessage }),
      email: z
         .string()
         .nonempty(nonEmptyMessage)
         .email('El email debe tener un formato correcto.'),
      phone: z
         .string()
         .nonempty(nonEmptyMessage)
         .max(20, maxLengthError(20))
         .regex(
            onlyNumbersRegex,
            'El teléfono solo puede contener números y espacios.',
         ),
      genre: z.string().nonempty(nonUnselectedMessage),
      nationality: z.string().nonempty(nonUnselectedMessage),
      residence_country: z.string().nonempty(nonUnselectedMessage),
      identification_type: z.string().nonempty(nonUnselectedMessage),
      identification: z.string().nonempty(nonEmptyMessage),
      residence_city: z.string().nonempty(nonUnselectedMessage),
      address: z
         .string()
         .nonempty(nonEmptyMessage)
         .min(5, minLengthError(5))
         .max(100, maxLengthError(100)),
   });

   const todayDate = today(timezone);

   useEffect(() => {
      setValues(prev => ({
         ...prev,
         residence_city: '',
         identification_type: '',
      }));
   }, [values.residence_country]);

   async function send() {
      if (isLoading) return;

      setIsLoading(true);
      setCreationError(undefined);

      try {
         await registerUser(
            {
               ...values,
               identification_type: Number(values.identification_type),
               residence_country: Number(values.residence_country),
               residence_city: Number(values.residence_city),
               nationality: Number(values.nationality),
               date_created: new Date(),
            },
            clinic.slug,
         );

         setIsSent(true);
      } catch (error) {
         if ((error as AxiosError).response?.status === 409) {
            setCreationError(
               'El correo electrónico ingresado no está disponible.',
            );
         } else {
            setCreationError(dic.texts.errors.unexpected_error);
         }
      }

      setIsLoading(false);
   }

   useEffect(() => {
      const el = document.querySelector('#auth_background');

      if (isSent) {
         el?.classList.remove('!w-1/6');
      } else {
         el?.classList.add('!w-1/6');
      }

      return () => {
         el?.classList.remove('!w-1/6');
      };
   }, [isSent]);

   return (
      <div className="h-full text-sm lg:text-base">
         {!isSent ? (
            <div className="grid gap-5">
               <div className="h-full overflow-auto">
                  <div className="grid gap-7">
                     <div className="relative aspect-video w-36">
                        <Image
                           alt="clinic logo"
                           src={clinic.profile_picture_url}
                           className="object-contain object-center"
                           fill
                        />
                     </div>
                     <div className="flex items-center gap-5">
                        <Button
                           className="flex aspect-square !w-8 items-center justify-center !rounded-full !bg-foundation !p-0 !text-black lg:hidden"
                           href={clinicRoutes(clinic.slug).login}
                        >
                           <ArrowBackRoundedIcon />
                        </Button>
                        <h1 className="text-xl font-semibold lg:text-2xl">
                           {dic.pages.auth.sign_up.title}
                        </h1>
                     </div>
                     <p className="font-semibold text-on-background-text">
                        {dic.pages.auth.sign_up.description}
                     </p>
                     <div className="grid gap-4 md:grid-cols-2">
                        <TextField
                           label={dic.texts.users.name}
                           placeholder={dic.inputs.enter_name}
                           value={values.names}
                           errorMessage={
                              errors?.find(
                                 error => error.path.at(0) === 'names',
                              )?.message
                           }
                           onChange={val => {
                              if (onlyLettersRegex.test(val) || val === '') {
                                 changeValue('names', val);
                              }
                           }}
                        />
                        <TextField
                           label={dic.texts.users.last_names}
                           placeholder={dic.inputs.enter_last_names}
                           value={values.last_names}
                           errorMessage={
                              errors?.find(
                                 error => error.path.at(0) === 'last_names',
                              )?.message
                           }
                           onChange={val => {
                              if (onlyLettersRegex.test(val) || val === '') {
                                 changeValue('last_names', val);
                              }
                           }}
                        />
                        <DatePicker
                           label={dic.texts.users.birth_date}
                           minValue={(() =>
                              new CalendarDate(
                                 1900,
                                 todayDate.month,
                                 todayDate.day,
                              ))()}
                           maxValue={todayDate}
                           defaultValue={todayDate}
                           errorMessage={
                              errors?.find(
                                 error => error.path.at(0) === 'birth_date',
                              )?.message
                           }
                           onChange={val => {
                              changeValue('birth_date', val.toDate(timezone));
                           }}
                        />
                        <TextField
                           label={dic.texts.users.email}
                           placeholder={dic.inputs.enter_email}
                           type="email"
                           value={values.email}
                           errorMessage={
                              errors?.find(
                                 error => error.path.at(0) === 'email',
                              )?.message
                           }
                           onChange={val => changeValue('email', val)}
                        />
                        <TextField
                           label={dic.texts.users.phone}
                           placeholder={dic.inputs.enter_phone}
                           value={values.phone}
                           errorMessage={
                              errors?.find(error => error.path[0] === 'phone')
                                 ?.message
                           }
                           onChange={val => {
                              if (onlyNumbersRegex.test(val) || val === '') {
                                 changeValue('phone', val);
                              }
                           }}
                        />
                        <ComboBox
                           label={dic.texts.users.sex}
                           placeholder={dic.inputs.select_sex}
                           selectedKey={values.genre.toString()}
                           errorMessage={
                              errors?.find(error => error.path[0] === 'genre')
                                 ?.message
                           }
                           onSelectionChange={val => {
                              val &&
                                 changeValue('genre', val.toString() as Genre);
                           }}
                        >
                           {(['FEMALE', 'MALE', 'OTHER'] as const).map(
                              genre => (
                                 <Item
                                    key={genre}
                                    textValue={translateGenre(genre, dic)}
                                 >
                                    <div className="px-4 py-3 hover:bg-primary-100">
                                       {translateGenre(genre, dic)}
                                    </div>
                                 </Item>
                              ),
                           )}
                        </ComboBox>
                        <ComboBox
                           label={dic.texts.users.nationality}
                           placeholder={dic.inputs.enter_nationality}
                           selectedKey={values.nationality.toString()}
                           errorMessage={
                              errors?.find(
                                 error => error.path[0] === 'nationality',
                              )?.message
                           }
                           onSelectionChange={val => {
                              val && changeValue('nationality', val.toString());
                           }}
                        >
                           {nationalities.map(nationality => (
                              <Item
                                 key={nationality.id}
                                 textValue={nationality.display_name}
                              >
                                 <div className="px-4 py-3 hover:bg-primary-100">
                                    {nationality.display_name}
                                 </div>
                              </Item>
                           ))}
                        </ComboBox>
                        <ComboBox
                           label={dic.texts.users.residence_country}
                           placeholder={dic.inputs.select_country}
                           selectedKey={values.residence_country.toString()}
                           errorMessage={
                              errors?.find(
                                 error => error.path[0] === 'residence_country',
                              )?.message
                           }
                           onSelectionChange={val => {
                              val &&
                                 changeValue(
                                    'residence_country',
                                    val.toString(),
                                 );
                           }}
                        >
                           {countries.map(country => (
                              <Item
                                 key={country.id}
                                 textValue={country.display_name}
                              >
                                 <div className="px-4 py-3 hover:bg-primary-100">
                                    {country.display_name}
                                 </div>
                              </Item>
                           ))}
                        </ComboBox>
                        <ComboBox
                           isDisabled={!values.residence_country}
                           label={dic.texts.users.identification_type}
                           placeholder={dic.inputs.select_type}
                           selectedKey={values.identification_type.toString()}
                           errorMessage={
                              errors?.find(
                                 error =>
                                    error.path[0] === 'identification_type',
                              )?.message
                           }
                           onSelectionChange={val => {
                              val &&
                                 changeValue(
                                    'identification_type',
                                    val.toString(),
                                 );
                           }}
                        >
                           {identification_types
                              .filter(
                                 ({ parent_catalog_id }) =>
                                    parent_catalog_id.toString() ===
                                    values.residence_country,
                              )
                              .map(identificationType => (
                                 <Item
                                    key={identificationType.id}
                                    textValue={identificationType.display_name}
                                 >
                                    <div className="px-4 py-3 hover:bg-primary-100">
                                       {identificationType.display_name}
                                    </div>
                                 </Item>
                              ))}
                        </ComboBox>
                        <TextField
                           label={dic.texts.users.identification_number}
                           placeholder={dic.inputs.enter_number}
                           value={values.identification}
                           errorMessage={
                              errors?.find(
                                 error => error.path[0] === 'identification',
                              )?.message
                           }
                           onChange={val => changeValue('identification', val)}
                        />
                        <ComboBox
                           isDisabled={!values.residence_country}
                           label={dic.texts.users.residence_city}
                           placeholder={dic.inputs.select_city}
                           selectedKey={values.residence_city.toString()}
                           errorMessage={
                              errors?.find(
                                 error => error.path[0] === 'residence_city',
                              )?.message
                           }
                           onSelectionChange={val => {
                              val &&
                                 changeValue('residence_city', val.toString());
                           }}
                        >
                           {cities
                              .filter(
                                 ({ parent_catalog_id }) =>
                                    parent_catalog_id.toString() ===
                                    values.residence_country,
                              )
                              .sort(({ name: a }, { name: b }) =>
                                 a.localeCompare(b),
                              )
                              .map(city => (
                                 <Item
                                    key={city.id}
                                    textValue={city.display_name}
                                 >
                                    <div className="px-4 py-3 hover:bg-primary-100">
                                       {city.display_name}
                                    </div>
                                 </Item>
                              ))}
                        </ComboBox>
                        <TextField
                           label={dic.texts.users.address}
                           placeholder={dic.inputs.enter_address}
                           value={values.address}
                           errorMessage={
                              errors?.find(error => error.path[0] === 'address')
                                 ?.message
                           }
                           onChange={val => changeValue('address', val)}
                        />
                        <Checkbox
                           className="md:col-span-2 lg:text-base"
                           isSelected={termsAgree}
                           onChange={setTermsAgree}
                        >
                           <span className="font-normal text-black">
                              {dic.pages.auth.sign_up.agree_policies}
                           </span>
                        </Checkbox>
                     </div>
                  </div>
               </div>
               <div className="sticky bottom-0 grid gap-5 bg-white py-5 lg:relative lg:py-0">
                  {creationError && (
                     <div className="w-full flex-none text-center text-error lg:text-end">
                        {creationError}
                     </div>
                  )}
                  <div className="gap-5 lg:flex lg:justify-end">
                     <Button
                        variant={Variant.secondary}
                        className="hidden w-max lg:flex lg:!px-24"
                        href={clinicRoutes(clinic.slug).login}
                     >
                        Atrás
                     </Button>
                     <Button
                        onPress={() => {
                           setErrors(undefined);
                           const valuesParsing = valuesSchema.safeParse(values);
                           valuesParsing.success
                              ? send()
                              : setErrors(valuesParsing.error.errors);
                        }}
                        isDisabled={!termsAgree || isLoading}
                        className="flex items-center justify-center gap-2 lg:w-max lg:!px-24"
                     >
                        {isLoading ? (
                           <>
                              Cargando...
                              <RefreshRoundedIcon className="animate-spin" />
                           </>
                        ) : (
                           dic.texts.flows.sign_up
                        )}
                     </Button>
                  </div>
               </div>
            </div>
         ) : (
            <MessageView email={values.email} />
         )}
      </div>
   );
}

interface IMessageView {
   email: string;
}

const mailSchema = z.string().email();

function MessageView({ email }: IMessageView) {
   const dic = useDictionary();

   const clinic = useAppSelector(store => store.clinic);

   const [sendingCode, setSendingCode] = useState(false);
   const [activationError, setActivationError] = useState<string>();

   const [timer, setTimer] = useState<number>();

   function beginTimer() {
      let seconds = 0;
      setTimer(seconds);

      const interval = setInterval(async () => {
         const returnIntervalAndStop = () => {
            clearInterval(interval);
            return undefined;
         };
         setTimer(() => (seconds === 60 ? returnIntervalAndStop() : seconds));
         seconds++;
      }, 1000);
   }
   async function resendCode() {
      if (sendingCode || timer !== undefined) return;

      setActivationError(undefined);

      const parsing = mailSchema.safeParse(email);

      if (!parsing.success) {
         setActivationError(invalidEmailMessage);
         return;
      }

      setSendingCode(true);

      try {
         await resendVerificationCode(email, clinic.slug);
         beginTimer();
      } catch (error) {
         setActivationError(
            translateError(error as IAmplifyError, 'activate-account'),
         );
      }
      setSendingCode(false);
   }

   return (
      <div className="grid h-full grid-rows-[auto_1fr_auto]">
         <div className="relative aspect-video w-36">
            <Image
               alt="clinic logo"
               src={clinic.profile_picture_url}
               className="object-contain object-center"
               fill
            />
         </div>
         <div className="flex flex-col items-start justify-center gap-5 text-on-background-text">
            <div className="relative aspect-square h-max w-full max-w-[12rem] self-center lg:hidden">
               <Image
                  alt="send image icon"
                  src="/email_sent_image.png"
                  className="object-contain object-center"
                  fill
               />
            </div>
            <h1 className="text-center text-xl font-semibold text-black">
               {dic.pages.auth.sign_up.success_view.title}
            </h1>
            <p>{dic.pages.auth.sign_up.success_view.description_1}</p>
            <p>{dic.pages.auth.sign_up.success_view.description_2}</p>
         </div>
         <div className="grid gap-7">
            {activationError && (
               <div className="w-full text-start text-error">
                  {activationError}
               </div>
            )}
            <Button
               isDisabled={sendingCode || timer !== undefined}
               onPress={resendCode}
            >
               {timer !== undefined
                  ? `${
                       dic.pages.auth.sign_up.success_view
                          .you_can_resend_the_code
                    } ${60 - timer} ${dic.texts.attributes.seconds}.`
                  : dic.pages.auth.sign_up.success_view.resend_code}
            </Button>
            <p className="text-center font-semibold text-on-background-text">
               {dic.pages.auth.sign_up.success_view.go_back_to}{' '}
               <Link
                  className="inline text-secondary"
                  href={clinicRoutes(clinic.slug).login}
               >
                  {dic.texts.flows.login?.toLowerCase()}
               </Link>
            </p>
         </div>
      </div>
   );
}
