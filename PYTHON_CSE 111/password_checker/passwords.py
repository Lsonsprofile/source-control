import os
""" In the main def i added a code that handls blank user input and if the user input is blank it will ask the user to enter a password again"""
""" I added a DEF function that prints missing_character_type then print it out in the main def """

LOWER=["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
UPPER=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
DIGITS=["0","1","2","3","4","5","6","7","8","9"]
SPECIAL=["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "=", "+", "[", "]", "{", "}", "|", ";", ":", """, """, ",", ".", "<", ">", "?", "/", "`", "~"]


def main():
    print("***Lsons Password Checker***")
    check = True
    while check:
        print("\nInput 'Q' to quit password checking.")
        # Ask user to enter a password (or 'q'/'Q' to quit)
        password = input("Enter a password to check -->: ")
        if password == "q" or password == "Q":
            check = False
            print("Password checker closed")
        elif password == "":
            print("Password cannot be blank !")
        else:
            print(f"\nPassword = {password}")
            
            # get password strength and print it out
            strength = password_strength(password)
            print(f"Password strength (0–5): {strength}")
                
           # get complexity score and print it out
            complexity = word_complexity(password)
            print(f"Character complexity score from 0 to 4 = {complexity}")
            
            # get missing characters and print it out
            missing = missing_character_type(password)
            print(f"Missing characters: {missing}")

            
                
# Function: password_strength
def password_strength(password, min_length=10, strong_length=16):
    # Check common password file (case-sensitive)
    if word_in_file(password, r"C:\Users\Okey\AppData\Roaming\Code\User\source-control\PYTHON_CSE 111\password_checker\toppasswords.txt", case_sensitive=True):
        print("Password is a commonly used password and is not secure!.")
        return 0

    #  - loop through to check if password in dictionary file → print message, return 0
    if word_in_file(password, r"C:\Users\Okey\AppData\Roaming\Code\User\source-control\PYTHON_CSE 111\password_checker\wordlist.txt", case_sensitive=False):
        print("Password is a dictionary word and is not secure!.")
        return 0

    # Length checks
    if len(password) < min_length:
        print("Password is too short and is not secure!.")
        return 1
    if len(password) >= strong_length:
        print("Password is long, length trumps complexity this is a good password 👍")
        return 5

    # - check password complexity → print message, return 1 or 5
    complexity = word_complexity(password)
    return complexity

  
def word_in_file(word, filename, case_sensitive=False):
    # Check if file exists before opening
    # handling error if file dosnt exist and return false
    if not os.path.exists(filename):
        print(f"Warning: File {filename} not found. Skipping this check.")
        return False

    with open(filename, "r", encoding="utf-8") as file:
        # Loop through each line in file
        for line in file:
            line = line.strip()
            if not case_sensitive:
                if word.lower() == line.lower():
                    return True
            else:
                if word == line:
                    return True
    return False

# Checks if word is in a file
def word_has_character(word, character_list):
    for character in character_list:
        if character in word:
            return True
    return False
                    
# Determine complexity score (0-4)          
def word_complexity(word):
    # Initialize score = 0
    score = 0
    
    # Check if password contains at least one character from each category
    if word_has_character(word, LOWER):
        score += 1
    if word_has_character(word, UPPER):
        score += 1
    if word_has_character(word, DIGITS):
        score += 1
    if word_has_character(word, SPECIAL):
        score += 1
        
    return score

def missing_character_type(password):
    # Initialize list of missing character types
    missing = []
    if not word_has_character(password, LOWER):
        missing.append("lowercase")
    if not word_has_character(password, UPPER):
        missing.append("uppercase")
    if not word_has_character(password, DIGITS):
        missing.append("digits")
    if not word_has_character(password, SPECIAL):
        missing.append("special characters")

    return missing
    
    
if __name__ == "__main__":
    main()