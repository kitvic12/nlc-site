import requests
import json

def check_local_api():
    # Если твой локальный сервер работает на другом порту, 
    # укажи его, например: "http://localhost:8000/api/weather"
    url = "http://localhost:5000/api/weather" 
    
    print(f"Отправляем запрос на {url}...")
    
    try:
        response = requests.get(url)
        response.raise_for_status()  # Вызовет ошибку, если статус не 200
        
        print(f"✅ Статус ответа: {response.status_code}")
        print("📦 Данные:")
        
        # Пытаемся распарсить как JSON и вывести красиво
        try:
            data = response.json()
            print(json.dumps(data, indent=4, ensure_ascii=False))
        except ValueError:
            # Если сервер вернул не JSON, а просто текст/HTML
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Ошибка: Не удалось подключиться. Убедись, что локальный сервер запущен!")
    except requests.exceptions.RequestException as e:
        print(f"❌ Ошибка запроса: {e}")

if __name__ == "__main__":
    check_local_api()