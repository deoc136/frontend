import { NewRating, Rating } from '@/types/rating.d';
import axios from 'axios';

export async function getAllRatingsByAppointmentId( id: string) {
   return await axios.get<Rating[]>(`/rating/getAllByAppointmentId/${id}`, {
      
   });
}

export async function createRating(rating: NewRating) {
   return await axios.post(`/rating/create/`, rating, {
     
   });
}
