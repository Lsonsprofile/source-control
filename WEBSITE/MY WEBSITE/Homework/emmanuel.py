# This script checks if the 'inflect' library is installed and prints a message inflect is working
import inflect

# inflect.engine is initiated to use the inflect library for generating articles
p = inflect.engine()

# Welcome to the Clever Stories Generator!
# This short story captures a surprising airport adventure based on your custom words.
# Get ready to see your words come to life in a mini-narrative!

# Prompt user for input and store them in variables
person = input("Enter a person's name: ")
day = input("Enter a day of the week: ")
vehicle = input("Enter a type of vehicle (e.g., airplane, train, bus): ")
time = input("Enter a time (e.g., 5am, 3pm): ")
sound = input("Enter a loud sound (e.g., bang, boom, crash): ")
verb = input("Enter a past tense action verb (e.g., shouted, screamed): ")
group_noun = input("Enter a plural noun for people (e.g., passengers, students): ")
exclamation = input("Enter an exclamation word (e.g., Wow, Yikes, Oh no): ")
minutes = input("Enter a number representing minutes: ")

# Capitalize where necessary
person = person.capitalize()
day = day.capitalize()
exclamation = exclamation.capitalize()

# Create the story using f-string
story = f"""
{person} booked a ride on {day}, hoping to catch a {vehicle} leaving at around {time}.
As {person} arrived at the airport, a loud {sound} echoed in the distance.
Startled, {person} {verb} "{exclamation}!" and looked around in shock.
The {group_noun} nearby began to panic.
Within {minutes} minutes, security staff arrived and confirmed it was a false alarm.
Relieved but shaken, {person} continued calmly toward the boarding gate.
"""

# Print the full story
print("\n--- Your Clever Story ---")
print(story)
