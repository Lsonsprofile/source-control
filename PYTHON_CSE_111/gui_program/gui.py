
import tkinter as tk
from tkinter import messagebox, ttk
import requests
import csv
from datetime import datetime
import os

API_KEY = "dea7d385660914c914dfd7d319b0d3f3"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
FILE_NAME = "PYTHON_CSE_111/python_weather_data_retrieval/weatherdata_history.csv"

def fetch_weather(city):
    try:
        params = {'q': city, 'appid': API_KEY, 'units': 'metric'}
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        messagebox.showerror("Error", f"Failed to retrieve data: {e}")
        return None

def display_weather():
    CSV_FILE = FILE_NAME
    city = city_entry.get()
    if not city:
        messagebox.showwarning("Input Error", "Please enter a city name")
        return
    
    data = fetch_weather(city)
    if data:
        for widget in result_frame.winfo_children():
            widget.destroy()
        
        date = datetime.now().strftime("%Y-%m-%d")
        time = datetime.now().strftime("%H:%M:%S")
        temp = data['main']['temp']
        humidity = data['main']['humidity']
        wind = data['wind']['speed']
        description = data['weather'][0]['description'].title()
        feels_like = data['main']['feels_like']
        pressure = data['main']['pressure']
        
        tk.Label(result_frame, text=f"Weather in {city}:", font=("Arial", 14, "bold")).pack(anchor="w")
        date_label = tk.Label(result_frame, text=f"Date: {date}", font=("Arial", 8, "bold"))
        date_label.pack(anchor="w")
        time_label = tk.Label(result_frame, text=f"Time: {time}", font=("Arial", 8, "bold"))
        time_label.pack(anchor="w")
        tk.Label(result_frame, text=f"Temperature: {temp}°C").pack(anchor="w")
        tk.Label(result_frame, text=f"Feels Like: {feels_like}°C").pack(anchor="w")
        tk.Label(result_frame, text=f"Conditions: {description}").pack(anchor="w")
        tk.Label(result_frame, text=f"Humidity: {humidity}%").pack(anchor="w")
        tk.Label(result_frame, text=f"Wind Speed: {wind} m/s").pack(anchor="w")
        tk.Label(result_frame, text=f"Pressure: {pressure} hPa").pack(anchor="w")
        
        save_button.config(state="normal", command=lambda: save_to_csv(data))

def save_to_csv(data):
    CSV_FILE = FILE_NAME
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    city = data['name']
    temp = data['main']['temp']
    humidity = data['main']['humidity']
    wind = data['wind']['speed']
    description = data['weather'][0]['description']
    
    file_exists = os.path.isfile(CSV_FILE)
    
    with open(CSV_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(["Timestamp", "City", "Temperature (°C)", "Humidity (%)", "Wind Speed (m/s)", "Conditions"])
        writer.writerow([timestamp, city, temp, humidity, wind, description])
    
    messagebox.showinfo("Success", "Weather data saved successfully!")

def view_history():
    CSV_FILE = FILE_NAME
    if not os.path.exists(CSV_FILE):
        messagebox.showinfo("No Data", "No saved weather data found")
        return
    
    history_window = tk.Toplevel(root)
    history_window.title("Weather History")
    history_window.geometry("600x400")
    
    tree = ttk.Treeview(history_window, columns=("Timestamp", "City", "Temperature", "Humidity", "Wind", "Conditions"), show="headings")
    
    tree.heading("Timestamp", text="Timestamp")
    tree.heading("City", text="City")
    tree.heading("Temperature", text="Temp (°C)")
    tree.heading("Humidity", text="Humidity (%)")
    tree.heading("Wind", text="Wind (m/s)")
    tree.heading("Conditions", text="Conditions")
    
    tree.column("Timestamp", width=120)
    tree.column("City", width=100)
    tree.column("Temperature", width=80)
    tree.column("Humidity", width=80)
    tree.column("Wind", width=80)
    tree.column("Conditions", width=120)
    
    scrollbar = ttk.Scrollbar(history_window, orient="vertical", command=tree.yview)
    tree.configure(yscrollcommand=scrollbar.set)
    scrollbar.pack(side="right", fill="y")
    tree.pack(fill="both", expand=True)
    
    with open(CSV_FILE, 'r') as f:
        reader = csv.reader(f)
        next(reader)
        for row in reader:
            tree.insert("", "end", values=row)

# Main application function
def main():
    global root, city_entry, result_frame, save_button
    
    root = tk.Tk()
    root.title("Weather App")
    root.geometry("400x300")
    root.resizable(False, False)

    # Input frame
    input_frame = tk.Frame(root, padx=10, pady=10)
    input_frame.pack(fill="x")

    tk.Label(input_frame, text="Enter City:").pack(side="left")
    city_entry = tk.Entry(input_frame, width=30)
    city_entry.pack(side="left", padx=5)
    city_entry.focus()

    fetch_button = tk.Button(input_frame, text="Get Weather", command=display_weather)
    fetch_button.pack(side="left", padx=5)

    # Result frame
    result_frame = tk.LabelFrame(root, text="Current Weather", padx=10, pady=10)
    result_frame.pack(fill="both", expand=True, padx=10, pady=5)

    # Button frame
    button_frame = tk.Frame(root, padx=10, pady=10)
    button_frame.pack(fill="x")

    save_button = tk.Button(button_frame, text="Save to CSV", state="disabled")
    save_button.pack(side="left", padx=5)

    history_button = tk.Button(button_frame, text="View History", command=view_history)
    history_button.pack(side="left", padx=5)
    root.attributes("-topmost", True)
    root.mainloop()

if __name__ == "__main__":
    main()






LOOK DOWN !!





""""Write a Python program that allows a user to retrieve, display, and save current weather data using the OpenWeatherMap API.

Your program should meet the following requirements:

Modules to Import:
Use the following Python modules:
os, requests, csv, datetime, and tkinter.

Program Features:

Create a Tkinter GUI with an input field for the user to enter a city or country name.

When the user clicks a “Get Weather” button:

Fetch current weather data from the OpenWeatherMap API using the provided API key.

Display the following details in the GUI:

Date and Time

Location

Temperature (in Celsius)

Weather condition (e.g., clear sky, rain)

Humidity percentage

Ask the user whether they want to save the data.

If yes, save the information in a CSV file named weatherdata_history.csv, including headers for time, location, temperature, weather, and humidity.

Include a “View History” button that reads and displays the CSV file content in a scrollable text area inside the GUI.

Error Handling:

Handle cases where:

The city name is invalid.

The API cannot be reached.

The CSV file cannot be read or written.

Display appropriate message boxes for errors and confirmations.

Hint:

Use your API key and the URL format:
https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}

Remember to convert the temperature from Kelvin to Celsius.

Expected Output (GUI Example):

A window titled “Weather Data Retrieval”

Buttons labeled “Get Weather” and “View History”

Labels showing date, time, temperature, weather, and humidity

A scrollable text box showing previously saved weather history"""