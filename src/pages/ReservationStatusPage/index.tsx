import { css } from '@emotion/react';
import { Border, Button, Spacing, Top } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { MyReservationsList } from 'pages/ReservationStatusPage/components/MyReservationsList';
import { ReservationTimeline } from 'pages/ReservationStatusPage/components/ReservationTimeline';
import { SectionBlock } from 'pages/ReservationStatusPage/components/SectionBlock';
import { useCancelReservation } from 'pages/ReservationStatusPage/hooks/useCancelReservation';
import { useMyReservations } from 'pages/ReservationStatusPage/hooks/useMyReservations';
import { useReservations } from 'pages/ReservationStatusPage/hooks/useReservations';
import { useRooms } from 'pages/ReservationStatusPage/hooks/useRooms';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageBanner } from '../../shared/components/MessageBanner';
import { DatePicker } from '../../shared/components/DatePicker';
import { formatDate } from '../../shared/utils/date.utils';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

const TIMELINE_START = 9;
const TIMELINE_END = 20;
const TIMELINE_SLOT_MINUTES = 30;

export function ReservationStatusPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [date, setDate] = useState(formatDate(new Date()));
  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const locationState = location.state as { message?: string; date?: string } | null;
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    locationState?.message ? { type: 'success', text: locationState.message } : null
  );

  const { data: rooms = [] } = useRooms();
  const { data: reservations = [] } = useReservations(date);
  const { data: myReservationList = [] } = useMyReservations();

  const cancelMutation = useCancelReservation({
    onSuccess: () => setMessage({ type: 'success', text: '예약이 취소되었습니다.' }),
    onError: () => setMessage({ type: 'error', text: '취소에 실패했습니다.' }),
  });

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  useEffect(() => {
    if (locationState?.message || locationState?.date) {
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  useEffect(() => {
    if (locationState?.date) {
      setDate(locationState.date);
    }
  }, [locationState?.date]);

  return (
    <div css={pageWrapperCss}>
      <Top.Top03 css={pageTitleCss}>회의실 예약</Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <div css={sectionPaddingCss}>
        <SectionBlock title="날짜 선택">
          <div css={datePickerWrapperCss}>
            <DatePicker value={date} min={formatDate(new Date())} onChange={setDate} ariaLabel="날짜" />
          </div>
        </SectionBlock>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <div css={sectionPaddingCss}>
        <SectionBlock title="예약 현황">
          <Spacing size={16} />
          <ReservationTimeline
            rooms={rooms}
            reservations={reservations}
            startHour={TIMELINE_START}
            endHour={TIMELINE_END}
            slotMinutes={TIMELINE_SLOT_MINUTES}
            equipmentLabels={EQUIPMENT_LABELS}
            activeReservationId={activeReservation}
            onToggleReservation={setActiveReservation}
          />
        </SectionBlock>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      {message && (
        <div css={sectionPaddingCss}>
          <MessageBanner type={message.type} text={message.text} />
          <Spacing size={12} />
        </div>
      )}

      {/* 내 예약 목록 */}
      <div css={sectionPaddingCss}>
        <SectionBlock
          title="내 예약"
          subtitle={myReservationList.length > 0 ? `${myReservationList.length}건` : undefined}
        >
          <Spacing size={16} />
          <MyReservationsList
            reservations={myReservationList}
            equipmentLabels={EQUIPMENT_LABELS}
            getRoomName={getRoomName}
            onCancel={handleCancel}
          />
        </SectionBlock>
      </div>

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약하기 버튼 */}
      <div css={sectionPaddingCss}>
        <Button display="full" onClick={() => navigate('/booking')}>
          예약하기
        </Button>
      </div>
      <Spacing size={24} />
    </div>
  );
}

const pageTitleCss = css`
  padding-left: 24px;
  padding-right: 24px;
`;

const sectionPaddingCss = css`
  padding: 0 24px;
`;

const pageWrapperCss = css`
  background: ${colors.white};
  padding-bottom: 40px;
`;

const datePickerWrapperCss = css`
  margin-top: 6px;
`;
