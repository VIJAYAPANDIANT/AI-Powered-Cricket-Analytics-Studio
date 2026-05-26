export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface DatasetMetadata {
  filename: string;
  fileType: 'matches' | 'deliveries';
  sizeBytes: number;
  rowCount: number;
  uploadedAt: string;
  status: 'valid' | 'invalid';
  validationErrors?: string[];
}

export interface Match {
  id: number;
  season: string;
  city: string;
  date: string;
  team1: string;
  team2: string;
  toss_winner: string;
  toss_decision: 'bat' | 'field' | string;
  result: string;
  dl_applied: number;
  winner: string;
  win_by_runs: number;
  win_by_wickets: number;
  player_of_match: string;
  venue: string;
  umpire1?: string;
  umpire2?: string;
  umpire3?: string;
}

export interface Delivery {
  match_id: number;
  inning: number;
  batting_team: string;
  bowling_team: string;
  over: number;
  ball: number;
  batter: string;
  bowler: string;
  non_striker: string;
  runs_off_bat: number;
  extra_runs: number;
  total_runs: number;
  player_dismissed: string; // empty if no dismissal
  dismissal_kind: string; // empty if no dismissal
  fielder: string; // empty if no dismissal
}

export interface AnalyticsFilter {
  season?: string;
  team?: string;
  batter?: string;
  bowler?: string;
  venue?: string;
}
