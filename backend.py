from flask import Flask, jsonify
from flask_cors import CORS
from collections import defaultdict
from datetime import datetime
import csv

app = Flask(__name__)
CORS(app)

def load_data_from_local():
    try:
        observations = []
        with open('data.csv', 'r', encoding='utf-8') as file:
            csv_reader = csv.DictReader(file, delimiter='\t')
            
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
                    "time": row["time"],
                    "brightness": int(row['brightness']),
                    "weather": row['weather'],
                    "intensity": int(row['intensity'])
                }
                observations.append(observation)
        
        print(f"Успешно загружено {len(observations)} наблюдений")
        return observations
        
    except Exception as e:
        print(f"Ошибка загрузки локального файла: {e}")
        

def process_observations():
    observations = load_data_from_local()
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
    
    return result

@app.route('/')
def home():
    return jsonify({"message": "Local CSV Observations API", "endpoint": "/api/data"})

@app.route('/api/data')
def get_grouped_data():
    processed_data = process_observations()
    return jsonify({
        "data": processed_data,
        "total_dates": len(processed_data)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)