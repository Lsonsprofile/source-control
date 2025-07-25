# importing the random module to generate a random number
import random
# Emma's Guessing Game
print("Welcome to Emma's Guessing Game!")
print("Try to guess the secret number between 1 and 50.")
print("You will receive hints if your guess is high or low.")
# Initialize the game
play_again = "yes"
# Main game loop
while play_again == "yes":
# Generate a random number between 1 and 50
    secret_number = random.randint(1, 50)
    guess = -1
    attempts = 0
# Start the guessing loop
    while guess != secret_number:
        attempts += 1
        guess = int(input("\nI Am Thinking Of a Number. Enter your guess: "))

        if guess > 50 or guess < 1:
            print("\nYour guess is out of bounds! Please guess a number between 1 and 50.")
            if attempts == 1:
                print(f"You made {attempts} guesse!.")
            else:
                print(f"You made {attempts} guesses!.")
        elif guess < secret_number:
            print("\nYour guess is low, guess higher. Try again!")
            if attempts == 1:
                print(f"You made {attempts} guesse!.")
            else:
                print(f"You made {attempts} guesses!.")
        elif guess > secret_number:
            print("\nYour guess is high, guess lower. Try again!")
            if attempts == 1:
                print(f"You made {attempts} guesse!.")
            else:
                print(f"You made {attempts} guesses!.")
        else:
            if attempts == 1:
                print(f"Congratulations! You've guessed the secret number {secret_number} in {attempts} attempt!")
            else:
                print(f"Congratulations! You've guessed the secret number {secret_number} in {attempts} attempts!")

    # Ask to play again
    play_again = str(input("Would you like to play again? (yes/no) ")).lower().strip()

# After loop ends — check if the user wants to play again
if play_again == "no":
    print("Thank you for playing! Goodbye!")

elif play_again != "yes" and play_again != "no":
    print("Invalid input. Please enter 'yes' or 'no'.")
    play_again = str(input("Would you like to play again? (yes/no) ")).lower().strip()
else:
    play_again = str(input("Would you like to play again? (yes/no) ")).lower().strip()
