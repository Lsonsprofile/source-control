first = input("First name: ")
last = input("Last name: ")
email = input("Email address: ")
phone = input("Phone number: ")
job_title = input("Job title: ")
id_number = input("ID Number: ")

# This time I used a \n to make a blank line before this:
print("\nThe ID Card is:")
print("----------------------------------------")
print(f"{last.upper()}, {first.capitalize()}")
print(job_title.title())
print(f"ID: {id_number}")
print()
print(email.lower())
print(phone)
print("----------------------------------------")


"""
this is emma personal work file where the user input his personal details.
you can use control + / to comment or uncomment a line
"""
#display a greeting message
print("Welcome to CSE 110")
#display a message about the homework
print("This is Emma's homework file.")
name="emmanuel"
age=24
print(name)
print(age)
print(f"my name is {name}")
print(f"my age is {age}")
print(f"your name is {name} and your age is {age}")
place=input("where are you from? ")
print(f"you are from {place}" )
book=input("what is the title of the book you love ? ")
print(book.upper())
print(book.lower())
print(book.title())
print(f"the title of the book you love most is: {book.upper()}")