import pandas as pd
import numpy as np

def add_over_phase_category(df_deliveries):
    """
    Categorize overs into match phases based on 0-indexed over numbers:
    - 0 to 5 (Overs 1-6): Powerplay
    - 6 to 14 (Overs 7-15): Middle Overs
    - 15 to 19 (Overs 16-20): Death Overs
    """
    print("[+] Injected game phase feature (Powerplay, Middle, Death)...")
    
    conditions = [
        (df_deliveries['over'] < 6),
        (df_deliveries['over'] >= 6) & (df_deliveries['over'] < 15),
        (df_deliveries['over'] >= 15)
    ]
    choices = ['Powerplay', 'Middle', 'Death']
    
    df_deliveries['phase'] = np.select(conditions, choices, default='Unknown')
    return df_deliveries

def calculate_batting_metrics(df_deliveries):
    """
    Calculate runs, balls faced, average, strike rate for each batter.
    Balls faced excludes wide deliveries.
    """
    print("[+] Compiling batting performance statistics...")
    
    # 1. Total Runs per batter
    runs = df_deliveries.groupby('batter')['runs_off_bat'].sum().reset_index()
    
    # 2. Balls faced (exclude wides - let's check if dismissal_kind indicates wide or check extra_runs / ball info)
    # Typically, in IPL data, if wide/noball runs exist. Wides don't count as batter balls.
    # Wides can be checked if dismissal_kind / extras matches standard wide formats.
    # Simple check: if extra_runs > 0, check if we have detailed extras.
    # For mock data, we just exclude extra_runs > 0 or look at wide flag. Let's count deliveries where dismissal_kind !== 'wide' or count all balls for simplicity but subtract wides if wide name in dismissal / column is present.
    # Let's count balls faced by filtering out rows with 'wide' in dismissal_kind or similar extras check.
    # A standard way: balls faced is count of rows where extra_runs == 0 (wides/noballs are extras, noball counts as ball faced but wide doesn't).
    # Let's say balls faced = rows where extra_runs == 0 or extra_runs is 0.
    balls_faced = df_deliveries[df_deliveries['extra_runs'] == 0].groupby('batter').size().reset_index(name='balls')
    
    # 3. Outs (count dismissals where player_dismissed == batter name)
    outs = df_deliveries[df_deliveries['player_dismissed'] != ''].groupby('player_dismissed').size().reset_index(name='outs')
    outs.rename(columns={'player_dismissed': 'batter'}, inplace=True)
    
    # Merge statistics
    bat_stats = pd.merge(runs, balls_faced, on='batter', how='outer').fillna(0)
    bat_stats = pd.merge(bat_stats, outs, on='batter', how='left').fillna(0)
    
    # Filter out players who faced 0 balls to avoid division by zero
    bat_stats = bat_stats[bat_stats['balls'] > 0]
    
    # Calculate Strike Rate: (runs / balls) * 100
    bat_stats['strike_rate'] = np.round((bat_stats['runs_off_bat'] / bat_stats['balls']) * 100, 2)
    
    # Calculate Average: runs / outs (if outs is 0, average is runs)
    bat_stats['average'] = np.round(
        np.where(bat_stats['outs'] > 0, bat_stats['runs_off_bat'] / bat_stats['outs'], bat_stats['runs_off_bat']), 
        2
    )
    
    return bat_stats.sort_values(by='runs_off_bat', ascending=False)

def calculate_bowling_metrics(df_deliveries):
    """
    Calculate wickets, runs conceded, balls bowled, economy rate for each bowler.
    Balls bowled excludes wides and noballs.
    """
    print("[+] Compiling bowling performance statistics...")
    
    # 1. Runs conceded (excludes legbyes and byes if possible, but simple total runs is fine)
    runs_conceded = df_deliveries.groupby('bowler')['total_runs'].sum().reset_index(name='runs_conceded')
    
    # 2. Balls bowled (excludes wides/noballs)
    balls_bowled = df_deliveries[df_deliveries['extra_runs'] == 0].groupby('bowler').size().reset_index(name='balls')
    
    # 3. Wickets (exclude run outs)
    valid_wickets_mask = (df_deliveries['player_dismissed'] != '') & (df_deliveries['dismissal_kind'] != 'run out')
    wickets = df_deliveries[valid_wickets_mask].groupby('bowler').size().reset_index(name='wickets')
    
    # Merge statistics
    bowl_stats = pd.merge(runs_conceded, balls_bowled, on='bowler', how='outer').fillna(0)
    bowl_stats = pd.merge(bowl_stats, wickets, on='bowler', how='left').fillna(0)
    
    # Filter out bowlers with 0 balls bowled
    bowl_stats = bowl_stats[bowl_stats['balls'] > 0]
    
    # Calculate overs: balls / 6
    bowl_stats['overs'] = bowl_stats['balls'] / 6
    
    # Calculate Economy: runs_conceded / (balls / 6)
    bowl_stats['economy'] = np.round(bowl_stats['runs_conceded'] / bowl_stats['overs'], 2)
    
    return bowl_stats.sort_values(by='wickets', ascending=False)
