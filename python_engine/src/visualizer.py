import os
import matplotlib.pyplot as plt
import numpy as np

# Apply cohesive Premium Dark Sports styling
def apply_dark_theme():
    plt.style.use('dark_background')
    
    # Custom parameter overrides
    plt.rcParams['figure.facecolor'] = '#0d1425'
    plt.rcParams['axes.facecolor'] = '#0d1425'
    plt.rcParams['axes.edgecolor'] = '#1e293b'
    plt.rcParams['axes.grid'] = True
    plt.rcParams['grid.color'] = '#1e293b'
    plt.rcParams['grid.alpha'] = 0.5
    plt.rcParams['font.sans-serif'] = 'Outfit, Inter, Arial, sans-serif'
    plt.rcParams['text.color'] = '#f8fafc'
    plt.rcParams['axes.labelcolor'] = '#94a3b8'
    plt.rcParams['xtick.color'] = '#94a3b8'
    plt.rcParams['ytick.color'] = '#94a3b8'

def plot_toss_impact(df_toss, output_dir):
    apply_dark_theme()
    fig, ax = plt.subplots(figsize=(6, 5), dpi=150)
    
    colors = ['#059669', '#ef4444']
    wedges, texts, autotexts = ax.pie(
        df_toss['percentage'], 
        labels=df_toss['outcome'], 
        autopct='%1.1f%%',
        startangle=90, 
        colors=colors,
        textprops=dict(color='#f8fafc', weight='bold', size=9),
        wedgeprops=dict(width=0.4, edgecolor='#0d1425', linewidth=2) # Donut style
    )
    
    for autotext in autotexts:
        autotext.set_size(10)
        autotext.set_color('#ffffff')

    ax.set_title('Toss Win Impact on Match Victory', pad=20, weight='bold', size=12)
    plt.tight_layout()
    
    plot_path = os.path.join(output_dir, 'toss_impact_pie.png')
    plt.savefig(plot_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"    -> Saved Toss Impact chart to: {plot_path}")

def plot_top_batters(df_batters, output_dir):
    apply_dark_theme()
    fig, ax = plt.subplots(figsize=(8, 5), dpi=150)
    
    top_10 = df_batters.head(10).sort_values(by='runs_off_bat', ascending=True)
    
    bars = ax.barh(
        top_10['batter'], 
        top_10['runs_off_bat'], 
        color='#fbbf24', 
        height=0.6,
        edgecolor='none'
    )
    
    # Highlight the #1 batter
    bars[-1].set_color('#10b981')
    
    # Add values on end of bars
    for bar in bars:
        width = bar.get_width()
        ax.text(
            width + 12, 
            bar.get_y() + bar.get_height()/2, 
            f'{int(width)}', 
            ha='left', 
            va='center', 
            size=8, 
            weight='bold',
            color='#fbbf24'
        )

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#1e293b')
    ax.spines['bottom'].set_color('#1e293b')
    ax.set_title('IPL High-Performer Board (Top 10 Batters)', pad=15, weight='bold', size=12)
    ax.set_xlabel('Total Runs', size=9)
    plt.tight_layout()
    
    plot_path = os.path.join(output_dir, 'top_batters_bar.png')
    plt.savefig(plot_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"    -> Saved Top Batters chart to: {plot_path}")

def plot_top_bowlers(df_bowlers, output_dir):
    apply_dark_theme()
    fig, ax = plt.subplots(figsize=(8, 5), dpi=150)
    
    top_10 = df_bowlers.head(10)
    
    bars = ax.bar(
        top_10['bowler'], 
        top_10['wickets'], 
        color='#059669', 
        width=0.5,
        edgecolor='none'
    )
    
    # Highlight #1 bowler
    bars[0].set_color('#10b981')
    
    # Add values on top of bars
    for bar in bars:
        yval = bar.get_height()
        ax.text(
            bar.get_x() + bar.get_width()/2, 
            yval + 0.4, 
            f'{int(yval)}', 
            ha='center', 
            va='bottom', 
            size=8, 
            weight='bold',
            color='#10b981'
        )

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#1e293b')
    ax.spines['bottom'].set_color('#1e293b')
    ax.set_title('Top 10 Bowlers (Wickets Secured)', pad=15, weight='bold', size=12)
    ax.set_ylabel('Total Wickets', size=9)
    plt.xticks(rotation=30, ha='right', size=8)
    plt.tight_layout()
    
    plot_path = os.path.join(output_dir, 'top_bowlers_bar.png')
    plt.savefig(plot_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"    -> Saved Top Bowlers chart to: {plot_path}")

