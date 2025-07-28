# Import required libraries
import sys
import pandas as pd
import statistics

# Read the CSV file containing experimental data
df = pd.read_csv('new_SPR_QR_ITA_all_results_allinfo.csv')

# Get lists of participants and items
participants = df['ParticipantID'].to_list()
items = df['item_ID'].to_list()

# Initialize dictionary to store new calculated metrics
newinfo = {}
newinfo['last_word_context'] = []  # RT for last word in context region
newinfo['overall_context'] = []    # Sum of RTs for entire context region
newinfo['overall_mean_context'] = []  # Mean RT for context region
newinfo['overall_mean_target'] = []   # Mean RT for target region

# Print total number of items for verification
print(len(items), len(participants))

# Process each participant-item combination to calculate metrics
for i, el in enumerate(participants):
    # Print progress every 10 items
    if i%10 == 0:
        print(i,'/',len(participants))
    
    # Find index of last word in context based on quantifier type
    if df['type_first'][i] == 'ALL':
        ind_lwt = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'first_Region7')].tolist()[0]
    if df['type_first'][i] == 'EVERY':
        ind_lwt = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'first_Region6')].tolist()[0]
    newinfo['last_word_context'].append(df['RT'][ind_lwt])

    # Find first word in context region
    firstwordcontextindex = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'first_Region1')].tolist()[0]

    # Calculate sum of RTs for entire context region
    summ = sum(df['RT'][firstwordcontextindex:ind_lwt+1].to_list())
    newinfo['overall_context'].append(summ)

    # Calculate mean RT for context region
    meancont = statistics.mean(df['RT'][firstwordcontextindex:ind_lwt+1].to_list())
    newinfo['overall_mean_context'].append(meancont)

    # Find last word in target region based on type
    if df['type_second'][i] == 'DIST':
        ind_lwt = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'second_Region9')].tolist()[0]
    if df['type_second'][i] == 'COLL':
        ind_lwt = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'second_Region8')].tolist()[0]
    
    # Find first word in target region
    firstwordtargetindex = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'second_Region1')].tolist()[0]

    # Calculate mean RT for target region
    meanter = statistics.mean(df['RT'][firstwordtargetindex:ind_lwt+1].to_list())
    newinfo['overall_mean_target'].append(meanter)

# Create DataFrame from calculated metrics
df2 = pd.DataFrame.from_dict(newinfo)
print(df2)

# Insert new metrics into main DataFrame
df.insert(22, 'last_word_context', newinfo['last_word_context'], True)
df.insert(22, 'overall_context', newinfo['overall_context'], True)
df.insert(22, 'overall_mean_context', newinfo['overall_mean_context'], True)
df.insert(22, 'overall_mean_target', newinfo['overall_mean_target'], True)

print(df)

# Save updated DataFrame to CSV
df.to_csv('mean_overalls_SPR_QR_ITA_all_results_allinfo.csv', index=False)

# Exit script (the following code appears to be unused in normal execution)
sys.exit()

# The following section appears to be for creating a separate analysis
# Read the reduced data file
df = pd.read_csv('reduced_SPR_QR_ITA_all_results_allinfo.csv')

print(df.keys())

# Create dictionary for general types
newinfo = {}
newinfo['gen_type'] = []

# Classify each item based on combination of first and second types
for i, el in enumerate(df['List']):
    if df['type_first'][i] == 'ALL':
        if df['type_second'][i] == 'COLL':
            newinfo['gen_type'].append('ALL_COLL')
        else:
            newinfo['gen_type'].append('ALL_DIST')
    else:
        if df['type_second'][i] == 'COLL':
            newinfo['gen_type'].append('EVERY_COLL')
        else:
            newinfo['gen_type'].append('EVERY_DIST')

# Insert general type column into DataFrame
df.insert(2, "gen_type", newinfo['gen_type'], True)

print(df)

# Save DataFrame with general types to CSV
df.to_csv('gen_type_SPR_QR_ITA_all_results_allinfo.csv', index=False)