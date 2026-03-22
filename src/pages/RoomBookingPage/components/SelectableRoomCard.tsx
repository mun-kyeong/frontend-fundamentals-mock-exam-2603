import { css } from '@emotion/react';
import { ListRow, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room } from '_tosslib/server/types';

type SelectableRoomCardProps = {
  room: Room;
  isSelected: boolean;
  onSelect: (id: string) => void;
  equipmentLabels: Record<string, string>;
};

export function SelectableRoomCard({ room, isSelected, onSelect, equipmentLabels }: SelectableRoomCardProps) {
  return (
    <div
      onClick={() => onSelect(room.id)}
      role="button"
      aria-pressed={isSelected}
      aria-label={room.name}
      css={cardCss(isSelected)}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={room.name}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
              .map((e: string) => equipmentLabels[e])
              .join(', ')}`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={
          isSelected ? (
            <Text typography="t7" fontWeight="bold" color={colors.blue500}>
              선택됨
            </Text>
          ) : undefined
        }
      />
    </div>
  );
}

const cardCss = (isSelected: boolean) => css`
  cursor: pointer;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
  background: ${isSelected ? colors.blue50 : colors.white};
  transition: all 0.15s;
  &:hover {
    border-color: ${isSelected ? colors.blue500 : colors.grey300};
  }
`;
