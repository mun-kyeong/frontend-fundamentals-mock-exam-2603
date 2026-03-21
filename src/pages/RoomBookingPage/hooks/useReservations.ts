import { useQuery } from '@tanstack/react-query';
import { getReservations } from 'pages/remotes';

export function useReservations(date: string) {
  return useQuery(['reservations', date], () => getReservations(date), { enabled: !!date });
}
