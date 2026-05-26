import { AnalyticsFilter } from './api';

// Realistic list of IPL seasons, teams, venues, players
export const seasons = ['2025', '2024', '2023', '2022', '2021'];
export const teams = [
  'Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 
  'Kolkata Knight Riders', 'Delhi Capitals', 'Gujarat Titans', 
  'Rajasthan Royals', 'Lucknow Super Giants', 'Punjab Kings', 'Sunrisers Hyderabad'
];
export const venues = [
  'Wankhede Stadium, Mumbai', 'M. Chinnaswamy Stadium, Bangalore', 'MA Chidambaram Stadium, Chennai',
  'Eden Gardens, Kolkata', 'Narendra Modi Stadium, Ahmedabad', 'Arun Jaitley Stadium, Delhi'
];
export const batters = [
  'Virat Kohli', 'Shubman Gill', 'Ruturaj Gaikwad', 'Rohit Sharma', 
  'Suryakumar Yadav', 'MS Dhoni', 'Jos Buttler', 'KL Rahul'
];
export const bowlers = [
  'Jasprit Bumrah', 'Rashid Khan', 'Yuzvendra Chahal', 'Mohammed Shami', 
  'Ravindra Jadeja', 'Sunil Narine', 'Mitchell Starc', 'Trent Boult'
];

export const getMockFilterOptions = () => {
  return {
    seasons,
    teams,
    venues,
    batters,
    bowlers
  };
};

export const getMockMetrics = (filters: AnalyticsFilter) => {
  // Apply minor differences based on season/team filters for realistic UX changes
  const seasonFactor = filters.season ? parseInt(filters.season) % 5 : 0;
  const teamSelected = !!filters.team;

  return {
    totalMatches: teamSelected ? 14 + seasonFactor : 74 + seasonFactor * 2,
    totalTeams: teamSelected ? 2 : 10,
    totalRuns: teamSelected ? 4850 + seasonFactor * 120 : 24890 + seasonFactor * 400,
    totalWickets: teamSelected ? 165 + seasonFactor * 4 : 880 + seasonFactor * 10,
    highestTeamScore: 235 + (seasonFactor * 5) + (teamSelected ? -10 : 0),
    averageMatchScore: 172 + seasonFactor + (filters.venue ? 5 : 0)
  };
};

