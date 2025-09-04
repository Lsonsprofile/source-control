"""Write a Python program named tire_volume.py that reads from the keyboard the three numbers for a tire and computes and outputs the volume of space inside that tire."""

import math

# Prompt user for tire width with validation
width_input = input("Enter the width of the tire in mm (ex 205): ")
while not width_input.isdigit():
    print("Invalid input. Please enter a number.")
    width_input = input("Enter the width of the tire in mm (ex 205): ")
width = int(width_input)

# Prompt user for aspect ratio with validation
aspect_input = input("Enter the aspect ratio of the tire (ex 60): ")
while not aspect_input.isdigit():
    print("Invalid input. Please enter a number.")
    aspect_input = input("Enter the aspect ratio of the tire (ex 60): ")
aspect_ratio = int(aspect_input)

# Prompt user for diameter with validation
diameter_input = input("Enter the diameter of the wheel in inches (ex 15): ")
while not diameter_input.isdigit():
    print("Invalid input. Please enter a number.")
    diameter_input = input("Enter the diameter of the wheel in inches (ex 15): ")
diameter = int(diameter_input)

# Compute volume
volume = (math.pi * width**2 * aspect_ratio * (width * aspect_ratio + 2540 * diameter)) / 10000000000

# Display result
print(f"The approximate volume is {volume:.2f} liters")
