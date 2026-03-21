import { useQuery } from '@tanstack/react-query';
import { getMyReservations } from 'pages/remotes';

export function useMyReservations() {
  return useQuery(['myReservations'], getMyReservations);
}
