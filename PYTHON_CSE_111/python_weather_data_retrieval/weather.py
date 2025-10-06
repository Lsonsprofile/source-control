# Import tools we need
# 'requests' is a library that helps Python talk to websites and APIs over the internet.
# It's like sending a letter to a server and getting a response back.
import requests  

# 'csv' is a library for reading and writing CSV files.
# CSV files are like simple spreadsheets stored as text, with rows and columns separated by commas.
import csv       

# 'json' is a library to handle JSON data.
# JSON is a format for storing data like dictionaries (key-value pairs), which APIs often send.
import json      

# 'datetime' from the 'datetime' module helps get the current date and time.
# We use it to add timestamps to our data, so we know when the weather was fetched.
from datetime import datetime  

# Step 1: Set up the details
# API_KEY: This is your secret code to use the OpenWeatherMap API.
# Replace "YOUR_API_KEY" with the actual key you got from their website.
API_KEY = "dea7d385660914c914dfd7d319b0d3f3"  

# BASE_URL: This is the web address where the API lives.
# We send requests to this URL to get weather data.
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"  

# Step 2: Function to get data from the internet
# This function takes a 'location' (like "London" or "London,UK") and the API key.
# It sends a request to the API and tries to get the weather data.
def get_weather_data(location, api_key):
    # 'params' is a dictionary of extra info we send with the request.
    # "q" is for the query (location), "appid" is for the API key.
    params = {"q": location, "appid": api_key}
    
    # We use a 'try-except' block to catch errors without crashing the program.
    try:
        # 'requests.get' sends a GET request to the URL with the params.
        # It's like visiting a webpage but from code.
        response = requests.get(BASE_URL, params=params)
        
        # 'response.status_code' is a number that says if the request succeeded.
        # 200 means "OK" or success.
        if response.status_code == 200:
            # 'response.json()' turns the response into a Python dictionary (from JSON).
            return response.json()  
        else:
            # If not 200, print an error message with details.
            print(f"Error: Could not get data for {location}. Status code: {response.status_code}. Maybe check the location or API key.")
            return None
    except Exception as e:
        # If there's any other problem (like no internet), catch it here.
        # 'Exception as e' captures the error details in 'e'.
        print(f"Error: Problem connecting or fetching data. Details: {e}")
        return None

# Step 3: Function to check if the data is good
# This checks if the API gave us useful weather data.
# It looks for specific keys in the dictionary to make sure nothing is missing.
def is_data_ok(data):
    # If 'data' is None or empty, return False.
    if not data:
        return False
    
    # Check if these important parts exist in the data dictionary.
    # "main" has temperature, "weather" has description, "name" has city name.
    if "main" in data and "weather" in data and "name" in data:
        return True
    
    # If missing, print an error.
    print("Error: Data is missing important parts like temperature or weather description.")
    return False

# Step 4: Function to save data to a CSV file (like a spreadsheet)
# This opens a CSV file and adds the weather data to it.
# We use only CSV as per your request.
def save_to_csv(data):
    # 'file_name' is the name of the CSV file we will create or add to.
    file_name = "weather_data.csv"
    
    # 'with open' safely opens the file.
    # "a" means "append" mode: add to the end if the file exists, create if not.
    # 'newline=""' avoids extra blank lines in CSV.
    with open(file_name, "a", newline="") as csv_file:
        # 'csv.writer' helps write rows to the CSV properly.
        writer = csv.writer(csv_file)
        
        # 'csv_file.tell() == 0' checks if the file is empty (position 0).
        # If empty, write the header row (column names).
        if csv_file.tell() == 0:
            writer.writerow(["Time", "Location", "Temperature (C)", "Weather"])
        
        # Get the current time as a string.
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Extract data from the dictionary.
        # Temperature comes in Kelvin, so subtract 273.15 to get Celsius.
        # ':.1f' formats it to one decimal place.
        temp = data["main"]["temp"] - 273.15
        weather = data["weather"][0]["description"]  # First item in weather list.
        location = data["name"]  # The city name from the API.
        
        # Write the row of data.
        writer.writerow([current_time, location, f"{temp:.1f}", weather])
    
    # Print a message so the user knows it saved.
    print(f"Saved data to {file_name}")

# Step 5: Function to print the weather data
# This displays the data on the screen in a readable way.
def print_weather_data(data):
    # Extract the details.
    location = data["name"]
    temp = data["main"]["temp"] - 273.15
    weather = data["weather"][0]["description"]
    
    # Print them nicely.
    print(f"Weather for {location}:")
    print(f"Temperature: {temp:.1f}°C")
    print(f"Description: {weather}")

# Step 6: Main program
# This is the starting point of the script.
def main():
    # Ask the user for input.
    # 'input()' waits for the user to type something and press Enter.
    # We ask for "country", but it can be "city,country" like "Paris,FR" for better accuracy.
    location = input("Enter the country or city for weather data (e.g., 'London' or 'London,UK'): ")
    
    # Get the weather data using the user's input.
    data = get_weather_data(location, API_KEY)
    
    # Check if data is good.
    if data and is_data_ok(data):
        # If good, print it and save to CSV.
        print_weather_data(data)
        save_to_csv(data)
    else:
        # If not, the error is already printed in the functions.
        # The program won't crash because of the try-except blocks.
        print("Program ending due to error. Please try again with a valid location.")

# Run the program only if this file is run directly (not imported).
# This is a common Python pattern.
if __name__ == "__main__":
    main()