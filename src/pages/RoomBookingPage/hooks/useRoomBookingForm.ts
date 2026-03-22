import type { Equipment } from '_tosslib/server/types';
import { useSearchParams } from 'react-router-dom';
import { type FieldErrors, type Resolver, useForm, useWatch } from 'react-hook-form';
import { formatDate } from '../../../shared/utils/date.utils';

type FormValues = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: string;
};

const formResolver: Resolver<FormValues> = values => {
  const errors: FieldErrors<FormValues> = {};
  const hasTimeInputs = values.startTime !== '' && values.endTime !== '';

  if (hasTimeInputs && values.endTime <= values.startTime) {
    errors.endTime = { type: 'validate', message: '종료 시간은 시작 시간보다 늦어야 합니다.' };
  }

  if (hasTimeInputs && values.attendees < 1) {
    errors.attendees = { type: 'validate', message: '참석 인원은 1명 이상이어야 합니다.' };
  }

  const hasErrors = Object.keys(errors).length > 0;
  return {
    values: hasErrors ? {} : values,
    errors,
  };
};

export function useRoomBookingForm() {
  const [searchParams] = useSearchParams();

  const defaultValues: FormValues = {
    date: searchParams.get('date') || formatDate(new Date()),
    startTime: searchParams.get('startTime') || '',
    endTime: searchParams.get('endTime') || '',
    attendees: Number(searchParams.get('attendees')) || 1,
    equipment: searchParams.get('equipment')
      ? (searchParams.get('equipment')!.split(',').filter(Boolean) as Equipment[])
      : [],
    preferredFloor: searchParams.get('floor') || '',
  };

  const formMethods = useForm<FormValues>({
    defaultValues,
    resolver: formResolver,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const watchedValues = useWatch<FormValues>({ control: formMethods.control, defaultValue: defaultValues });
  const formValues: FormValues = {
    ...defaultValues,
    ...(watchedValues ?? {}),
  };

  return {
    formMethods,
    formValues,
    defaultValues,
  };
}

export type { FormValues };
