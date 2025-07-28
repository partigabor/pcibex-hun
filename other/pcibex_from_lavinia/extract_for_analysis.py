# Import required libraries
import sys
import pandas as pd
import os
import csv

# Define source directory and read CSV file into a DataFrame
#sourdir = 'C:/Users/user/Documents/RA/italian/lists_xonline/xonline/'
sourdir = "C:/Users/user/Documents/RA/all_every/RT_ratings_ITA1.csv"

# Read CSV 
df = pd.read_csv(sourdir)

# !!!! DELETE THIS LINE
# we dropped the lines without "type second" because in this analysis we didn't consider those "single sentences"
#       --> which are actually YOUR target... so you can just delete the drop 
df = df.drop(df[df.type_second == 'none'].index)

# Create dictionary to store item information from the DataFrame
iteminfo = {}
iteminfo['item_ID'] = df['item_ID'].to_list()
iteminfo['sent_ID'] = df['No.'].to_list()
iteminfo['type_first'] = df['type_first'].to_list()
iteminfo['type_second'] = df['type_second'].to_list()

# Initialize lists to store lengths of first and second regions
iteminfo['len_first'] = []
iteminfo['len_second'] = []

# Calculate length of first region by counting non-'none' regions
for index, row in df.iterrows():
    for n in range(1,9):
        if row['first_Region'+str(n)] == 'none':
            iteminfo['len_first'].append(n-1)
            break

# Calculate length of second region by counting non-'none' regions
for index, row in df.iterrows():
    for n in range(1,10): 
        print(n, row['second_Region'+str(n)])
        if row['second_Region9'] != 'none':
            iteminfo['len_second'].append(9)
            break      
        if row['second_Region'+str(n)] == 'none':
            iteminfo['len_second'].append(n-1)
            break  

# Define directory containing list files and get list of files
listsdir = "C:/Users/user/Documents/RA/all_every/stat_an/data/downloaded_data/"
files = os.listdir(listsdir)

# Initialize dictionaries to store experimental data and demographic information
xpandas = {}
xpandas['List'] = []
xpandas['ParticipantID'] = []
xpandas['item_ID'] = []         # nel file = 'sent_ID'

xpandas['type_first'] = []
xpandas['type_second'] = []
xpandas['RegionN'] = []
xpandas['Value'] = []
xpandas['RT'] = []

xpandas['email'] = []
xpandas['year'] = []
xpandas['gender'] = []
xpandas['hand'] = []
xpandas['education'] = []
xpandas['major'] = []
xpandas['dialect'] = []
xpandas['city'] = []
xpandas['foreign_lang'] = []
xpandas['books'] = []

demographic = {}
demographic['ParticipantID'] = []
demographic['list'] = []
demographic['email'] = []
demographic['year'] = []
demographic['gender'] = []
demographic['hand'] = []
demographic['education'] = []
demographic['major'] = []
demographic['dialect'] = []
demographic['city'] = []
demographic['foreign_lang'] = []
demographic['books'] = []

# Process each file in the directory
for f in files:
    print(f)
    path = listsdir+f
    file = open(path)
    csvreader = csv.reader(file)
    allines = list(csvreader)    

    # Extract demographic information from the file
    for n, line in enumerate(allines):
        # demographic
        if len(line)>5:
            if line[5] == 'Contacts':
                if line[9] == 'Final':
                    if line[8] == 'input_email':
                        demographic['email'].append(line[10])
                        email=line[10]
        
        if len(line) == 22:
            if line[5] == 'Demographic':
                if line[9] == 'Final':
                    info = line[10]
                    if line[8] == 'input_year':
                        demographic['year'].append(info)
                        year=info
                    if line[8] == 'input_gender':
                        demographic['gender'].append(info)
                        gender=info
                    if line[8] == 'input_hand':
                        demographic['hand'].append(info)
                        hand=info
                    if line[8] == 'input_education':
                        demographic['education'].append(info)
                        edu=info
                    if line[8] == 'input_major':
                        demographic['major'].append(info)
                        major=info
                    if line[8] == 'input_dialect':
                        demographic['dialect'].append(info)
                        dial=info
                    if line[8] == 'input_city':
                        demographic['city'].append(info)
                        city=info
                    if line[8] == 'input_foreign_lang':
                        demographic['foreign_lang'].append(info)
                        forlan=info
                    if line[8] == 'input_books':
                        demographic['books'].append(info)
                        books=info
                        demographic['ParticipantID'].append(line[1])
                        demographic['list'].append(f[:5])
                
        # Skip lines that don't have 16 elements
        if len(line) != 16:
            continue

        # Skip 'Start' and 'End' markers
        if line[10] in ['Start','End']:
            new = True
            continue

        # Skip practice trials
        if 'PracticeTrial 01' in line:
            continue

        # Skip 'tbf' lines
        if 'tbf' in line:
            continue

        # Calculate reaction time (RT) as difference between current and previous timestamps
        RT = int(line[11])-int(allines[n-1][11])
        if RT <0:
            print(n,"*****",int(allines[n-1][11])-int(line[11]))
        xpandas['RT'].append(RT)

        # Append demographic info to experimental data
        xpandas['email'].append(email)
        xpandas['year'].append(year)
        xpandas['gender'].append(gender)
        xpandas['hand'].append(hand)
        xpandas['education'].append(edu)
        xpandas['major'].append(major)
        xpandas['dialect'].append(dial)
        xpandas['city'].append(city)
        xpandas['foreign_lang'].append(forlan)
        xpandas['books'].append(books)

        # Append list and participant info
        xpandas['List'].append(f[:5])
        xpandas['ParticipantID'].append(line[1])

        # Get index of current item in iteminfo
        indx = iteminfo['item_ID'].index(int(line[-2]))
        
        # Process region information
        if line[8] == '1%2C2%2C3%2C4%2C5%2C6%2C7':
            xpandas['RegionN'].append("Choice")
            xpandas['Value'].append(line[10])
            new = True
        else:
            # Handle region numbering based on sentence structure
            if new:
                leng = iteminfo['len_first'][indx]
                xpandas['RegionN'].append("first_Region1")
                xpandas['Value'].append("NA")
                new = False
            else:
                leng = leng-1
                if leng <= 0:
                    if leng ==0:
                        xpandas['RegionN'].append('second_Region1')
                        xpandas['Value'].append("NA")
                    else:
                        posnumb = int(xpandas['RegionN'][-1][-1])+1
                        xpandas['RegionN'].append('second_Region'+str(posnumb))
                        xpandas['Value'].append("NA")
                if leng > 0:
                    posnumb = int(xpandas['RegionN'][-1][-1])+1
                    xpandas['RegionN'].append('first_Region'+str(posnumb))
                    xpandas['Value'].append("NA")

        # Append item information
        xpandas['item_ID'].append(line[-2])        
        xpandas['type_first'].append(iteminfo['type_first'][indx])
        xpandas['type_second'].append(iteminfo['type_second'][indx])

