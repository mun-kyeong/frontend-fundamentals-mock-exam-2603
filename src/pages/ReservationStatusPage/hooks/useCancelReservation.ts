import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelReservation } from 'pages/remotes';
import type { MutationCallbacks } from 'pages/ReservationStatusPage/hooks/types';

export function useCancelReservation(callbacks: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['myReservations']);
      callbacks.onSuccess?.();
    },
    onError: () => {
      callbacks.onError?.();
    },
  });
}
