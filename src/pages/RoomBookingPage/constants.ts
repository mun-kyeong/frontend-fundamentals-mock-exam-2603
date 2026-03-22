export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 9; h <= 20; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 20) {
      slots.push(`${String(h).padStart(2, '0')}:30`);
    }
  }
  return slots;
})();
