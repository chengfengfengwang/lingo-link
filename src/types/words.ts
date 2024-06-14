export interface Sww {
  id: string;
  context?: string;
  lastEditDate?: number;
  word: string;
  remark?: string;
  masteryLevel?: undefined | 0 | 1 | 2;
  searchCount?: number;
  weight?: number;
}
export interface WordData {
  phonetic: string[];
  explains: {
    pos: string | undefined;
    trans: string;
  }[];
  examTags?: string[];
  examples?: string[][];
}

export type WordType = "all" | "mastered" | "unMastered";
export type SortType = "time" | "weight";
export type WeightRange = "e5" | "gtoe4" | "gtoe3" | "all";
export type YoudaoCollins = {
  category: string | undefined;
  phonetic: string | undefined;
  star: number;
  rank: string;
  pattern: string | undefined;
  explanations: {
      explanation: string;
      examples: string[];
  }[];
}[]

