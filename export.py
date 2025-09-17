import pandas as pd

# Load the Excel file
xlsx_file = "experiment.xlsx"  # Replace with your actual file name
df = pd.read_excel(xlsx_file)

# Drop rows where 'item' is empty or not an integer
df_filtered = df[pd.to_numeric(df["item"], errors="coerce").notna()]

# Columns 'no' and 'item' should be integers
df_filtered = df_filtered.copy()
df_filtered['item'] = pd.to_numeric(df_filtered['item'], errors='coerce').astype('Int64')
df_filtered['no'] = pd.to_numeric(df_filtered['no'], errors='coerce').astype('Int64')


# Save to CSV
csv_file = "experiment_data.csv"
df_filtered.to_csv(csv_file, index=False)

print(f"Filtered data saved to {csv_file}!")

############################################

# Load the Excel file
xlsx_file = "practice.xlsx"  # Replace with your actual file name
df = pd.read_excel(xlsx_file)

# Drop rows where 'item' is empty or not an integer
df_filtered = df[pd.to_numeric(df["item"], errors="coerce").notna()]

# Columns 'no' and 'item' should be integers
df_filtered = df_filtered.copy()
df_filtered['item'] = pd.to_numeric(df_filtered['item'], errors='coerce').astype('Int64')

# Save to CSV
csv_file = "practice.csv"
df_filtered.to_csv(csv_file, index=False)

print(f"Filtered practice data saved to {csv_file}!")