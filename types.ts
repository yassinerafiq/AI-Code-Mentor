import { User } from 'firebase/auth';

export enum AnalysisMode {
  EXPLAIN = 'Explain Code',
  FIND_BUGS = 'Find Bugs',
  IMPROVE = 'Improve Code'
}

export interface AnalysisResult {
  id?: string;
  userId: string;
  code: string;
  mode: AnalysisMode;
  response: string;
  timestamp: number; // Stored as millis
}

export interface HistoryItem extends AnalysisResult {
  id: string;
}

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};
