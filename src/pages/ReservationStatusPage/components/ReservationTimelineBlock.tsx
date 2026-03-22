import { css } from '@emotion/react';
import { colors } from '_tosslib/constants/colors';

type ReservationTimelineBlockProps = {
  reservationId: string;
  roomName: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
  equipmentLabels: Record<string, string>;
  isActive: boolean;
  leftPercent: number;
  widthPercent: number;
  onToggle: (reservationId: string) => void;
};

export function ReservationTimelineBlock({
  reservationId,
  roomName,
  start,
  end,
  attendees,
  equipment,
  equipmentLabels,
  isActive,
  leftPercent,
  widthPercent,
  onToggle,
}: ReservationTimelineBlockProps) {
  return (
    <div css={timelineBlockWrapperCss(leftPercent, widthPercent)}>
      <div
        role="button"
        aria-label={`${roomName} ${start}-${end} 예약 상세`}
        onClick={() => onToggle(reservationId)}
        css={timelineBlockCss(isActive)}
      />
      {isActive && (
        <div role="tooltip" css={timelineTooltipCss}>
          <div>
            {start} ~ {end}
          </div>
          <div>{attendees}명</div>
          {equipment.length > 0 && <div>{equipment.map(e => equipmentLabels[e]).join(', ')}</div>}
        </div>
      )}
    </div>
  );
}

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
