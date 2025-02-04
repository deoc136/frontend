import axios, { AxiosError } from 'axios';

// Force production API URL
export const apiUrl = process.env.NEXT_PUBLIC_API_URL ;//https://api.esteticadcc.com/ or http://localhost:5000/

export enum Side {
  client,
  server,
}

export function applyAxiosConfig(side: Side) {
  axios.defaults.baseURL = apiUrl;
  console.log('Axios configured with baseURL:', apiUrl);

  axios.interceptors.request.use(
    request => {
      try {
        // Sólo aplicamos lógica específica si es necesario en cada lado (client/server)
        if (side === Side.server) {
          // Si estás en el servidor, podrías necesitar configurar headers especiales
          request.headers['security_string'] = process.env.SECURITY_STRING || '';
        }
      } catch (error) {
        console.error('Error al configurar el interceptor de solicitud de Axios:', error);
      }

      return request;
    },
    error => {
      // Manejo de errores de la solicitud
      console.error('Error en la solicitud:', error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => response,
    async function (error: AxiosError) {
      console.error('Error en la respuesta:', error);

      // Manejo de errores de la respuesta
      if (error.response?.status === 401) {
        // Si necesitas hacer algo especial para un 401 (no autorizado), maneja aquí
        // console.warn('Acceso no autorizado, maneja el caso aquí.');
      }

      return Promise.reject(error);
    }
  );
}