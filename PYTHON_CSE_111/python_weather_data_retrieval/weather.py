import os
import requests
import csv
from datetime import datetime

API_KEY = "dea7d385660914c914dfd7d319b0d3f3"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
FILE_NAME = "PYTHON_CSE_111/python_weather_data_retrieval/weatherdata_history.csv"


def get_weather_data(location, api_key):
    params = {"q": location, "appid": api_key}
    try:
        response = requests.get(BASE_URL, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: API returned status code {response.status_code}")
            return None
    except Exception:
        print("Error: Unable to connect to the weather API.")
        return None


def is_data_ok(data):
    if not data:
        return False
    return "main" in data and "weather" in data and "name" in data


def save_to_csv(data):
    try:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        location = data["name"]
        temp = data["main"]["temp"] - 273.15
        weather = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]

        file_exists = os.path.exists(FILE_NAME)

        with open(FILE_NAME, "a", newline="") as csv_file:
            writer = csv.writer(csv_file)
            if not file_exists:
                writer.writerow(["Time", "Location", "Temperature (C)", "Weather", "Humidity"])
            writer.writerow([current_time, location, f"{temp:.1f}", weather, humidity])

        print(f"Data saved successfully to {FILE_NAME}")

    except PermissionError:
        print("Error: Permission denied when saving the file. Please close it if it is open.")
    except Exception as e:
        print(f"Unexpected error while saving data: {e}")


def get_save_choice():
    while True:
        choice = input("Do you want to save this data to weatherdata.csv? (save/skip): ").lower().strip()
        if choice in ["save", "skip"]:
            return choice
        print("Invalid input. Please enter 'save' or 'skip'.")


def main():
    while True:
        location = input("\nEnter a city or country for weather data (e.g., 'London' or 'London,UK'), or 'quit' to stop: ")
        if location.lower().strip() == "quit":
            print("Goodbye!")
            break

        location = location.strip()
        if not location:
            print("Error: Please enter a valid city or country.")
            continue

        data = get_weather_data(location, API_KEY)

        # Early check for missing or failed data
        if not data:
            print("Error: Could not fetch data. Please check your internet or the city name.")
            continue

        # Then check for data structure validity
        if is_data_ok(data):
            city = data["name"]
            temp = data["main"]["temp"] - 273.15
            weather = data["weather"][0]["description"]
            humidity = data["main"]["humidity"]

            print(f"\nWeather for {city}:")
            print(f"Temperature: {temp:.1f}°C")
            print(f"Weather: {weather}")
            print(f"Humidity: {humidity}%")

            save_choice = get_save_choice()
            if save_choice == "save":
                save_to_csv(data)
                print(f"Data saved to {FILE_NAME}")
            else:
                print("Data not saved.")
        else:
            print("Error: Invalid or incomplete data received. Try another location.")



if __name__ == "__main__":
    main()
