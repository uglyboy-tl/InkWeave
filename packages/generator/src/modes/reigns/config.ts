export interface StatDef {
  id: string;
  name: string;
  initial: number;
  min?: number;
  max?: number;
}

export interface ReignsConfig {
  stats: StatDef[];
}

export const DEFAULT_STATS: StatDef[] = [
  { id: "A", name: "势力甲", initial: 5, min: 0, max: 10 },
  { id: "B", name: "势力乙", initial: 5, min: 0, max: 10 },
  { id: "C", name: "势力丙", initial: 5, min: 0, max: 10 },
  { id: "D", name: "势力丁", initial: 5, min: 0, max: 10 },
];

export const DEFAULT_CONFIG: ReignsConfig = {
  stats: DEFAULT_STATS,
};

export function createStatIdToNameMap(stats: StatDef[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const s of stats) {
    map[s.id] = s.name;
  }
  return map;
}