def plot_season_trends(df_season, output_dir):
    apply_dark_theme()
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)
    
    ax.plot(
        df_season['season'], 
        df_season['avg_match_runs'], 
        marker='o', 
        linewidth=2.5, 
        color='#10b981', 
        markersize=6,
        label='Average Match Score'
    )
    
    # Fill under curve
    ax.fill_between(
        df_season['season'], 
        df_season['avg_match_runs'], 
        color='#10b981', 
        alpha=0.15
    )

    for i, txt in enumerate(df_season['avg_match_runs']):
        ax.annotate(
            f'{txt}', 
            (df_season['season'].iloc[i], df_season['avg_match_runs'].iloc[i] + 4),
            ha='center', 
            size=8, 
            weight='bold', 
            color='#10b981'
        )

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#1e293b')
    ax.spines['bottom'].set_color('#1e293b')
    ax.set_title('IPL Season-by-Season Average Score Trends', pad=15, weight='bold', size=12)
    ax.set_ylabel('Average Total Runs', size=9)
    ax.set_ylim(min(df_season['avg_match_runs']) - 20, max(df_season['avg_match_runs']) + 30)
    plt.tight_layout()
    
    plot_path = os.path.join(output_dir, 'season_trends_line.png')
    plt.savefig(plot_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"    -> Saved Season Trends chart to: {plot_path}")

def plot_phase_heatmap(df_deliveries, output_dir):
    """
    Generate a heatmap of Average Run Rate in each phase by top teams.
    """
    apply_dark_theme()
    fig, ax = plt.subplots(figsize=(8, 5), dpi=150)
    
    # Filter for top 6 teams by run volume
    top_teams = df_deliveries.groupby('batting_team')['total_runs'].sum().nlargest(6).index
    df_filtered = df_deliveries[df_deliveries['batting_team'].isin(top_teams)]
    
    # Pivot to get Run Rate (total_runs/balls * 6) per phase per team
    # Calculate runs
    pivot_runs = df_filtered.pivot_table(index='batting_team', columns='phase', values='total_runs', aggfunc='sum')
    # Calculate balls faced (extra_runs == 0)
    pivot_balls = df_filtered[df_filtered['extra_runs'] == 0].pivot_table(index='batting_team', columns='phase', values='total_runs', aggfunc='count')
    
    # Calculate Run Rate
    pivot_rr = np.round((pivot_runs / pivot_balls) * 6, 2)
    
    # Sort columns chronologically
    cols = ['Powerplay', 'Middle', 'Death']
    pivot_rr = pivot_rr[cols]
    
    # Render heatmap using imshow
    im = ax.imshow(pivot_rr, cmap='YlOrRd', aspect='auto')
    
    # Show values inside cells
    for i in range(len(pivot_rr.index)):
        for j in range(len(cols)):
            ax.text(
                j, i, 
                f'{pivot_rr.iloc[i, j]:.2f}', 
                ha='center', 
                va='center', 
                color='#0f172a' if pivot_rr.iloc[i, j] > 8.5 else '#f8fafc',
                weight='bold', 
                size=9
            )

    # Set labels
    ax.set_xticks(np.arange(len(cols)))
    ax.set_yticks(np.arange(len(pivot_rr.index)))
    ax.set_xticklabels(cols, size=8)
    # Shorten team names for visual fit
    team_labels = [str(team).replace('Super Kings', 'CSK').replace('Indians', 'MI').replace('Bangalore', 'RCB').replace('Knight Riders', 'KKR').replace('Capitals', 'DC').replace('Titans', 'GT').replace('Royals', 'RR').replace('Giants', 'LSG').replace('Kings', 'PBKS').replace('Hyderabad', 'SRH') for team in pivot_rr.index]
    ax.set_yticklabels(team_labels, size=8)
    
    # Remove grid lines just for heatmap
    ax.grid(False)
    
    # Colorbar
    cbar = fig.colorbar(im, ax=ax)
    cbar.ax.tick_params(labelsize=8)
    cbar.set_label('Runs Per Over (RPO)', size=9)

    ax.set_title('Game Phase Run Rate Heatmap by Squads', pad=20, weight='bold', size=12)
    plt.tight_layout()
    
    plot_path = os.path.join(output_dir, 'phase_heatmap.png')
    plt.savefig(plot_path, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print(f"    -> Saved Phase Heatmap to: {plot_path}")
