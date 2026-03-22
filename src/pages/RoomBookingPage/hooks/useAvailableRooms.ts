import type { Equipment, Reservation, Room } from '_tosslib/server/types';

type Filters = {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: Equipment[];
  preferredFloor: string;
  isFilterComplete: boolean;
};

export function useAvailableRooms(rooms: Room[], reservations: Reservation[], filters: Filters) {
  if (!filters.isFilterComplete) return [];

  const preferredFloorNumber = filters.preferredFloor ? Number(filters.preferredFloor) : null;

  return rooms
    .filter(room => {
      if (isCapacityInsufficient(room, filters)) return false;
      if (isMissingRequiredEquipment(room, filters)) return false;
      if (isNotPreferredFloor(room, preferredFloorNumber)) return false;
      if (hasTimeConflict(room, reservations, filters)) return false;
      return true;
    })
    .sort((a, b) => {
      if (a.floor !== b.floor) return a.floor - b.floor;
      return a.name.localeCompare(b.name);
    });
}

function isCapacityInsufficient(room: Room, filters: Filters) {
  return room.capacity < filters.attendees;
}

function isMissingRequiredEquipment(room: Room, filters: Filters) {
  return !filters.equipment.every(eq => room.equipment.includes(eq));
}

function isNotPreferredFloor(room: Room, preferredFloorNumber: number | null) {
  return preferredFloorNumber !== null && room.floor !== preferredFloorNumber;
}

function hasTimeConflict(room: Room, reservations: Reservation[], filters: Filters) {
  return reservations.some(
    r => r.roomId === room.id && r.date === filters.date && r.start < filters.endTime && r.end > filters.startTime
  );
}
