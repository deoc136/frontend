'use client';

import Button, { Variant } from '@/app/components/shared/Button';
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux-hooks';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Image from 'next/image';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import { usePathname, useRouter } from 'next/navigation';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useEffect, useRef, useState } from 'react';
import { Select } from '@/app/components/inputs/Select';
import { GlobalRoute, clinicRoutes } from '@/lib/routes';
import { Item } from '@react-stately/collections';
import PatientMobileSidebar from './PatientMobileSidebar';
//import LoginModal from './LoginModal';
//import PatientMobileSidebar from './PatientMobileSidebar';//To FIX
import Card from '@/app/components/shared/cards/Card';
//import SignOutButton from '@/components/sidebar/SignOutButton';
import { useMediaQuery } from '@mui/material';
import PopoverTrigger from '@/app/components/shared/PopoverTrigger';
import Dialog from '@/app/components/modal/Dialog';
import useDictionary from '@/lib/hooks/useDictionary';
import logo from '@/public/logodcc.svg';
import {
   DictionaryKey,
   setLanguage,
} from '@/lib/features/language/language_slice';

enum Route {
   services,
   appointments,
   other,
   completeAccount,
   profile,
}

const bannerImages = [
   'https://appdccimages.s3.amazonaws.com/Banner/BANNER_WEB_DR_CARLOS_CARVAJAL_CAPILAR.jpg',
   'https://appdccimages.s3.amazonaws.com/Banner/BANNER_WEB_DR_CARLOS_CARVAJAL_CORPORAL.jpg'
];



