import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservation } from 'pages/remotes';

type CreateReservationPayload = {
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

type CreateReservationCallbacks = {
  onSuccess?: (data: { ok: boolean; reservation?: unknown; code?: string; message?: string }, variables: CreateReservationPayload) => void;
  onError?: (error: unknown, variables: CreateReservationPayload) => void;
};

export function useCreateReservation(callbacks: CreateReservationCallbacks = {}) {
  const queryClient = useQueryClient();

  return useMutation((data: CreateReservationPayload) => createReservation(data), {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['reservations', variables.date]);
      queryClient.invalidateQueries(['myReservations']);
      callbacks.onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      callbacks.onError?.(error, variables);
    },
  });
}
