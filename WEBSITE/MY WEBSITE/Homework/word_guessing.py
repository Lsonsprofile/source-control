# Display the welcome message
print("Welcome to Emma's WORD 📚 Guessing Game!")

# Display the game rules
print("\nRules are simple, right letters in the right position are capitalized.")
print("Right letters in the wrong position are lowercase.")
print("You have unlimited attempts to guess a word correctly.")

# Announce the start of the game
print("\nLet's start the game!")
print("Clue / Category: ANIMAL name three letters long")

# Initialize play_again to start the game
play_again = "yes"

# Game loop runs only if player says yes
while play_again == "yes":
    # Set the secret word
    secret_word = "owl".lower()
    guess = ""
    attempts = 0

    # Guessing loop
    while guess != secret_word:
        print("Your hint is:", "_ " * len(secret_word))
        guess = input("\nType your guess: ").strip().lower()

        if len(guess) == len(secret_word):
            attempts += 1
            print("Hint: ", end="")
            # checks if if letter position is valid or invalid 
            for letter in range(len(secret_word)):
                if guess[letter] == secret_word[letter]:
                    print(guess[letter].upper(), end="")
                elif guess[letter] in secret_word:
                    print(guess[letter].lower(), end="")
                else:
                    print("_", end="")
            print()

            if guess == secret_word:
                if attempts == 1:
                    print(f"\nCongratulations 🎉, you guessed it in just {attempts} attempt! The word was '{secret_word.upper()}'.")
                else:
                    print(f"\nCongratulations 🎉, you guessed in {attempts} attempts! The word was '{secret_word.upper()}'.")
            else:
                if attempts != 1:
                    print(f"Not yet! you've guessed {attempts} times. Try again!")
                else:
                    print(f"Not yet! you have guessed {attempts} time. Try again!")
        elif guess == secret_word:
            print("result", end="")
        else:
            print(f"Your guess must be {len(secret_word)} letters long. Try again!")

    # Ask player if they want to play again
    play_again = input("\nWanna play again? (yes/no): ").strip().lower()

    # Handle invalid input
    while play_again != "yes" and play_again != "no":
        print("Invalid input. Please type 'yes' or 'no'.")
        play_again = input("Wanna play again? (yes/no): ").strip().lower()

    # Exit message if player says no
    if play_again == "no":
        print("Thank you for playing Emma's Guessing Game!")
