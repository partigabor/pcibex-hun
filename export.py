import pandas as pd

############################################
# Practice
############################################

# Read in the practice sheet in experiment.xlsx into a pandas df
df = pd.read_excel("experiment.xlsx", sheet_name="practice") 

# Make sure that item and no are integers
df['item'] = pd.to_numeric(df['item'], errors='coerce').astype('Int64')
df['no'] = pd.to_numeric(df['no'], errors='coerce').astype('Int64')

# Drop rows where 'item' is empty or not an integer
df = df[pd.to_numeric(df["item"], errors="coerce").notna()]

# Drop these columns: image_pair_left	image_pair_right	vpx	definite	uncountable	remark
df = df.drop(columns=['image_pair_left', 'image_pair_right', 'vpx', 'definite', 'uncountable', 'remark'], errors='ignore')

# If 'cb' column is 'y', then switch the values of the left and right column.
df.loc[df['cb'] == 'y', ['left', 'right']] = df.loc[df['cb'] == 'y', ['right', 'left']].values

# Randomize the order of the rows in a reproducible way
# df = df.sample(frac=1, random_state=1349).reset_index(drop=True)

# Reset index
df = df.reset_index(drop=True)

# Save to CSV
csv_file = "practice.csv"
df.to_csv(csv_file, index=False)

print(f"Practice data saved to {csv_file}!")

############################################
# Live Experiment
############################################

# Read in experiment.xlsx into a pandas df
import pandas as pd

df = pd.read_excel("experiment.xlsx")

# Make sure that item and no are integers
df['item'] = pd.to_numeric(df['item'], errors='coerce').astype('Int64')
df['no'] = pd.to_numeric(df['no'], errors='coerce').astype('Int64')

# Drop rows where 'item' is empty or not an integer
df = df[pd.to_numeric(df["item"], errors="coerce").notna()]

# Drop these columns: image_pair_left	image_pair_right	vpx	definite	uncountable	remark
df = df.drop(columns=['image_pair_left', 'image_pair_right', 'vpx', 'definite', 'uncountable', 'remark'], errors='ignore')

# If 'cb' column is 'y', then switch the values of the left and right column.
df.loc[df['cb'] == 'y', ['left', 'right']] = df.loc[df['cb'] == 'y', ['right', 'left']].values

# Randomize the order of the rows in a reproducible way
df = df.sample(frac=1, random_state=1349).reset_index(drop=True)

# Reset index
df = df.reset_index(drop=True)

# Save to CSV
csv_file = "experiment_data.csv"
df.to_csv(csv_file, index=False)

print(f"Shuffled, counterbalanced data saved to {csv_file}!")
df