# Print unique emails (for debugging/verification)
emm = set(xpandas['email'])
for el in emm:
    print(el)

# Create DataFrame from experimental data and remove duplicates
df=pd.DataFrame.from_dict(xpandas)
print(len(df))
df=df.drop_duplicates()
print(df['RT'])

# Adjust reaction times for first regions
for i, el in enumerate(df['RegionN']):
    if el in ['first_Region1','second_Region1']:
        #print("---",df['RT'][i])
        df['RT'][i] = df['RT'][i]-1500
        #print(df['RT'][i])
        if el == 'first_Region1':
            df['RT'][i]=df['RT'][i]-700
            #print(df['RT'][i])

print(df['RT'])

# Create subset of data for verification
subs = df[["email","RT"]]

# Initialize dictionary for additional information to be calculated
newinfo = {}
newinfo['last_word_target'] = []
newinfo['overall_target'] = []

newinfo['quantifier_context'] = [] 
newinfo['noun_context'] = []

newinfo['noun_target'] = []


# Get lists of participants and items
participants = df['ParticipantID'].to_list()
items = df['item_ID'].to_list()
print('check', len(participants), len(items))
done = {}

# Calculate additional metrics for each participant-item combination
for i, el in enumerate(participants):
    # las tword se dist e 9, se e coll e 8
    if i%10==0:
        print(i)
    # Find index of last word in target based on type
    if df['type_second'][i] == 'DIST':
        ind_lwt = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'second_Region9')].tolist()[0]
    if df['type_second'][i] == 'COLL':
        ind_lwt = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'second_Region8')].tolist()[0]
    newinfo['last_word_target'].append(df['RT'][ind_lwt])

    # Calculate sum of RTs for entire target region
    firstwordtargetindex = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'second_Region1')].tolist()[0]
    summ = sum(df['RT'][firstwordtargetindex:ind_lwt+1].to_list())
    newinfo['overall_target'].append(summ)

    # Get RT for quantifier in context
    ind_quant = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'first_Region1')].tolist()[0]
    newinfo['quantifier_context'].append(df['RT'][ind_quant])

    # Get RT for noun in context (different positions based on type)
    if df['type_first'][i] == 'ALL':
        ind_noun = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'first_Region3')].tolist()[0]
    if df['type_first'][i] == 'COLL':
        ind_noun = df.index[(df['ParticipantID'] == el) & (df['item_ID'] == items[i]) & (df['RegionN'] == 'first_Region2')].tolist()[0]
    newinfo['noun_context'].append(df['RT'][ind_noun])

# Print lengths of calculated metrics for verification
for k in newinfo:
    print(k, len(newinfo[k]))

# Create DataFrame from new metrics and add them to main DataFrame
df2 = pd.DataFrame.from_dict(newinfo)
print(df2)

# Insert new columns into main DataFrame
df.insert(18, 'last_word_target', newinfo['last_word_target'], True)
df.insert(18, 'overall_target', newinfo['overall_target'], True)
df.insert(18, 'quantifier_context', newinfo['quantifier_context'], True)
df.insert(18, 'noun_context', newinfo['noun_context'], True)

print(df)
print(df.keys())

# Create reduced DataFrame with first row for each participant-item combination
newdf1 = df.groupby(['ParticipantID', 'item_ID']).first() 
print(newdf1) 

# Save reduced DataFrame to CSV
newdf1.to_csv('reduced_SPR_QR_ITA_all_results_allinfo.csv', index=False)

sys.exit()


# Create and save demographic DataFrame
dfdemo = pd.DataFrame.from_dict(demographic)
dfdemo=dfdemo.drop_duplicates()
print(dfdemo)
dfdemo.to_csv('SPR_QR_ITA_demographic.csv')