# IPL InsightX — Python Data Engine

A modular Python data-processing, feature engineering, and visualization pipeline that cleans IPL match logs, extracts metrics, and renders dark-themed charts.

## Project Structure
- `/data`: Folder containing CSV logs (`matches.csv`, `deliveries.csv`). Auto-generated on first run if missing.
- `/output/plots`: Rendered high-resolution dark-themed PNG charts.
- `/output/stats`: Calculation tables exported in CSV format.
- `/src/cleaner.py`: Standardizes column formatting and cleans rows.
- `/src/features.py`: Computes batting strike rates, bowling economies, and over categories.
- `/src/analytics.py`: Performs statistical aggregations (wins, toss impact, seasons).
- `/src/visualizer.py`: Renders high-quality charts using Matplotlib.
- `/src/mock_generator.py`: Generates mock IPL datasets for testing.
- `/src/main.py`: Pipeline orchestrator script.

## Setup Instructions

1. **Verify Python Installation**:
   Ensure you have Python 3.8+ installed.

2. **Install Dependencies**:
   Navigate to `/python_engine` and run:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Data Engine**:
   Execute the orchestration script:
   ```bash
   python src/main.py
   ```

Upon completion, all processed CSV records will be written to `/output/stats/` and rendered visual graphs will be saved to `/output/plots/`.
