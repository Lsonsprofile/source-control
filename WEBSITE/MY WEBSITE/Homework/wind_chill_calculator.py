# I show creativity by making the program loop and ask the user for correct unit
# I also make the programme loop asking user for correct temperature input as number.
# Function to calculate wind chill (°F)
def calc_wind_chill(temp_f, wind_speed):
    wind_chill = 35.74 + (0.6215 * temp_f) - 35.75 * (wind_speed ** 0.16) + (0.4275 * temp_f * (wind_speed ** 0.16))
    # store the result in a variable (wind_chill)
    # return the result
    return wind_chill 

# Function to convert Celsius to Fahrenheit
def celsius_to_fahrenheit(temp_c):
    fahrenheit = (temp_c * 9/5) + 32
    # store in a variable
    # return the result
    return fahrenheit 

# Function to check if input is numeric
def is_number(value):
    value = value.strip().replace("-", "", 1).replace(".", "", 1)
    return value.isdigit()

# ask for the temperature
temp_input = input("Enter the temperature: ")
while not is_number(temp_input):
    print("Invalid input. Please enter a number.")
    temp_input = input("Enter the temperature: ")
temp = float(temp_input)

# ask for the unit
unit = input("Enter the unit in Celsius (C) or Fahrenheit (F): ")

# loop to validate unit input of C or F
while unit.lower() not in ["c", "f"]:
    print("Invalid input. Please enter C or F.")
    unit = input("Enter the unit in Celsius (C) or Fahrenheit (F): ")

# Convert to Fahrenheit if needed
if unit.lower() == "c":
    temp = celsius_to_fahrenheit(temp)

# Loop through wind speeds from 5 to 65 mph in increments of 5
print("---------------------------------------------------------------------")
for speed in range(5, 65, 5):
    chill = calc_wind_chill(temp, speed)
    print(f"At temperature {temp:.2f}°F and wind speed {speed}mph, the wind chill is {chill:.2f}°F")

