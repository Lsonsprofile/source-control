""" Write a program that will accept user input that describes a tire then
calculate and display the tire's volume. Record the tire information in a log file. """

#I added header to my file checking that the header is not repeated over again
#make sure the data is well aligned under the headings 
#I created a loop that validates input
#I imported the os module to allow me to interact with the operating system

# import datetime
from datetime import datetime
# import the math module
import math
# import the os module
import os  

tire_width = -1
aspect_ratio = -1
wheel_diameter = -1

# Keep looping until all inputs are valid
valid = False
while not valid:
    # Ask for inputs
    tire_width = input("Enter the tire width in millimeters: ")
    aspect_ratio = input("Enter the aspect ratio of the tire as a percentage of its width: ")
    wheel_diameter = input("Enter the wheel diameter in inches: ")

    # Check if all inputs are numbers
    if tire_width.isdigit() and aspect_ratio.isdigit() and wheel_diameter.isdigit():
        tire_width = float(tire_width)
        aspect_ratio = float(aspect_ratio)
        wheel_diameter = float(wheel_diameter)

        # Check if all are greater than 0
        if tire_width > 0 and aspect_ratio > 0 and wheel_diameter > 0:
            valid = True
        else:
            print("All values must be greater than 0. Please try again.\n")
    else:
        print("Invalid input. Please enter numbers only.\n")

# Step 1: Convert width (mm) into sidewall height (mm * aspect ratio %)
sidewall_height = tire_width * (aspect_ratio / 100)

# Step 2: Convert sidewall height to inches (1 inch = 25.4 mm)
inner_radius = sidewall_height / 25.4  

# Step 3: Convert wheel diameter to radius (inches)
wheel_radius_in = wheel_diameter / 2

# Step 4: Add sidewall height to get outer radius
outer_radius = wheel_radius_in + inner_radius

# Step 5: Apply torus volume formula
volume = (2 * (math.pi ** 2)) * outer_radius * (inner_radius ** 2)

# Step 6: Round result to 2 decimal places
volume = round(volume, 2)

# Final Output
print(f"Tire Volume: {volume} cubic inches")

# Get current date in YYYY-MM-DD format
current_date = datetime.now().strftime("%Y-%m-%d")

# File path
file_path = r"C:\Users\Okey\AppData\Roaming\Code\User\source-control\PYTHON_CSE 111\volumes.txt"

# Check if file is empty and write a header if it is
file_empty = not os.path.exists(file_path) or os.path.getsize(file_path) == 0

with open(file_path, "a") as volume_file:
    # Add a heading only once if the file is empty
    if file_empty:
        # Write data aligned under headings
        volume_file.write(f"{'Date':<12}{'Width(mm)':<12}{'Aspect(%)':<12}{'Diameter(in)':<15}{'Volume(cu in)':<15}\n")
    # Write data aligned under headings
    volume_file.write(f"{current_date:<12}{tire_width:<12}{aspect_ratio:<12}{wheel_diameter:<15}{volume:<15}\n")
