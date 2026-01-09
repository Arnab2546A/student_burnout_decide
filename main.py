import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.tree import DecisionTreeClassifier

# 1. Load the dataset
# Ensure the file is in the same folder as your script
df = pd.read_csv('stress_level_dataset.csv') #df=dataframe

# 2. Check the first 5 rows (The 'Head')
# print("--- First 5 Rows ---")
# print(df.head())

# 3. Check the last 5 rows (The 'Tail')
# print("\n--- Last 5 Rows ---")
# print(df.tail())

# 4. Check Data Summary (Columns, Null values, Data types)
# print("\n--- Data Information ---")
# df.info()

# 5. Statistical Summary
# print("\n--- Statistical Summary ---")
# print(df.describe())

# Set the visual style
# sns.set(style="whitegrid")

# --- Plot 1: Target Distribution ---
# This shows how many students fall into each stress category.
# plt.figure(figsize=(8, 5))
# sns.countplot(x='stress_level', data=df, palette='Set2')
# plt.title('Count of Students per Stress Level')
# plt.xlabel('Stress Level (0=Low, 1=Medium, 2=High)')
# plt.ylabel('Number of Students')
# plt.show()

# --- Plot 2: Correlation Heatmap ---
# This helps us see which factors (like sleep or study load) are strongly related to stress.
# plt.figure(figsize=(12, 8))
# correlation_matrix = df.corr()
# sns.heatmap(correlation_matrix, annot=False, cmap='coolwarm')
# plt.title('Feature Correlation Heatmap')
# plt.show()
   
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

# 2. MODEL 1: RANDOM FOREST (RF)
# 100 decision trees combined
# ==========================================
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_scaled, y_train)
rf_pred = rf_model.predict(X_test_scaled)
rf_acc = accuracy_score(y_test, rf_pred)
# 3. MODEL 2: DECISION TREE (DT)
# ==========================================
dt_model = DecisionTreeClassifier(random_state=42)
dt_model.fit(X_train_scaled, y_train)
dt_pred = dt_model.predict(X_test_scaled)
dt_acc = accuracy_score(y_test, dt_pred)

# 4. COMPARISON & EVALUATION
# ==========================================
print("\n" + "="*30)
print(f"Random Forest Accuracy: {rf_acc * 100:.2f}%")
print(f"Decision Tree Accuracy: {dt_acc * 100:.2f}%")
print("="*30)

# Determine the winner
if rf_acc > dt_acc:
    print("\nWINNER: Random Forest is more accurate!")
    best_model = rf_model
    best_preds = rf_pred
else:
    print("\nWINNER: Decision Tree is more accurate!")
    best_model = dt_model
    best_preds = dt_pred

# Show Detailed Report for the Best Model
print(f"\nDetailed Report for the Best Model:")
print(classification_report(y_test, best_preds))

# 5. VISUALIZATION
# ==========================================

# Plot 1: Confusion Matrix for Best Model
plt.figure(figsize=(8, 6))
sns.heatmap(confusion_matrix(y_test, best_preds), annot=True, fmt='d', cmap='Greens')
plt.title('Confusion Matrix (Best Model)')
plt.xlabel('Predicted Label')
plt.ylabel('Actual Label')
plt.show()

# Plot 2: Feature Importance (What causes the most stress?)
importances = best_model.feature_importances_
indices = np.argsort(importances)

plt.figure(figsize=(10, 8))
plt.title('Top Factors Driving Student Burnout')
plt.barh(range(len(indices)), importances[indices], color='salmon', align='center')
plt.yticks(range(len(indices)), [X.columns[i] for i in indices])
plt.xlabel('Importance Score')
plt.tight_layout()
plt.show()