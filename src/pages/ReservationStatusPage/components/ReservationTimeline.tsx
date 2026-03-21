import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useState } from 'react';

type Room = { id: string; name: string };
type Reservation = { id: string; roomId: string; start: string; end: string; attendees: number; equipment: string[] };

type ReservationTimelineProps = {
  rooms: Room[];
  reservations: Reservation[];
  startHour?: number;
  endHour?: number;
  slotMinutes?: number;
  equipmentLabels: Record<string, string>;
};

export function ReservationTimeline({
  rooms,
  reservations,
  startHour = 9,
  endHour = 20,
  slotMinutes = 30,
  equipmentLabels,
}: ReservationTimelineProps) {
  const [activeReservation, setActiveReservation] = useState<string | null>(null);

  const timeSlots = buildTimeSlots(startHour, endHour, slotMinutes);
  const hourLabels = timeSlots.filter(t => t.endsWith(':00'));
  const totalMinutes = (endHour - startHour) * 60;
  const toMinutes = (time: string) => timeToMinutes(time, startHour);

  return (
    <div css={timelineContainerCss}>
      <div css={timelineHeaderCss}>
        <div css={timelineRoomLabelSpacerCss} />
        <div css={timelineHourLabelWrapperCss}>
          {hourLabels.map(t => {
            const left = (toMinutes(t) / totalMinutes) * 100;
            return (
              <Text
                key={t}
                typography="t7"
                fontWeight="regular"
                color={colors.grey400}
                css={timelineHourLabelCss(left)}
              >
                {t.slice(0, 2)}
              </Text>
            );
          })}
        </div>
      </div>

      {rooms.map((room, index) => {
        const roomReservations = reservations.filter(r => r.roomId === room.id);
        return (
          <div key={room.id} css={timelineRowCss(index > 0)}>
            <div css={timelineRoomLabelCss}>
              <Text
                typography="t7"
                fontWeight="medium"
                color={colors.grey700}
                ellipsisAfterLines={1}
                css={timelineRoomNameCss}
              >
                {room.name}
              </Text>
            </div>
            <div css={timelineTrackCss}>
              {roomReservations.map(res => {
                const left = (toMinutes(res.start) / totalMinutes) * 100;
                const width = ((toMinutes(res.end) - toMinutes(res.start)) / totalMinutes) * 100;
                const isActive = activeReservation === res.id;
                return (
                  <div key={res.id} css={timelineBlockWrapperCss(left, width)}>
                    <div
                      role="button"
                      aria-label={`${room.name} ${res.start}-${res.end} 예약 상세`}
                      onClick={() => setActiveReservation(isActive ? null : res.id)}
                      css={timelineBlockCss(isActive)}
                    />
                    {isActive && (
                      <div role="tooltip" css={timelineTooltipCss}>
                        <div>
                          {res.start} ~ {res.end}
                        </div>
                        <div>{res.attendees}명</div>
                        {res.equipment.length > 0 && <div>{res.equipment.map(e => equipmentLabels[e]).join(', ')}</div>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const timelineContainerCss = css`
  background: ${colors.grey50};
  border-radius: 14px;
  padding: 16px;
`;

const timelineHeaderCss = css`
  display: flex;
  align-items: flex-end;
  margin-bottom: 8px;
`;

const timelineRoomLabelSpacerCss = css`
  width: 80px;
  flex-shrink: 0;
  padding-right: 8px;
`;

const timelineHourLabelWrapperCss = css`
  flex: 1;
  position: relative;
  height: 18px;
`;

const timelineHourLabelCss = (left: number) => css`
  position: absolute;
  left: ${left}%;
  transform: translateX(-50%);
  font-size: 10px;
  letter-spacing: -0.3px;
`;

const timelineRowCss = (hasMarginTop: boolean) => css`
  display: flex;
  align-items: center;
  height: 32px;
  ${hasMarginTop ? 'margin-top: 4px;' : ''}
`;

const timelineRoomLabelCss = css`
  width: 80px;
  flex-shrink: 0;
  padding-right: 8px;
`;

const timelineRoomNameCss = css`
  font-size: 12px;
`;

const timelineTrackCss = css`
  flex: 1;
  height: 24px;
  background: ${colors.white};
  border-radius: 6px;
  position: relative;
  overflow: visible;
`;

const timelineBlockWrapperCss = (left: number, width: number) => css`
  position: absolute;
  left: ${left}%;
  width: ${width}%;
  height: 100%;
`;

const timelineBlockCss = (isActive: boolean) => css`
  width: 100%;
  height: 100%;
  background: ${colors.blue400};
  border-radius: 4px;
  opacity: ${isActive ? 1 : 0.75};
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 1;
  }
`;

const timelineTooltipCss = css`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 6px;
  background: ${colors.grey900};
  color: ${colors.white};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  line-height: 1.6;
`;

function buildTimeSlots(startHour: number, endHour: number, slotMinutes: number): string[] {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h += 1) {
    for (let m = 0; m < 60; m += slotMinutes) {
      if (h === endHour && m > 0) break;
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
}

function timeToMinutes(time: string, startHour: number): number {
  const [h, m] = time.split(':').map(Number);
  return (h - startHour) * 60 + m;
}
