from flask import Flask, jsonify
from flask_cors import CORS
from collections import defaultdict
from datetime import datetime
import csv
import json

app = Flask(__name__)
CORS(app)

def load_data_from_local():
    try:
        observations = []     
        with open('data.csv', 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file, delimiter=',') 
            for row in csv_reader:
                time_str = row['time'].replace('.', ':')
                if ':' not in time_str:
                    if len(time_str) == 4:
                        time_str = time_str[:2] + ':' + time_str[2:]
                    elif len(time_str) == 3:
                        time_str = '0' + time_str[:1] + ':' + time_str[1:]
                
                observation = {
                    "name": row['name'],
                    "place": row['place'],
                    "date": row['date'],
                    "time": time_str,
                    "brightness": int(row['brightness']),
                    "weather": row['weather'],
                    "intensity": int(row['intensity'])
                }
                observations.append(observation)      
        return observations
    except Exception as e:
        print(f"Error: {e}")
        return []
    

def load_weather():
    try:
        with open("weather.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: weather.json not found")
        return {"error": "Weather data not found"}
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in weather.json - {e}")
        return {"error": "Invalid weather data format"}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": "Internal server error"}

def process_observations():
    observations = load_data_from_local()
    if not observations:
        return []
    dates_dict = defaultdict(lambda: defaultdict(list))
    for obs in observations:
        dates_dict[obs['date']][obs['name']].append(obs)
    sorted_dates = sorted(dates_dict.keys(), 
                         key=lambda x: datetime.strptime(x, '%d.%m.%Y'))
    result = []
    for date in sorted_dates:
        users_dict = dates_dict[date]
        user_data = {}
        for username, user_observations in users_dict.items():
            sorted_observations = sorted(user_observations, 
                                       key=lambda x: x['time'])     
            user_data[username] = sorted_observations
        result.append({
            "date": date,
            "users": user_data
        })
    print(result)
    return result

@app.route('/')
def home():
    return jsonify({"message": "Local CSV API", "endpoint": "/api/data"})

@app.route('/api/data')
def get_grouped_data():
    try:
        processed_data = process_observations()
        return jsonify({
            "data": processed_data,
            "total_dates": len(processed_data)
        })
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
    


@app.route('/api/weather')
def get_weather():
    return jsonify(load_weather())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)