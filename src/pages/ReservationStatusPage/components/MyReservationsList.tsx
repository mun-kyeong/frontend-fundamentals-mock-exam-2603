import { css } from '@emotion/react';
import { Button, ListRow, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

type Reservation = {
  id: string;
  roomId: string;
  date: string;
  start: string;
  end: string;
  attendees: number;
  equipment: string[];
};

type MyReservationsListProps = {
  reservations: Reservation[];
  equipmentLabels: Record<string, string>;
  getRoomName: (roomId: string) => string;
  onCancel: (id: string) => void;
};

export function MyReservationsList({ reservations, equipmentLabels, getRoomName, onCancel }: MyReservationsListProps) {
  if (reservations.length === 0) {
    return (
      <div css={emptyStateCss}>
        <Text typography="t6" color={colors.grey500}>
          예약 내역이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div css={listCss}>
      {reservations.map(res => (
        <div
          key={res.id}
          css={itemCss}
        >
          <ListRow
            contents={
              <ListRow.Text2Rows
                top={getRoomName(res.roomId)}
                topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                bottom={`${res.date} ${res.start}~${res.end} · ${res.attendees}명 · ${res.equipment.map(e => equipmentLabels[e]).join(', ') || '장비 없음'}`}
                bottomProps={{ typography: 't7', color: colors.grey600 }}
              />
            }
            right={
              <Button
                type="danger"
                style="weak"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('정말 취소하시겠습니까?')) {
                    onCancel(res.id);
                  }
                }}
              >
                취소
              </Button>
            }
          />
        </div>
      ))}
    </div>
  );
}

const emptyStateCss = css`
  padding: 40px 0;
  text-align: center;
  background: ${colors.grey50};
  border-radius: 14px;
`;

const listCss = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const itemCss = css`
  padding: 14px 16px;
  border-radius: 14px;
  background: ${colors.grey50};
  border: 1px solid ${colors.grey200};
`;