export const getMockCharts = (filters: AnalyticsFilter) => {
  const sf = filters.season ? parseInt(filters.season) % 5 : 0;

  // 1. Toss Impact
  const tossImpact = [
    { name: 'Toss & Match Winner', value: 45 + sf },
    { name: 'Toss Winner / Match Loser', value: 38 - sf }
  ];

  // 2. Phases
  const matchPhases = [
    { name: 'Powerplay (0-6)', runRate: 8.2 + (sf * 0.1), wickets: 25 + sf },
    { name: 'Middle (7-15)', runRate: 7.6 + (sf * 0.05), wickets: 32 + sf * 2 },
    { name: 'Death (16-20)', runRate: 9.8 + (sf * 0.15), wickets: 45 - sf }
  ];

  // 3. Batters (Top 10)
  const topBatters = [
    { name: 'Virat Kohli', runs: 741 + sf * 15, strikeRate: 154.7, average: 61.8 },
    { name: 'Ruturaj Gaikwad', runs: 583 + sf * 10, strikeRate: 141.2, average: 58.3 },
    { name: 'Shubman Gill', runs: 550 + sf * 12, strikeRate: 145.5, average: 45.8 },
    { name: 'Travis Head', runs: 567 - sf * 20, strikeRate: 191.6, average: 40.5 },
    { name: 'Riyan Parag', runs: 573 + sf * 8, strikeRate: 149.2, average: 52.1 },
    { name: 'Sunil Narine', runs: 488 + sf * 4, strikeRate: 180.7, average: 34.9 },
    { name: 'KL Rahul', runs: 520 - sf * 5, strikeRate: 136.1, average: 37.1 },
    { name: 'Sai Sudharsan', runs: 527 + sf * 5, strikeRate: 141.3, average: 47.9 },
    { name: 'Sanju Samson', runs: 531 - sf * 12, strikeRate: 153.5, average: 48.3 },
    { name: 'Nicholas Pooran', runs: 499 + sf * 15, strikeRate: 178.4, average: 62.4 }
  ].filter(b => !filters.batter || b.name === filters.batter);

  // 4. Bowlers (Top 10)
  const topBowlers = [
    { name: 'Harshal Patel', wickets: 24 + (sf % 3), economy: 8.8, balls: 310 },
    { name: 'Jasprit Bumrah', wickets: 20 + (sf % 2), economy: 6.48, balls: 336 },
    { name: 'Varun Chakravarthy', wickets: 21 - (sf % 3), economy: 8.04, balls: 320 },
    { name: 'T Natarajan', wickets: 19 + (sf % 2), economy: 9.1, balls: 300 },
    { name: 'Yuzvendra Chahal', wickets: 18 - (sf % 2), economy: 8.7, balls: 324 },
    { name: 'Arshdeep Singh', wickets: 19 + (sf % 3), economy: 9.6, balls: 290 },
    { name: 'Rashid Khan', wickets: 16 - (sf % 2), economy: 8.1, balls: 336 },
    { name: 'Andre Russell', wickets: 17 + (sf % 4), economy: 9.3, balls: 210 },
    { name: 'Trent Boult', wickets: 16 + (sf % 2), economy: 8.2, balls: 300 },
    { name: 'Sunil Narine', wickets: 17 - (sf % 2), economy: 6.69, balls: 336 }
  ].filter(bw => !filters.bowler || bw.name === filters.bowler);

  // 5. Win Distribution
  const teamWinDistribution = [
    { name: 'Kolkata Knight Riders', value: 11 + (sf % 2) },
    { name: 'Sunrisers Hyderabad', value: 9 + (sf % 3) },
    { name: 'Rajasthan Royals', value: 9 - (sf % 2) },
    { name: 'Royal Challengers Bangalore', value: 7 + (sf % 4) },
    { name: 'Chennai Super Kings', value: 7 - (sf % 3) },
    { name: 'Delhi Capitals', value: 7 + (sf % 2) },
    { name: 'Lucknow Super Giants', value: 7 - (sf % 2) },
    { name: 'Gujarat Titans', value: 5 + (sf % 3) },
    { name: 'Punjab Kings', value: 5 - (sf % 2) },
    { name: 'Mumbai Indians', value: 4 + (sf % 2) }
  ].filter(t => !filters.team || t.name === filters.team);

  // 6. Venue
  const venuePerformance = [
    { name: 'Eden Gardens', matches: 12 + sf, avgScore: 198 + sf * 2 },
    { name: 'Wankhede Stadium', matches: 10 + sf, avgScore: 185 - sf * 2 },
    { name: 'Chinnaswamy', matches: 9 + sf, avgScore: 202 + sf * 3 },
    { name: 'Narendra Modi Stadium', matches: 9 - sf, avgScore: 178 + sf },
    { name: 'Chepauk', matches: 8 + sf, avgScore: 172 - sf },
    { name: 'Arun Jaitley', matches: 8 - sf, avgScore: 190 + sf * 4 }
  ].filter(v => !filters.venue || v.name.toLowerCase().includes(filters.venue.toLowerCase()));

  // 7. Season Run Trends
  const seasonRunTrends = [
    { season: '2021', avgRuns: 312 },
    { season: '2022', avgRuns: 326 },
    { season: '2023', avgRuns: 342 },
    { season: '2024', avgRuns: 368 },
    { season: '2025', avgRuns: 379 }
  ];

  // 8. Strike Rate
  const strikeRateAnalysis = [
    { name: 'Virat Kohli', runs: 741, strikeRate: 154.7, balls: 479 },
    { name: 'Travis Head', runs: 567, strikeRate: 191.6, balls: 295 },
    { name: 'Sunil Narine', runs: 488, strikeRate: 180.7, balls: 270 },
    { name: 'Abhishek Sharma', runs: 484, strikeRate: 204.2, balls: 237 },
    { name: 'Heinrich Klaasen', runs: 479, strikeRate: 171.1, balls: 280 },
    { name: 'Jake Fraser-McGurk', runs: 330, strikeRate: 234.0, balls: 141 },
    { name: 'Dinesh Karthik', runs: 326, strikeRate: 187.4, balls: 174 },
    { name: 'Ruturaj Gaikwad', runs: 583, strikeRate: 141.2, balls: 413 },
    { name: 'Sanju Samson', runs: 531, strikeRate: 153.5, balls: 346 }
  ];

  // 9. Wickets
  const wicketAnalysis = [
    { name: 'Caught', value: 452 + sf * 10 },
    { name: 'Bowled', value: 185 - sf * 5 },
    { name: 'LBW', value: 92 + sf * 2 },
    { name: 'Run Out', value: 68 - sf },
    { name: 'Stumped', value: 43 + sf },
    { name: 'Caught & Bowled', value: 30 }
  ];

  return {
    tossImpact,
    matchPhases,
    topBatters,
    topBowlers,
    teamWinDistribution,
    venuePerformance,
    seasonRunTrends,
    strikeRateAnalysis,
    wicketAnalysis
  };
};

export const getMockInsights = (filters: AnalyticsFilter): string[] => {
  const team = filters.team || 'Teams';
  const venue = filters.venue ? filters.venue.split(',')[0] : 'stadiums';
  const sf = filters.season ? `in season ${filters.season}` : 'over the last 5 seasons';

  return [
    `Toss Factor: Winning the toss yields a 54.2% match win rate overall, which increases to 62.8% at the Chinnaswamy Stadium due to small boundary dimensions.`,
    `${team} batting efficiency increases by 12.4% during Middle Overs (overs 7-15) when facing finger spin, scoring at 8.4 runs per over compared to 7.1 against wrist spin.`,
    `Death Overs Acceleration: Run rates in overs 16-20 have hit an all-time high of 10.45 runs per over ${sf}, showing a 15% increase compared to 2021 logs.`,
    `Venue bias detected: Teams defending scores at the Chepauk (Chennai) win 58.3% of matches, while teams chasing at Wankhede win 61.2% of games.`,
    `Pace vs Spin: Fast bowlers claim 68% of wickets in the Powerplay (stretching batters with seam), whereas spinners dominate middle overs with 58% of dismissals.`
  ];
};
