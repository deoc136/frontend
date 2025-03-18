import axios, { AxiosError } from 'axios';

// Force production API URL
export const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
console.log('[AXIOS-CONFIG] apiUrl defined as:', apiUrl);

export enum Side {
  client,
  server,
}

export function applyAxiosConfig(side: Side) {
  console.log(`[AXIOS-CONFIG] Applying axios config on ${side === Side.client ? 'CLIENT' : 'SERVER'} side`);
  console.log(`[AXIOS-CONFIG] Setting baseURL to: ${apiUrl}`);
  axios.defaults.baseURL = apiUrl;

  // Debug current axios instance configuration
  console.log('[AXIOS-CONFIG] Current axios defaults:', {
    baseURL: axios.defaults.baseURL,
    timeout: axios.defaults.timeout || 'not set',
    withCredentials: axios.defaults.withCredentials || false
  });

  axios.interceptors.request.use(
    request => {
      try {
        console.log(`[AXIOS-CONFIG] Request interceptor - URL: ${request.url}`);
        
        // Sólo aplicamos lógica específica si es necesario en cada lado (client/server)
        if (side === Side.server) {
          // Si estás en el servidor, podrías necesitar configurar headers especiales
          request.headers['security_string'] = process.env.SECURITY_STRING || '';
        }
      } catch (error) {
        console.error('[AXIOS-CONFIG] Error in request interceptor:', error);
      }

      return request;
    },
    error => {
      // Manejo de errores de la solicitud
      console.error('[AXIOS-CONFIG] Error in request:', error);
      return Promise.reject(error);
    }
  );

  // Comment: We can't directly reset interceptors, but we can eject and re-add them if needed
  
  axios.interceptors.response.use(
    response => {
      console.log(`[AXIOS-CONFIG] Response success - URL: ${response.config.url}, Status: ${response.status}`);
      return response;
    },
    async function (error: AxiosError) {
      console.error(`[AXIOS-CONFIG] Response error - URL: ${error.config?.url}, Status: ${error.response?.status}, Message: ${error.message}`);

      // Manejo de errores de la respuesta
      if (error.response?.status === 401) {
        // Si necesitas hacer algo especial para un 401 (no autorizado), maneja aquí
        console.warn('[AXIOS-CONFIG] Unauthorized access detected');
      }

      return Promise.reject(error);
    }
  );
  
  console.log('[AXIOS-CONFIG] Configuration completed');
}