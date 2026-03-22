import { useEffect } from 'react';

type LocationState = { message?: string; date?: string } | null;
type MessageState = { type: 'success' | 'error'; text: string } | null;

type UseReservationStatusLocationParams = {
  locationState: LocationState;
  setDate: (date: string) => void;
};

export function useReservationStatusLocation({ locationState, setDate }: UseReservationStatusLocationParams) {
  const initialMessage: MessageState = locationState?.message
    ? { type: 'success', text: locationState.message }
    : null;

  useEffect(() => {
    if (locationState?.message || locationState?.date) {
      window.history.replaceState({}, '');
    }
  }, [locationState?.message, locationState?.date]);

  useEffect(() => {
    if (locationState?.date) {
      setDate(locationState.date);
    }
  }, [locationState?.date, setDate]);

  return { initialMessage };
}
