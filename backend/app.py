from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd # Import pandas to handle feature names
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the saved model and scaler
model = joblib.load('burnout_model.pkl')
scaler = joblib.load('scaler.pkl')

# Define the EXACT order of columns as they appear in stress_level_dataset.csv
# This ensures that even if React sends them slightly differently, we fix the order here.
FEATURE_COLUMNS = [
    'anxiety_level', 'self_esteem', 'mental_health_history', 'depression',
    'headache', 'blood_pressure', 'sleep_quality', 'breathing_problem',
    'noise_level', 'living_conditions', 'safety', 'basic_needs',
    'academic_performance', 'study_load', 'teacher_student_relationship',
    'future_career_concerns', 'social_support', 'peer_pressure',
    'extracurricular_activities', 'bullying'
]

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # 1. Get data from React
        input_data = request.json['features'] 
        
        # 2. Convert to DataFrame to include feature names
        # This fixes the "UserWarning" and ensures the scaler works correctly
        input_df = pd.DataFrame([input_data], columns=FEATURE_COLUMNS)
        
        # 3. Scale the input data
        scaled_data = scaler.transform(input_df)
        
        # 4. Make prediction
        prediction = model.predict(scaled_data)
        
        # Debugging: Print to your console to see what is happening
        print(f"Features Received: {input_data}")
        print(f"Prediction Result: {prediction[0]}")
        
        # 5. Return the result
        return jsonify({'stress_level': int(prediction[0])})
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': str(e)}), 400

@app.route('/')
def health_check():
    return jsonify({'status': 'ok', 'message': 'Backend is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)