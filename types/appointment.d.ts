export type AppointmentState = 'TO_PAY'  | 'PENDING' | 'CANCELED' | 'CLOSED';

export type PaymentMethod = 'ONLINE' | 'CASH' | 'CARD';

export type AppointmentAssistance = 'ATTENDED' | 'MISSED';

export interface Appointment {
   id: number;
   service_id: number;
   price: string;
   state: AppointmentState;
   date: string;
   hour: number;
   minute: number;
   patient_id: number;
   therapist_id: number;
   hidden: boolean;
   payment_method: PaymentMethod;
   assistance?: AppointmentAssistance;
   from_package: boolean;
   order_id: string;
   invoice_id: string;
   creation_date: string;
}

export interface AppointmentWithRating extends Appointment {
   ratings: number;
}

export interface NewAppointment {
   id?: number;
   service_id: number;
   price: string;
   state: AppointmentState;
   date: string;
   hour: number;
   minute: number;
   patient_id: number;
   hidden?: boolean;
   payment_method: PaymentMethod;
   assistance?: AppointmentAssistance;
   from_package?: boolean;
   order_id?: string;
   invoice_id?: string;
   creation_date: string;
   doctor_id: number;
}

export interface AppointmentWithNames {
   appointment: {
      id: number;
      service_id: number;
      price: string;
      state: AppointmentState;
      date: string;
      hour: number;
      minute: number;
      patient_id: number;
      therapist_id: number;
      hidden: boolean;
      payment_method: PaymentMethod;
      assistance?: AppointmentAssistance;
      from_package: boolean;
      order_id: string;
      invoice_id: string;
      creation_date: string;
   };
   data: {
      patient_names: string;
      patient_last_names: string;
      therapist_names: string;
      therapist_last_names: string;
      patient_phone: string;
      service_name: string;
   };
}

export interface AppointmentWithNamesAndRating {
   appointment: AppointmentWithRating;
   data: Data;
}

export interface Data {
   patient_names: string;
   patient_last_names: string;
   therapist_names: string;
   therapist_last_names: string;
   patient_phone: string;
   service_name: string;
}
