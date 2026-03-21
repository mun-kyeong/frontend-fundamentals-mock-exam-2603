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

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation((data: CreateReservationPayload) => createReservation(data), {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(['reservations', variables.date]);
      queryClient.invalidateQueries(['myReservations']);
    },
  });
}
