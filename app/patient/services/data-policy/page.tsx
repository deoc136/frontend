'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { changeTitle } from '@/lib/features/title/title_slice';
import useDictionary from '@/lib/hooks/useDictionary';
import Head from 'next/head';

export default function DataPolicyPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const dic = useDictionary();
  
  useEffect(() => {
    dispatch(
      changeTitle({
        goBackRoute: null,
        value: 'Política de datos',
      }),
    );
  }, [dispatch]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5.0, user-scalable=yes" />
      </Head>

      <div className="flex flex-col min-h-screen bg-white">

        {/* Floating Download Button */}

        {/* Native PDF Viewer */}
        <div className="flex-1 w-full h-full">
          <a 
            href="https://appdccimages.s3.amazonaws.com/POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES - DR. CARLOS CARVAJAL.pdf"
            className="block w-full h-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <object
              data="https://appdccimages.s3.amazonaws.com/POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES - DR. CARLOS CARVAJAL.pdf"
              type="application/pdf"
              className="w-full h-screen"
            >
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <p className="mb-4">Haz click en el botón para descargar el PDF.</p>
                <button
                  onClick={() => setIsDownloadModalOpen(true)}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  Descargar PDF
                </button>
              </div>
            </object>
          </a>
        </div>
      </div>
    </>
  );
}