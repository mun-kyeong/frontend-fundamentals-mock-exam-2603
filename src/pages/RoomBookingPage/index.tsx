import { css } from '@emotion/react';
import { Border, Button, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room } from '_tosslib/server/types';
import axios from 'axios';
import { ReservationConditionsSection } from 'pages/RoomBookingPage/components/ReservationConditionsSection';
import { SelectableRoomCard } from 'pages/RoomBookingPage/components/SelectableRoomCard';
import { ValidationMessage } from 'pages/RoomBookingPage/components/ValidationMessage';
import { EQUIPMENT_LABELS } from 'pages/RoomBookingPage/constants';
import { useAvailableRooms } from 'pages/RoomBookingPage/hooks/useAvailableRooms';
import { useCreateReservation } from 'pages/RoomBookingPage/hooks/useCreateReservation';
import { useRoomBookingForm } from 'pages/RoomBookingPage/hooks/useRoomBookingForm';
import { useReservations } from 'pages/RoomBookingPage/hooks/useReservations';
import { useRooms } from 'pages/RoomBookingPage/hooks/useRooms';
import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageBanner } from '../../shared/components/MessageBanner';
import { SectionBlock } from '../../shared/components/SectionBlock';

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { formMethods, formValues } = useRoomBookingForm();
  const { formState } = formMethods;
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = formValues;

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);

  const createMutation = useCreateReservation({
    onSuccess: result => {
      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }
      setErrorMessage(result.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    },
    onError: err => {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    },
  });

  // 필터 변경 시 선택 초기화
  const resetSelectionOnFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  // 입력 검증 (RHF Resolver)
  const hasTimeInputs = startTime !== '' && endTime !== '';
  const validationMessage =
    formState.errors.endTime?.message?.toString() ?? formState.errors.attendees?.message?.toString() ?? null;
  const isFilterComplete = hasTimeInputs && !validationMessage;

  // 필터링
  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);
  const availableRooms = useAvailableRooms(rooms, reservations, {
    ...formValues,
    isFilterComplete,
  });

  const handleBook = () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }
    createMutation.mutate({
      roomId: selectedRoomId,
      date,
      start: startTime,
      end: endTime,
      attendees,
      equipment,
    });
  };

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor) params.floor = preferredFloor;
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  return (
    <div css={pageWrapperCss}>
      <div css={backButtonWrapperCss}>
        <button type="button" onClick={() => navigate('/')} aria-label="뒤로가기" css={backButtonCss}>
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={pageTitleCss}>예약하기</Top.Top03>

      {errorMessage && (
        <div css={inlineErrorContainerCss}>
          <Spacing size={12} />
          <div role="alert">
            <MessageBanner type="error" text={errorMessage} />
          </div>
        </div>
      )}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <div css={sectionPaddingCss}>
        <SectionBlock title="예약 조건">
          <FormProvider {...formMethods}>
            <ReservationConditionsSection
              floors={floors}
              equipment={equipment}
              onFilterChange={resetSelectionOnFilterChange}
            />
          </FormProvider>
        </SectionBlock>
      </div>

      {validationMessage && (
        <div css={sectionPaddingCss}>
          <Spacing size={8} />
          <ValidationMessage message={validationMessage} />
        </div>
      )}

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 가능 회의실 목록 */}
      {isFilterComplete && (
        <div css={sectionPaddingCss}>
          <SectionBlock title="예약 가능 회의실" subtitle={`${availableRooms.length}개`}>
            <Spacing size={16} />

            {availableRooms.length === 0 ? (
              <div css={availableEmptyCss}>
                <Text typography="t6" color={colors.grey500}>
                  조건에 맞는 회의실이 없습니다.
                </Text>
              </div>
            ) : (
              <div css={availableListCss}>
                {availableRooms.map((room: Room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <SelectableRoomCard
                      key={room.id}
                      room={room}
                      isSelected={isSelected}
                      onSelect={setSelectedRoomId}
                      equipmentLabels={EQUIPMENT_LABELS}
                    />
                  );
                })}
              </div>
            )}

            <Spacing size={16} />
            <Button display="full" onClick={handleBook} disabled={createMutation.isLoading}>
              {createMutation.isLoading ? '예약 중...' : '확정'}
            </Button>
          </SectionBlock>
        </div>
      )}

      <Spacing size={24} />
    </div>
  );
}

const pageWrapperCss = css`
  background: ${colors.white};
  padding-bottom: 40px;
`;

const backButtonWrapperCss = css`
  padding: 12px 24px 0;
`;

const backButtonCss = css`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  color: ${colors.grey600};
  &:hover {
    color: ${colors.grey900};
  }
`;

const pageTitleCss = css`
  padding-left: 24px;
  padding-right: 24px;
`;

const sectionPaddingCss = css`
  padding: 0 24px;
`;

const inlineErrorContainerCss = css`
  padding: 0 24px;
`;

const availableEmptyCss = css`
  padding: 40px 0;
  text-align: center;
  background: ${colors.grey50};
  border-radius: 14px;
`;

const availableListCss = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
