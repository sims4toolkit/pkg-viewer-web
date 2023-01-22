export interface TdescIndexEntry {
  tdesc: string;
  path: string;
  ageMentions: {
    path: string;
    simData?: boolean;
  }[];
}