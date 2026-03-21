import { css } from '@emotion/react';
import { Border, Button, Select, Spacing, Text, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import axios from 'axios';
import { SelectableRoomCard } from 'pages/RoomBookingPage/components/SelectableRoomCard';
import { useCreateReservation } from 'pages/RoomBookingPage/hooks/useCreateReservation';
import { useReservations } from 'pages/RoomBookingPage/hooks/useReservations';
import { useRooms } from 'pages/RoomBookingPage/hooks/useRooms';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DatePicker } from '../../shared/components/DatePicker';
import { SectionBlock } from '../../shared/components/SectionBlock';
import { FieldBlock } from 'pages/RoomBookingPage/components/FieldBlock';
import { InlineErrorMessage } from 'pages/RoomBookingPage/components/InlineErrorMessage';
import { NumberInput } from 'pages/RoomBookingPage/components/NumberInput';
import { ToggleChipButton } from 'pages/RoomBookingPage/components/ToggleChipButton';
import { formatDate } from '../../shared/utils/date.utils';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

const ALL_EQUIPMENT = ['tv', 'whiteboard', 'video', 'speaker'];

const TIME_SLOTS: string[] = [];
for (let h = 9; h <= 20; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 20) {
    TIME_SLOTS.push(`${String(h).padStart(2, '0')}:30`);
  }
}

