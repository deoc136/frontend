'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/redux-hooks';
import { changeTitle } from '@/lib/features/title/title_slice';
import useDictionary from '@/lib/hooks/useDictionary';

// Definiciones como constante fuera del componente
const definitions = [
  {
    term: 'Base de datos',
    definition: 'Conjunto organizado de datos personales que sea objeto de tratamiento.'
  },
  {
    term: 'Dato personal',
    definition: 'Cualquier información vinculada o que pueda asociarse a una o varias personas naturales determinadas o determinables.'
  },
  {
    term: 'Dato sensible',
    definition: 'Información que afecta la intimidad de las personas o cuyo uso indebido puede generar discriminación.'
  },
  {
    term: 'Encargado del Tratamiento',
    definition: 'Persona natural o jurídica, pública o privada, que por sí misma o en asocio con otros, realice el tratamiento de datos personales por cuenta del responsable del tratamiento.'
  },
  {
    term: 'Responsable del Tratamiento',
    definition: 'Persona natural o jurídica, pública o privada, que decide sobre la base de datos y/o el tratamiento de los datos.'
  },
  {
    term: 'Titular',
    definition: 'Persona natural cuyos datos personales sean objeto de tratamiento.'
  },
  {
    term: 'Tratamiento',
    definition: 'Cualquier operación sobre datos personales, como recolección, almacenamiento, uso, circulación o supresión.'
  },
  {
    term: 'Transferencia',
    definition: 'Cuando el responsable y/o encargado envía los datos a un receptor que es responsable del tratamiento.'
  },
  {
    term: 'Transmisión',
    definition: 'Comunicación de datos a un encargado para su tratamiento por cuenta del responsable, dentro o fuera de Colombia.'
  }
];

