import pandas as pd
import numpy as np

def clean_matches_data(file_path):
    print(f"[+] Cleaning match dataset from: {file_path}")
    df = pd.read_csv(file_path)

    # 1. Normalize column headers: stripped and lowercase
    df.columns = df.columns.str.strip().str.lower()

    # 2. Remove duplicates
    duplicate_count = df.duplicated().sum()
    if duplicate_count > 0:
        print(f"    -> Removing {duplicate_count} duplicate match rows.")
        df.drop_duplicates(inplace=True)

    # 3. Handle missing values
    # Impute missing 'city' based on 'venue' if possible
    if 'city' in df.columns and 'venue' in df.columns:
        missing_city_mask = df['city'].isna()
        if missing_city_mask.any():
            def extract_city(venue):
                if pd.isna(venue):
                    return 'Unknown'
                parts = str(venue).split(', ')
                return parts[1] if len(parts) > 1 else str(venue)
            
            df.loc[missing_city_mask, 'city'] = df.loc[missing_city_mask, 'venue'].apply(extract_city)
            print(f"    -> Filled {missing_city_mask.sum()} missing city values using venue details.")

    # Fill default player_of_match or umpire records if blank
    for col in ['player_of_match', 'winner']:
        if col in df.columns:
            df[col] = df[col].fillna('No Result')

    # 4. Correct data types
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
        # Drop rows where date is completely invalid/missing
        df.dropna(subset=['date'], inplace=True)

    if 'id' in df.columns:
        df['id'] = df['id'].astype(int)

    return df

def clean_deliveries_data(file_path):
    print(f"[+] Cleaning delivery dataset from: {file_path}")
    df = pd.read_csv(file_path)

    # 1. Normalize headers
    df.columns = df.columns.str.strip().str.lower()

    # 2. Remove duplicates
    duplicate_count = df.duplicated().sum()
    if duplicate_count > 0:
        print(f"    -> Removing {duplicate_count} duplicate delivery entries.")
        df.drop_duplicates(inplace=True)

    # 3. Handle missing values
    # Fill empty player_dismissed, dismissal_kind, fielder with empty strings instead of NaN
    string_cols = ['player_dismissed', 'dismissal_kind', 'fielder', 'batter', 'bowler', 'non_striker']
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].fillna('').str.strip()

    # Fill numerical fields
    num_cols = ['runs_off_bat', 'extra_runs', 'total_runs']
    for col in num_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)

    return df
