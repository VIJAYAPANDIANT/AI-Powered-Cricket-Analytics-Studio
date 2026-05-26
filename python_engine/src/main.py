import os
import sys

# Add current folder to sys.path to allow absolute imports of source scripts
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mock_generator import generate_mock_datasets
from cleaner import clean_matches_data, clean_deliveries_data
from features import add_over_phase_category, calculate_batting_metrics, calculate_bowling_metrics
from analytics import (
    analyze_toss_impact, 
    analyze_team_wins, 
    analyze_venue_performance, 
    analyze_season_trends, 
    analyze_wicket_patterns, 
    analyze_phase_run_patterns
)
from visualizer import (
    plot_toss_impact, 
    plot_top_batters, 
    plot_top_bowlers, 
    plot_season_trends, 
    plot_phase_heatmap
)

def run_pipeline():
    # Setup base directories
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    output_dir = os.path.join(base_dir, 'output')
    plots_dir = os.path.join(output_dir, 'plots')
    stats_dir = os.path.join(output_dir, 'stats')

    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(plots_dir, exist_ok=True)
    os.makedirs(stats_dir, exist_ok=True)

    print("==================================================")
    print("      IPL InsightX Python Analytics Engine        ")
    print("==================================================")

    # 1. Check/Generate dataset files
    generate_mock_datasets(data_dir)

    matches_path = os.path.join(data_dir, 'matches.csv')
    deliveries_path = os.path.join(data_dir, 'deliveries.csv')

    # 2. Ingest and Clean
    df_matches = clean_matches_data(matches_path)
    df_deliveries = clean_deliveries_data(deliveries_path)

    # 3. Feature Engineering
    df_deliveries = add_over_phase_category(df_deliveries)
    df_batters = calculate_batting_metrics(df_deliveries)
    df_bowlers = calculate_bowling_metrics(df_deliveries)

    # 4. Analytics Calculations
    df_toss = analyze_toss_impact(df_matches)
    df_wins = analyze_team_wins(df_matches)
    df_venues = analyze_venue_performance(df_matches, df_deliveries)
    df_seasons = analyze_season_trends(df_matches, df_deliveries)
    df_wickets = analyze_wicket_patterns(df_deliveries)
    df_phases = analyze_phase_run_patterns(df_deliveries)

    # 5. Save Summaries to Excel/CSV Stats Directory
    print("[+] Writing analytical summaries to output database...")
    df_toss.to_csv(os.path.join(stats_dir, 'toss_impact.csv'), index=False)
    df_wins.to_csv(os.path.join(stats_dir, 'team_wins.csv'), index=False)
    df_venues.to_csv(os.path.join(stats_dir, 'venue_stats.csv'), index=False)
    df_seasons.to_csv(os.path.join(stats_dir, 'season_stats.csv'), index=False)
    df_wickets.to_csv(os.path.join(stats_dir, 'wicket_counts.csv'), index=False)
    df_phases.to_csv(os.path.join(stats_dir, 'phase_stats.csv'), index=False)
    df_batters.to_csv(os.path.join(stats_dir, 'top_batters.csv'), index=False)
    df_bowlers.to_csv(os.path.join(stats_dir, 'top_bowlers.csv'), index=False)
    print(f"    -> Exported CSV summaries to: {stats_dir}")

    # 6. Render Matplotlib Plots
    print("[+] Rendering charts and plots...")
    plot_toss_impact(df_toss, plots_dir)
    plot_top_batters(df_batters, plots_dir)
    plot_top_bowlers(df_bowlers, plots_dir)
    plot_season_trends(df_seasons, plots_dir)
    plot_phase_heatmap(df_deliveries, plots_dir)
    print(f"    -> Rendered high-res PNG plots to: {plots_dir}")

    print("\n[SUCCESS] IPL InsightX data-processing pipeline completed successfully!")
    print(f"Check output folder: {output_dir}")

if __name__ == '__main__':
    run_pipeline()
