export function getBarrelShiftedArray<T>(arr: T[], direction: number): T[] {
  const n = arr.length;
  const shift = ((direction % n) + n) % n;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}
