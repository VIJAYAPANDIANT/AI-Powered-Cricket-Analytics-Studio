import pandas as pd
import numpy as np

def analyze_toss_impact(df_matches):
    """
    Calculate the percentage of matches won by the team that won the toss.
    """
    print("[+] Running Toss Win Impact analysis...")
    total_matches = len(df_matches)
    if total_matches == 0:
        return pd.DataFrame()
        
    toss_and_match_wins = df_matches[df_matches['toss_winner'] == df_matches['winner']].shape[0]
    toss_win_match_loss = total_matches - toss_and_match_wins
    
    toss_impact = pd.DataFrame({
        'outcome': ['Toss & Match Winner', 'Toss Winner / Match Loser'],
        'count': [toss_and_match_wins, toss_win_match_loss],
        'percentage': [
            np.round((toss_and_match_wins / total_matches) * 100, 2),
            np.round((toss_win_match_loss / total_matches) * 100, 2)
        ]
    })
    return toss_impact

def analyze_team_wins(df_matches):
    """
    Calculate the total number of wins per team.
    """
    print("[+] Running Team Win Distribution analysis...")
    wins = df_matches['winner'].value_counts().reset_index()
    wins.columns = ['team', 'wins']
    # Remove 'No Result' values
    wins = wins[wins['team'] != 'No Result']
    return wins

def analyze_venue_performance(df_matches, df_deliveries):
    """
    Calculate average score and match outcomes (chased vs defended) for each venue.
    """
    print("[+] Running Venue Performance analysis...")
    
    # 1. Total matches played at each venue
    venue_matches = df_matches['venue'].value_counts().reset_index()
    venue_matches.columns = ['venue', 'matches_played']
    
    # 2. Average innings score per venue
    # Calculate score per match per inning
    scores = df_deliveries.groupby(['match_id', 'inning', 'batting_team'])['total_runs'].sum().reset_index()
    # Merge with match metadata to get venue
    scores = pd.merge(scores, df_matches[['id', 'venue']], left_on='match_id', right_on='id')
    avg_scores = scores.groupby('venue')['total_runs'].mean().reset_index(name='avg_score')
    avg_scores['avg_score'] = np.round(avg_scores['avg_score'], 0).astype(int)
    
    # Merge statistics
    venue_stats = pd.merge(venue_matches, avg_scores, on='venue')
    return venue_stats.sort_values(by='matches_played', ascending=False)

def analyze_season_trends(df_matches, df_deliveries):
    """
    Calculate total and average match scores year-over-year.
    """
    print("[+] Running Season Run Trends analysis...")
    
    # Average score per match by season
    scores = df_deliveries.groupby(['match_id'])['total_runs'].sum().reset_index()
    scores = pd.merge(scores, df_matches[['id', 'season']], left_on='match_id', right_on='id')
    
    season_stats = scores.groupby('season').agg(
        total_runs=('total_runs', 'sum'),
        matches_played=('match_id', 'nunique'),
        avg_match_runs=('total_runs', 'mean')
    ).reset_index()
    
    season_stats['avg_match_runs'] = np.round(season_stats['avg_match_runs'], 0).astype(int)
    return season_stats.sort_values(by='season')

def analyze_wicket_patterns(df_deliveries):
    """
    Determine the frequency of different dismissal kinds.
    """
    print("[+] Running Wicket Dismissal Patterns analysis...")
    wickets = df_deliveries[df_deliveries['player_dismissed'] != '']
    wicket_counts = wickets['dismissal_kind'].value_counts().reset_index()
    wicket_counts.columns = ['dismissal_kind', 'count']
    return wicket_counts

def analyze_phase_run_patterns(df_deliveries):
    """
    Determine average run rates and wickets across game phases (Powerplay, Middle, Death).
    """
    print("[+] Running Game Phase run rates analysis...")
    
    # Run rate: (total_runs / balls) * 6
    # Balls bowled excludes wides/noballs
    balls = df_deliveries[df_deliveries['extra_runs'] == 0].groupby('phase').size().reset_index(name='balls')
    runs = df_deliveries.groupby('phase')['total_runs'].sum().reset_index(name='runs')
    
    valid_wickets_mask = (df_deliveries['player_dismissed'] != '') & (df_deliveries['dismissal_kind'] != 'run out')
    wickets = df_deliveries[valid_wickets_mask].groupby('phase').size().reset_index(name='wickets')
    
    # Merge stats
    phase_stats = pd.merge(runs, balls, on='phase')
    phase_stats = pd.merge(phase_stats, wickets, on='phase')
    
    phase_stats['run_rate'] = np.round((phase_stats['runs'] / phase_stats['balls']) * 6, 2)
    return phase_stats
