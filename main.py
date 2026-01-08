import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


# 1. Load the dataset
# Ensure the file is in the same folder as your script
df = pd.read_csv('stress_level_dataset.csv') #df=dataframe

# 2. Check the first 5 rows (The 'Head')
print("--- First 5 Rows ---")
print(df.head())

# 3. Check the last 5 rows (The 'Tail')
print("\n--- Last 5 Rows ---")
print(df.tail())

# 4. Check Data Summary (Columns, Null values, Data types)
print("\n--- Data Information ---")
df.info()

# 5. Statistical Summary
print("\n--- Statistical Summary ---")
print(df.describe())

# Set the visual style
sns.set(style="whitegrid")

# --- Plot 1: Target Distribution ---
# This shows how many students fall into each stress category.
plt.figure(figsize=(8, 5))
sns.countplot(x='stress_level', data=df, palette='Set2')
plt.title('Count of Students per Stress Level')
plt.xlabel('Stress Level (0=Low, 1=Medium, 2=High)')
plt.ylabel('Number of Students')
plt.show()

# --- Plot 2: Correlation Heatmap ---
# This helps us see which factors (like sleep or study load) are strongly related to stress.
plt.figure(figsize=(12, 8))
correlation_matrix = df.corr()
sns.heatmap(correlation_matrix, annot=False, cmap='coolwarm')
plt.title('Feature Correlation Heatmap')
plt.show()
   
# 1. Separate Features (X) and Target (y)
# X = everything EXCEPT the result (stress_level)
# y = ONLY the result we want to predict
X = df.drop('stress_level', axis=1)
y = df['stress_level']

# 2. Split the data into Training and Testing sets
# We use 80% for training (teaching the model) 
# and 20% for testing (checking its "exam" performance)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)


# 3. Feature Scaling (Standardization)
# ML models perform better when numbers are on the same scale (e.g., between -3 and 3)
# instead of having some columns like 'anxiety' at 20 and 'mental_health' at 0.1.
scaler = StandardScaler()

# We "fit" the scaler on training data and then transform both
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


print("--- Preprocessing Complete ---")
print(f"Total samples: {len(df)}")
print(f"Training set: {X_train_scaled.shape[0]} samples")
print(f"Testing set: {X_test_scaled.shape[0]} samples")