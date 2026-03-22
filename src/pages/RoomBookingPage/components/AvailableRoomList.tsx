import { css } from '@emotion/react';
import { Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import type { Room } from '_tosslib/server/types';
import { SelectableRoomCard } from './SelectableRoomCard';

type AvailableRoomListProps = {
  rooms: Room[];
  selectedRoomId: string | null;
  onSelectRoom: (id: string) => void;
  equipmentLabels: Record<string, string>;
};

export function AvailableRoomList({
  rooms,
  selectedRoomId,
  onSelectRoom,
  equipmentLabels,
}: AvailableRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div css={availableEmptyCss}>
        <Text typography="t6" color={colors.grey500}>
          조건에 맞는 회의실이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div css={availableListCss}>
      {rooms.map(room => {
        const isSelected = selectedRoomId === room.id;
        return (
          <SelectableRoomCard
            key={room.id}
            room={room}
            isSelected={isSelected}
            onSelect={onSelectRoom}
            equipmentLabels={equipmentLabels}
          />
        );
      })}
    </div>
  );
}

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
