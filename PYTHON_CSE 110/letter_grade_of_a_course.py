# This is a simple calculator program for Emma's homework
grade = input("Enter the nuber of your score: ")
grade= int(grade)
# It calculates the letter grade based on the score input by the user
if grade >= 90:
    letter = "A"
elif grade >= 80:
    letter = "B"
elif grade >= 70:
    letter = "C"
elif grade >= 60:
    letter = "D"
else:
    grade < 60
    letter = "F"
    print("You have failed the course")

last_digit = grade % 10
sign=""
# It adds a sign to the letter grade based on the score
if last_digit >= 7:
    sign = "+"
elif last_digit <= 3:
    sign = "-"
elif last_digit == 0:
    sign = ""

if letter == "A" and sign == "+" or letter == "A" and sign == "-":
    sign = ""  # No plus for A grade
        
# It prints the final letter grade with the sign
print(f"Your grade is {letter}{sign}")

