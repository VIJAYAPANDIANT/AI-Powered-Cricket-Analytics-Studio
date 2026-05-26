import os
import random
import pandas as pd

def generate_mock_datasets(data_dir):
    matches_path = os.path.join(data_dir, 'matches.csv')
    deliveries_path = os.path.join(data_dir, 'deliveries.csv')

    # Check if files already exist
    if os.path.exists(matches_path) and os.path.exists(deliveries_path):
        print("[*] Datasets matches.csv and deliveries.csv already exist in data directory.")
        return

    print("[+] Ingesting default mock IPL datasets...")
    os.makedirs(data_dir, exist_ok=True)

    seasons = ['2021', '2022', '2023', '2024', '2025']
    teams = [
        'Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 
        'Kolkata Knight Riders', 'Delhi Capitals', 'Gujarat Titans', 
        'Rajasthan Royals', 'Lucknow Super Giants', 'Punjab Kings', 'Sunrisers Hyderabad'
    ]
    venues = [
        'Wankhede Stadium, Mumbai', 'M. Chinnaswamy Stadium, Bangalore', 'MA Chidambaram Stadium, Chennai', 
        'Eden Gardens, Kolkata', 'Narendra Modi Stadium, Ahmedabad', 'Rajiv Gandhi International Stadium, Hyderabad', 
        'Arun Jaitley Stadium, Delhi', 'Sawai Mansingh Stadium, Jaipur'
    ]
    batters = [
        'Virat Kohli', 'Rohit Sharma', 'MS Dhoni', 'Shubman Gill', 'Suryakumar Yadav', 
        'KL Rahul', 'Jos Buttler', 'Yashasvi Jaiswal', 'Faf du Plessis', 'Ruturaj Gaikwad'
    ]
    bowlers = [
        'Jasprit Bumrah', 'Yuzvendra Chahal', 'Rashid Khan', 'Mohammed Shami', 'Ravindra Jadeja', 
        'Sunil Narine', 'Trent Boult', 'Bhuvneshwar Kumar', 'Kuldeep Yadav', 'Mitchell Starc'
    ]

    matches_list = []
    deliveries_list = []
    match_id_counter = 1

    for season in seasons:
        # Generate 15 matches per season
        for i in range(15):
            match_id = match_id_counter
            match_id_counter += 1

            team1 = teams[(match_id) % len(teams)]
            team2 = teams[(match_id + 1) % len(teams)]
            if team1 == team2:
                team2 = teams[(match_id + 2) % len(teams)]

            toss_winner = team1 if random.random() < 0.5 else team2
            toss_decision = 'field' if random.random() < 0.6 else 'bat'
            
            # Simple bias: toss winner bowling first wins 55% of matches
            if toss_decision == 'field' and toss_winner == team1:
                winner = team1 if random.random() < 0.58 else team2
            elif toss_decision == 'field' and toss_winner == team2:
                winner = team2 if random.random() < 0.58 else team1
            else:
                winner = team1 if random.random() < 0.50 else team2

            win_by_runs = 0
            win_by_wickets = 0
            
            # Determine margins
            if random.random() < 0.5:
                # Chased target (wickets)
                win_by_wickets = random.randint(3, 9)
            else:
                # Defended target (runs)
                win_by_runs = random.randint(5, 75)

            venue = venues[match_id % len(venues)]
            city = venue.split(', ')[1] if ', ' in venue else 'Unknown'
            date = f"{season}-04-{str(random.randint(1, 28)).zfill(2)}"
            pom = random.choice(batters) if random.random() < 0.6 else random.choice(bowlers)

            matches_list.append({
                'id': match_id,
                'season': season,
                'city': city,
                'date': date,
                'team1': team1,
                'team2': team2,
                'toss_winner': toss_winner,
                'toss_decision': toss_decision,
                'result': 'normal',
                'dl_applied': 0,
                'winner': winner,
                'win_by_runs': win_by_runs,
                'win_by_wickets': win_by_wickets,
                'player_of_match': pom,
                'venue': venue,
                'umpire1': 'Umpire A',
                'umpire2': 'Umpire B',
                'umpire3': 'Umpire C'
            })

            # Generate deliveries for this match
            match_batters = random.sample(batters, 4)
            match_bowlers = random.sample(bowlers, 3)

            # Inning 1
            for over in range(20):
                striker = match_batters[over % 3]
                bowler_name = match_bowlers[over % len(match_bowlers)]
                
                for ball in range(1, 7):
                    # Generate runs
                    runs_off_bat = random.choice([0, 1, 1, 2, 4, 6])
                    extra_runs = 1 if random.random() < 0.05 else 0
                    total_runs = runs_off_bat + extra_runs
                    
                    # Dismissal
                    is_out = random.random() < 0.035
                    player_dismissed = striker if is_out else ''
                    dismissal_kind = random.choice(['caught', 'bowled', 'lbw', 'run out']) if is_out else ''
                    fielder = random.choice(match_batters) if dismissal_kind in ['caught', 'run out'] else ''

                    deliveries_list.append({
                        'match_id': match_id,
                        'inning': 1,
                        'batting_team': team1,
                        'bowling_team': team2,
                        'over': over,
                        'ball': ball,
                        'batter': striker,
                        'bowler': bowler_name,
                        'non_striker': match_batters[(over + 1) % 3],
                        'runs_off_bat': runsOffBat if 'runsOffBat' in locals() else runs_off_bat,
                        'extra_runs': extraRuns if 'extraRuns' in locals() else extra_runs,
                        'total_runs': totalRuns if 'totalRuns' in locals() else total_runs,
                        'player_dismissed': player_dismissed,
                        'dismissal_kind': dismissal_kind,
                        'fielder': fielder
                    })

            # Inning 2
            for over in range(20):
                striker = match_batters[(over + 1) % 3]
                bowler_name = match_bowlers[(over + 1) % len(match_bowlers)]
                
                for ball in range(1, 7):
                    runs_off_bat = random.choice([0, 1, 1, 2, 4, 6])
                    extra_runs = 1 if random.random() < 0.05 else 0
                    total_runs = runs_off_bat + extra_runs
                    
                    is_out = random.random() < 0.035
                    player_dismissed = striker if is_out else ''
                    dismissal_kind = random.choice(['caught', 'bowled', 'lbw', 'run out']) if is_out else ''
                    fielder = random.choice(match_batters) if dismissal_kind in ['caught', 'run out'] else ''

                    deliveries_list.append({
                        'match_id': match_id,
                        'inning': 2,
                        'batting_team': team2,
                        'bowling_team': team1,
                        'over': over,
                        'ball': ball,
                        'batter': striker,
                        'bowler': bowler_name,
                        'non_striker': match_batters[(over + 2) % 3],
                        'runs_off_bat': runs_off_bat,
                        'extra_runs': extra_runs,
                        'total_runs': total_runs,
                        'player_dismissed': player_dismissed,
                        'dismissal_kind': dismissal_kind,
                        'fielder': fielder
                    })

    # Save to CSV using pandas
    df_matches = pd.DataFrame(matches_list)
    df_matches.to_csv(matches_path, index=False)
    print(f"[+] Saved {len(df_matches)} match records to: {matches_path}")

    df_deliveries = pd.DataFrame(deliveries_list)
    df_deliveries.to_csv(deliveries_path, index=False)
    print(f"[+] Saved {len(df_deliveries)} ball-by-ball delivery entries to: {deliveries_path}")

if __name__ == '__main__':
    generate_mock_datasets('./data')