export default function DataPolicyPage() {
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
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
      <div className="space-y-6">

        {/* Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold">POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES – DOCTOR CARLOS ENRIQUE CARVAJAL NIETO</h2>
          <p className="text-sm mt-2">DE CONFORMIDAD CON LA LEY 1581 DEL AÑO 2012 Y SUS DECRETOS REGLAMENTARIOS</p>
        </div>

        {/* Sections */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">1. ALCANCE</h3>
          <p className="text-justify">
            La Política de Tratamiento y Protección de Datos Personales presentada a continuación, se aplicará a todas las bases de datos y/o archivos que contengan datos personales y que sean objeto de tratamiento por parte del Dr. CARLOS ENRIQUE CARVAJAL NIETO, considerado como responsable y/o encargado del tratamiento de los datos personales recaudados.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">DEFINICIONES</h3>
          <ul className="list-disc pl-6 space-y-2">
            {definitions.map((def, index) => (
              <li key={index}>
                <span className="font-semibold">{def.term}:</span> {def.definition}
              </li>
            ))}
          </ul>
        </section>

        {/* More sections... */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">2. RECOLECCIÓN DE LA INFORMACIÓN</h3>
          <div className="space-y-4">
            <p className="text-justify">
              Los empleados, directivos o socios del Dr. CARLOS ENRIQUE CARVAJAL NIETO que, en desarrollo de las
              actividades legales, contractuales, comerciales y/o de cualquier otra que surja, requieran una recolección de datos, se
              limitarán a solicitar aquellos datos personales que son estrictamente pertinentes y adecuados para la prestación del servicio
              ofrecido, igualmente no harán uso de medios engañosos o fraudulentos para recolectar y realizar tratamiento de datos personales.
            </p>
            <p className="text-justify">
              Con el fin de garantizar el derecho a la información y la debida autorización de parte de los titulares, todos los formatos
              de recolección y material de apoyo de las diferentes actividades desarrolladas por el Dr. CARLOS ENRIQUE
              CARVAJAL NIETO contendrán inscripciones sobre aceptación de tratamiento de datos personales, los cuales deberán ser
              explicados a los titulares; y de ser necesario, en razón de la actividad que se pretenda desarrollar, se suscribirá un documento de
              aceptación de tratamiento de datos acorde con lo establecido por la legislación vigente.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">3. DEBERES DE EL Dr. CARLOS ENRIQUE CARVAJAL NIETO</h3>
          <div className="space-y-4">
            <p className="text-justify">
              De acuerdo con las definiciones legales y propias de esta política empresarial de tratamiento de datos, el Dr. CARLOS ENRIQUE CARVAJAL NIETO, quien actuará como RESPONSABLE DEL TRATAMIENTO DE DATOS PERSONALES y cumplirá
              con los siguientes deberes:
            </p>
            <p className="text-justify">
              Garantizar al titular, de manera permanente, el pleno y efectivo ejercicio del derecho de Hábeas Data; entendiendo por este el derecho a conocer, actualizar rectificar y suprimir, la información que sobre él reposa en las bases de datos personales que son administradas por el encargado de tratamiento.
            </p>
            <ol className="pl-12 space-y-2">
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">i.</span>
                <span>Conservar la información bajo las condiciones de seguridad necesarias para impedir su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">ii.</span>
                <span>Realizar oportunamente la actualización, rectificación o supresión de los datos en los términos de la ley.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">iii.</span>
                <span>Actualizar la información reportada por los responsables del tratamiento dentro de los cinco (5) días hábiles contados a partir de su recibo.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">iv.</span>
                <span>Tramitar las consultas y los reclamos formulados por los titulares en los términos señalados en la ley.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">v.</span>
                <span>Adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la ley y en especial, para la atención de consultas y reclamos por parte de los titulares.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">vi.</span>
                <span>Registrar en la base de datos las leyendas &ldquo;reclamo en trámite&rdquo; en la forma en que se regula en la ley.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">vii.</span>
                <span>Insertar en la base de datos la leyenda &ldquo;información en discusión judicial&rdquo; una vez notificado por parte de la autoridad competente sobre procesos judiciales relacionados con la calidad del dato personal.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">viii.</span>
                <span>Abstenerse de circular información que esté siendo controvertida por el titular y cuyo bloqueo haya sido ordenado por la Superintendencia de Industria y Comercio.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">ix.</span>
                <span>Permitir el acceso a la información únicamente a las personas que pueden tener acceso a ella.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">x.</span>
                <span>Informar a la Superintendencia de Industria y Comercio cuando se les presenten violaciones a los códigos de seguridad y existan riesgos en la administración de la información de los titulares.</span>
              </li>
              <li className="flex gap-4 text-justify">
                <span className="font-semibold min-w-[1.5rem]">xi.</span>
                <span>Cumplir las instrucciones y requerimientos que imparta la Superintendencia de Industria y Comercio.</span>
              </li>
            </ol>
          </div>
        </section>

        {/* Derechos Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">4. DERECHOS DEL TITULAR DE DATOS</h3>
          <p className="text-justify">Son derechos del titular de los datos, los siguientes:</p>
          <ol className="pl-12 space-y-2">
            <li className="flex gap-4 text-justify">
              <span className="font-semibold min-w-[1.5rem]">i.</span>
              <span>Acceder, conocer, rectificar y actualizar sus datos personales; este derecho será conocido con el nombre de Hábeas Data.</span>
            </li>
            <li className="flex gap-4 text-justify">
              <span className="font-semibold min-w-[1.5rem]">ii.</span>
              <span>Solicitar prueba de la autorización otorgada para el tratamiento de sus datos.</span>
            </li>
            <li className="flex gap-4 text-justify">
              <span className="font-semibold min-w-[1.5rem]">iii.</span>
              <span>Recibir información respecto al uso que se le ha dado a sus datos personales.</span>
            </li>
            <li className="flex gap-4 text-justify">
              <span className="font-semibold min-w-[1.5rem]">iv.</span>
              <span>Acudir ante las autoridades, en especial ante la Superintendencia de Industria y Comercio, y presentar quejas por infracciones a lo dispuesto en la normatividad vigente y en el presente documento.</span>
            </li>
            <li className="flex gap-4 text-justify">
              <span className="font-semibold min-w-[1.5rem]">v.</span>
              <span>Modificar y revocar la autorización y/o solicitar la supresión del dato personal.</span>
            </li>
            <li className="flex gap-4 text-justify">
              <span className="font-semibold min-w-[1.5rem]">vi.</span>
              <span>Ejercer estos derechos personalmente en Carrera 48 # 19a-40 Cons. 1406, Medellín, Antioquia.</span>
            </li>
          </ol>
        </section>

        {/* Vigencia Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold">5. VIGENCIA</h3>
          <div className="space-y-4">
            <p className="text-justify">
            La presente política de tratamiento de la información personal tendrá vigencia a partir del 01 de junio de 2024 y hasta que se mantengan las finalidades que justifican su tratamiento. 
            </p>
            <p className="text-justify">
            Los cambios o modificaciones sustanciales que se incorporen en la presente política serán comunicados al titular con mínimo diez(10) días de antelación a su implementación. La notificación de los cambios se hará a través de los medios de comunicación idóneos.
            </p>
          </div>
        </section>

        {/* Add remaining sections similarly */}
      </div>
    </div>
  );
}