import os
import requests
import csv
from datetime import datetime
import tkinter as tk
from tkinter import messagebox, scrolledtext

API_KEY = "dea7d385660914c914dfd7d319b0d3f3"
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"
FILE_NAME = "PYTHON_CSE_111/python_weather_data_retrieval/weatherdata_history.csv"

def get_weather_data(location, api_key):
    # Fetch weather data from OpenWeatherMap API
    params = {"q": location, "appid": api_key}
    try:
        response = requests.get(BASE_URL, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            messagebox.showerror("Error", f"API returned status code {response.status_code}")
            return None
    except Exception:
        messagebox.showerror("Error", "Unable to connect to the weather API.")
        return None

def is_data_ok(data):
    # Check if the data is valid
    if not data:
        return False
    return "main" in data and "weather" in data and "name" in data and "wind" in data

def validate_file_path(file_path):
    # Validate the file path
    try:
        if os.path.isfile(file_path):
            return True
        else:
            messagebox.showerror("Error", "File not found.")
            return False
    except Exception:
        messagebox.showerror("Error", "Unexpected error validating file path.")
        return False

def save_to_csv(data):
    # Save weather data to CSV file
    try:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        location = data["name"]
        temp = data["main"]["temp"] - 273.15
        weather = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]
        wind_speed = data["wind"]["speed"]

        # Ensure the directory exists
        os.makedirs(os.path.dirname(FILE_NAME), exist_ok=True) if os.path.dirname(FILE_NAME) else None
        file_exists = os.path.exists(FILE_NAME)
        with open(FILE_NAME, "a", newline="") as csv_file:
            writer = csv.writer(csv_file)
            if not file_exists:
                writer.writerow(["Time", "Location", "Temperature (C)", "Weather", "Humidity", "Wind Speed (m/s)"])
            writer.writerow([current_time, location, f"{temp:.1f}", weather, humidity, f"{wind_speed:.1f}"])
            writer.writerow(["------------------------------------------------------------------------------"]) # Add an empty row for better readability

        messagebox.showinfo("Success", f"Data saved successfully to {FILE_NAME}")

    except PermissionError:
        messagebox.showerror("Error", "Permission denied when saving the file. Please close it if it is open.")
    except Exception as e:
        messagebox.showerror("Error", f"Unexpected error while saving data: {e}")

def show_history():
    # Display the contents of the CSV file in the text area
    try:
        text_area.config(state='normal')  # Enable editing to update content
        text_area.delete(1.0, tk.END)  # Clear existing content

        if not os.path.exists(FILE_NAME):
            text_area.insert(tk.END, "No history found. The CSV file does not exist yet.")
        else:
            with open(FILE_NAME, "r", newline="") as csv_file:
                reader = csv.reader(csv_file)
                headers = next(reader, None)  # Read headers
                if headers:
                    text_area.insert(tk.END, ", ".join(headers) + "\n" + "-"*80 + "\n")
                for row in reader:
                    text_area.insert(tk.END, ", ".join(row) + "\n")
        
        text_area.config(state='disabled')  # Make text area read-only

    except PermissionError:
        messagebox.showerror("Error", "Permission denied when reading the file. Please close it if it is open.")
    except Exception as e:
        messagebox.showerror("Error", f"Unexpected error while reading history: {e}")

def fetch_weather():
    # Handle button click to fetch and display weather data
    location = entry_location.get().strip()
    if not location:
        messagebox.showerror("Error", "Please enter a valid city or country.")
        return

    data = get_weather_data(location, API_KEY)
    if not data:
        messagebox.showerror("Error", "Could not fetch data. Please check your internet or the city name.")
        return

    if is_data_ok(data):
        city = data["name"]
        temp = data["main"]["temp"] - 273.15
        weather = data["weather"][0]["description"]
        humidity = data["main"]["humidity"]
        wind_speed = data["wind"]["speed"]
        current_time = datetime.now()
        date_str = current_time.strftime("%Y-%m-%d")
        time_str = current_time.strftime("%H:%M:%S")

        # Update display labels
        label_date.config(text=f"Date: {date_str}")
        label_time.config(text=f"Time: {time_str}")
        label_city.config(text=f"Location: {city}")
        label_temp.config(text=f"Temperature: {temp:.1f}°C")
        label_weather.config(text=f"Weather: {weather}")
        label_humidity.config(text=f"Humidity: {humidity}%")
        label_wind.config(text=f"Wind Speed: {wind_speed:.1f} m/s")

        # Ask user to save data
        if messagebox.askyesno("Save Data", "Do you want to save this data to weatherdata.csv?"):
            save_to_csv(data)
        else:
            messagebox.showinfo("Info", "Data not saved.")
    else:
        messagebox.showerror("Error", "Invalid or incomplete data received. Try another location.")

def main():
    # Set up the main GUI window
    global root, entry_location, label_date, label_time, label_city, label_temp, label_weather, label_humidity, label_wind, text_area
    root = tk.Tk()
    root.title("Weather Data Retrieval")
    root.geometry("400x550")  # Increased height to accommodate new wind label

    # Create and place widgets
    tk.Label(root, text="Enter city or country (e.g., 'London' or 'London,UK'):", font=("Arial", 12, "bold")).pack(pady=10)
    entry_location = tk.Entry(root, width=30)
    entry_location.pack()

    # Frame for buttons
    button_frame = tk.Frame(root)
    button_frame.pack(pady=10)
    tk.Button(button_frame, text="Get Weather", command=fetch_weather).pack(side=tk.LEFT, padx=5)
    tk.Button(button_frame, text="View History", command=show_history).pack(side=tk.LEFT, padx=5)

    # Labels to display weather data
    label_date = tk.Label(root, text="Date: ", font=("Arial", 8, "bold"))
    label_date.pack(pady=5)
    label_time = tk.Label(root, text="Time: ", font=("Arial", 8, "bold"))
    label_time.pack(pady=5)
    label_city = tk.Label(root, text="Location: ", font=("Arial", 8, "bold"))
    label_city.pack(pady=5)
    label_temp = tk.Label(root, text="Temperature: ", font=("Arial", 8, "bold"))
    label_temp.pack(pady=5)
    label_weather = tk.Label(root, text="Weather: ", font=("Arial", 8, "bold"))
    label_weather.pack(pady=5)
    label_humidity = tk.Label(root, text="Humidity: ", font=("Arial", 8, "bold"))
    label_humidity.pack(pady=5)
    label_wind = tk.Label(root, text="Wind Speed: ", font=("Arial", 8, "bold"))
    label_wind.pack(pady=5)

    # Scrollable text area for history
    tk.Label(root, text="Weather History:", font=("Arial", 12, "bold")).pack(pady=5)
    text_area = scrolledtext.ScrolledText(root, width=40, height=8, wrap=tk.WORD)
    text_area.pack(padx=10, pady=5)
    text_area.insert(tk.END, "Click 'View History' to display weather data history.")
    text_area.config(state='disabled')  # Start as read-only

    # Keep window on top and start the event loop
    root.attributes("-topmost", True)
    root.mainloop()

# Start the Tkinter event loop
if __name__ == "__main__":
    main()