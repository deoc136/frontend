'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { changeTitle } from '@/lib/features/title/title_slice';
import useDictionary from '@/lib/hooks/useDictionary';


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
    <div className="flex flex-col h-full w-full">
      {/* Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Descargar Documento</h3>
            <p className="mb-4">¿Desea descargar la política de tratamiento de datos?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <a
                href="https://appdccimages.s3.amazonaws.com/POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES - DR. CARLOS CARVAJAL.pdf"
                download
                onClick={() => setIsDownloadModalOpen(false)}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-700 transition-colors"
              >
                Descargar
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Container */}
      <div className="relative w-full h-[calc(100vh-200px)] flex flex-col">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar PDF
          </button>
        </div>
        
        <iframe
          src="https://appdccimages.s3.amazonaws.com/POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES - DR. CARLOS CARVAJAL.pdf"
          className="w-full h-full rounded-lg shadow-lg"
          style={{
            minHeight: '500px',
            backgroundColor: '#f8f8f8'
          }}
        />
      </div>
    </div>
  );
}