export function RoomBookingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));
  const [startTime, setStartTime] = useState(searchParams.get('startTime') || '');
  const [endTime, setEndTime] = useState(searchParams.get('endTime') || '');
  const [attendees, setAttendees] = useState(Number(searchParams.get('attendees')) || 1);
  const [equipment, setEquipment] = useState<string[]>(
    searchParams.get('equipment') ? searchParams.get('equipment')!.split(',').filter(Boolean) : []
  );
  const [preferredFloor, setPreferredFloor] = useState<number | null>(
    searchParams.get('floor') ? Number(searchParams.get('floor')) : null
  );
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    if (startTime) params.startTime = startTime;
    if (endTime) params.endTime = endTime;
    if (attendees > 1) params.attendees = String(attendees);
    if (equipment.length > 0) params.equipment = equipment.join(',');
    if (preferredFloor !== null) params.floor = String(preferredFloor);
    setSearchParams(params, { replace: true });
  }, [date, startTime, endTime, attendees, equipment, preferredFloor, setSearchParams]);

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const createMutation = useCreateReservation();

  // 필터 변경 시 선택 초기화
  const handleFilterChange = () => {
    setSelectedRoomId(null);
    setErrorMessage(null);
  };

  // 입력 검증
  let validationError: string | null = null;
  const hasTimeInputs = startTime !== '' && endTime !== '';
  if (hasTimeInputs) {
    if (endTime <= startTime) {
      validationError = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (attendees < 1) {
      validationError = '참석 인원은 1명 이상이어야 합니다.';
    }
  }
  const isFilterComplete = hasTimeInputs && !validationError;

  // 필터링
  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);

  const availableRooms = isFilterComplete
    ? rooms
        .filter((room: { id: string; capacity: number; equipment: string[]; floor: number }) => {
          if (room.capacity < attendees) return false;
          if (!equipment.every(eq => room.equipment.includes(eq))) return false;
          if (preferredFloor !== null && room.floor !== preferredFloor) return false;
          const hasConflict = reservations.some(
            (r: { roomId: string; date: string; start: string; end: string }) =>
              r.roomId === room.id && r.date === date && r.start < endTime && r.end > startTime
          );
          if (hasConflict) return false;
          return true;
        })
        .sort((a: { floor: number; name: string }, b: { floor: number; name: string }) => {
          if (a.floor !== b.floor) return a.floor - b.floor;
          return a.name.localeCompare(b.name);
        })
    : [];

  const handleBook = async () => {
    if (!selectedRoomId) {
      setErrorMessage('회의실을 선택해주세요.');
      return;
    }
    if (!startTime || !endTime) {
      setErrorMessage('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { message: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      setErrorMessage(errResult.message ?? '예약에 실패했습니다.');
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      setErrorMessage(serverMessage);
      setSelectedRoomId(null);
    }
  };

  return (
    <div css={pageWrapperCss}>
      <div css={backButtonWrapperCss}>
        <button type="button" onClick={() => navigate('/')} aria-label="뒤로가기" css={backButtonCss}>
          ← 예약 현황으로
        </button>
      </div>
      <Top.Top03 css={pageTitleCss}>예약하기</Top.Top03>

      {errorMessage && <InlineErrorMessage message={errorMessage} />}

      <Spacing size={24} />

      {/* 예약 조건 입력 */}
      <div css={sectionPaddingCss}>
        <SectionBlock title="예약 조건">
          <Spacing size={16} />

          {/* 날짜 */}
          <FieldBlock label="날짜">
            <DatePicker
              value={date}
              min={formatDate(new Date())}
              onChange={value => {
                setDate(value);
                handleFilterChange();
              }}
              ariaLabel="날짜"
            />
          </FieldBlock>
          <Spacing size={14} />

          {/* 시간 */}
          <div css={twoColumnRowCss}>
            <FieldBlock label="시작 시간" flex>
              <Select
                value={startTime}
                onChange={e => {
                  setStartTime(e.target.value);
                  handleFilterChange();
                }}
                aria-label="시작 시간"
              >
                <option value="">선택</option>
                {TIME_SLOTS.slice(0, -1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FieldBlock>
            <FieldBlock label="종료 시간" flex>
              <Select
                value={endTime}
                onChange={e => {
                  setEndTime(e.target.value);
                  handleFilterChange();
                }}
                aria-label="종료 시간"
              >
                <option value="">선택</option>
                {TIME_SLOTS.slice(1).map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FieldBlock>
          </div>
          <Spacing size={14} />

          {/* 참석 인원 + 선호 층 */}
          <div css={twoColumnRowCss}>
            <FieldBlock label="참석 인원" flex>
              <NumberInput
                value={attendees}
                min={1}
                onChange={value => {
                  setAttendees(Math.max(1, value));
                  handleFilterChange();
                }}
                ariaLabel="참석 인원"
              />
            </FieldBlock>
            <FieldBlock label="선호 층" flex>
              <Select
                value={preferredFloor ?? ''}
                onChange={e => {
                  const val = e.target.value;
                  setPreferredFloor(val === '' ? null : Number(val));
                  handleFilterChange();
                }}
                aria-label="선호 층"
              >
                <option value="">전체</option>
                {floors.map((f: number) => (
                  <option key={f} value={f}>
                    {f}층
                  </option>
                ))}
              </Select>
            </FieldBlock>
          </div>
          <Spacing size={14} />

          {/* 장비 */}
          <FieldBlock label="필요 장비">
            <Spacing size={8} />
            <div css={equipmentRowCss}>
              {ALL_EQUIPMENT.map(eq => {
                const selected = equipment.includes(eq);
                return (
                  <ToggleChipButton
                    key={eq}
                    selected={selected}
                    ariaLabel={EQUIPMENT_LABELS[eq]}
                    onClick={() => {
                      const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                      setEquipment(next);
                      handleFilterChange();
                    }}
                  >
                    {EQUIPMENT_LABELS[eq]}
                  </ToggleChipButton>
                );
              })}
            </div>
          </FieldBlock>
        </SectionBlock>
      </div>

      {validationError && (
        <div css={sectionPaddingCss}>
          <Spacing size={8} />
          <span css={validationTextCss} role="alert">
            {validationError}
          </span>
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
                {availableRooms.map(
                  (room: { id: string; name: string; floor: number; capacity: number; equipment: string[] }) => {
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
                  }
                )}
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

const twoColumnRowCss = css`
  display: flex;
  gap: 12px;
`;

const equipmentRowCss = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const validationTextCss = css`
  color: ${colors.red500};
  font-size: 14px;
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