export default function PatientHeader() {
   const dic = useDictionary();

   const { languages, language } = useAppSelector(store => store.language);

   const dispatch = useAppDispatch();

   const router = useRouter();
   const pathname = usePathname();

   const { goBackRoute, value } = useAppSelector(store => store.title);

   const typeCondition = (() => {
      switch (pathname) {
         case clinicRoutes().patient_complete_account:
            return Route.completeAccount;

         case clinicRoutes().patient_services:
            return Route.services;

         case "/":
            return Route.services;

         case clinicRoutes().patient_appointments_actives:
            return Route.services;

         case clinicRoutes().patient_appointments_history:
            return Route.services;

         case clinicRoutes().patient_profile_clinic_history:
            return Route.profile;

         case clinicRoutes().patient_profile_personal_data:
            return Route.profile;

         case clinicRoutes().patient_profile_personal_data_edit:
            return Route.profile;

         case clinicRoutes().patient_profile_forms:
            return Route.profile;

         default:
            return Route.appointments;
      }
   })();


   const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

   const [hasBg, setHasBg] = useState(false);
   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

   useEffect(() => {

      setIsSideMenuOpen(false);

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pathname]);
   useEffect(() => {
      setHasBg(
         typeCondition === Route.services ||
            typeCondition === Route.completeAccount ||
            typeCondition === Route.profile,
      );
   }, [typeCondition]);

   const handlePrevBanner = () => {
      setCurrentBannerIndex((prevIndex) =>
         prevIndex === 0 ? bannerImages.length - 1 : prevIndex - 1
      );
   };

   const handleNextBanner = () => {
      setCurrentBannerIndex((prevIndex) =>
         prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
   };
    // Auto transition every 5 seconds
    useEffect(() => {
      const interval = setInterval(() => {
         handleNextBanner();
      }, 5000); // 5 seconds

      // Clean up interval on unmount
      return () => clearInterval(interval);
   }, []);

   const title = value.split('/').at(-1);
   return (
      <>
      
         <PatientMobileSidebar
            setIsOpen={setIsSideMenuOpen}
            isOpen={isSideMenuOpen}
         />
         
         <header className="sticky top-0 z-10 flex w-full grid-cols-4 items-center justify-between bg-foundation shadow lg:grid-cols-2">
            <div className="lg:hidden ml-4">
               <Button
                  aria-label="menu button"
                  className="w-max bg-transparent !p-0 !text-on-background-light"
                  onPress={() => setIsSideMenuOpen(true)}
               >
                  <MenuRoundedIcon />
               </Button>
            </div>
            <div className="relative aspect-[30/18]  lg:aspect-[30/22] w-48 max-w-[145px] justify-self-end lg:w-48 lg:justify-self-center">
               <Image
                  alt="clinic logo"
                  src={logo}
                  fill
                  quality={90} 
                  className="lg:ml-14 object-contain lg:scale-[1.1]"
               />
            </div>
            <div className="flex items-center gap-5">
               <Select
                  className="!bg-light-gray-background !fill-black !text-black"
                  selectedKey={language}
                  onSelectionChange={key =>
                     dispatch(setLanguage(key as DictionaryKey))
                  }
               >
                  {languages.map(({ name, key }) => (
                     <Item key={key} textValue={name}>
                        <div className="w-max px-8 py-3">{name}</div>
                     </Item>
                  ))}
               </Select>
               <Select
                  className={`hidden rounded-none bg-transparent !py-3 font-normal !text-on-background-text !shadow-none lg:flex ${
                     typeCondition === Route.appointments &&
                     'border-b-4 border-secondary font-semibold !text-secondary'
                  }`}
                  triggerContent={dic.texts.appointments.my_appointments}
                  onSelectionChange={val => {
                     if (!val) return;
                     console.log('Selected route:', val.toString());
                     router.push(val.toString());
                  }}
                  selectedKey={pathname}
               >
                  <Item
                     key={clinicRoutes().patient_appointments_actives}
                     textValue={dic.texts.appointments.active_appointments}
                  >
                     <div className="w-max px-8 py-3">
                        {dic.texts.appointments.active_appointments}
                     </div>
                  </Item>
                  <Item
                     key={clinicRoutes().patient_appointments_history}
                     textValue={dic.texts.appointments.appointments_history}
                  >
                     <div className="w-max px-8 py-3">
                        {dic.texts.appointments.appointments_history}
                     </div>
                  </Item>
               </Select>
               <Button
                  className={`mr-24 hidden !h-full w-max rounded-none bg-transparent !py-3 font-normal !text-on-background-text !shadow-none lg:block`}
                  href={clinicRoutes().patient_services}
               >
                  {dic.texts.services.services}
               </Button>
            </div>
         </header>


         {hasBg && (
                     <>         
                     <div className="relative w-auto h-56 lg:h-[620px] overflow-hidden my-5 lg:px-50 lg:m-8 lg:mx-4 flex items-center justify-between">
                     {/* Left Arrow */}
                     <button
                     onClick={handlePrevBanner}
                     className="hidden md:flex bg-black bg-opacity-50 text-white p-0.5 lg:p-4 rounded-full mx-0.5 lg:mx-2"
                  >
                     &#9664;
                  </button>
                  
                     {/* Banner Image */}
                     <div className="relative w-full h-full transition-all duration-800 ease-in-out my-12 lg:my-4 lg:mx-10">
                        <Image
                           src={bannerImages[currentBannerIndex]}
                           alt="Banner"
                           fill
                           quality={90} 
                           className="object-cover rounded-lg"
                        />
                     </div>
                  
                     {/* Right Arrow */}
                     <button
                        onClick={handleNextBanner}
                        className="hidden md:flex bg-black bg-opacity-50 text-white p-0.5 lg:p-4 rounded-full mx-0.5 lg:mx-2"
                     >
                        &#9654;
                     </button>
                           </div>

                     </>
                  )}

         <div
            id="patient-navbar"
            className={`relative w-full bg-cover bg-right bg-no-repeat px-5 py-1 transition-all lg:px-12 lg:py-5 ${
               hasBg ? 'bg-primary bg-waves' : 'bg-primary-200'
            }`}
         >
            <div className="flex flex-wrap items-center gap-5">
               <p className="w-full text-xs lg:text-sm">
                  {!hasBg && (
                     <>
                        {title?.length ? value.replace(title, '') : true}{' '}
                        <span className="font-semibold text-secondary">
                           {title}
                        </span>
                     </>
                  )}
               </p>
               {typeof goBackRoute === 'string' && !hasBg && (
                  <Button
                     className="flex aspect-square !w-6 items-center justify-center !rounded-full bg-white !p-0 !text-black lg:!w-8"
                     href={goBackRoute}
                  >
                     <ArrowBackRoundedIcon className="text-xl lg:text-2xl" />
                  </Button>
               )}
               {value.length && !hasBg ? (
                  <h3 className="text-xl lg:text-2xl">{title?.trim()}</h3>
               ) : (
                  true
               )}
            </div>
         </div>
         <div id="aux-container" className="h-max" />
      </>
   );
}

