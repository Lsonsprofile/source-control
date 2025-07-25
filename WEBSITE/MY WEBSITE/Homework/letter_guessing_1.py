import random  # Import random for selecting a word

print("Welcome to Emma's WORD 📚 Guessing Game!")
print("\nRules are simple:")
print("- Right letters in the correct position are capitalized.")
print("- Right letters in the wrong position are lowercase.")
print("- Letters not in the word are shown as '_'")
print("You have unlimited attempts to guess the word correctly.\n")

# Word categories
cars = ["toyota", "honda", "audi", "tesla", "mazda"]
animals = ["tiger", "monkey", "rabbit", "donkey", "elephant"]

# Main game loop
play_again = "yes"

while play_again == "yes":
    print("\nChoose a category: 'cars' or 'animals'")
    category_choice = input("Enter your choice: ").lower().strip()

    # Pick word list based on category
    if category_choice == "cars":
        word_list = cars
        print("\nClue / Category: Cars")
    elif category_choice == "animals":
        word_list = animals
        print("\nClue / Category: Animals")
    else:
        print("Invalid category! Please enter 'cars' or 'animals'.")
        continue

    # Select secret word
    secret_word = random.choice(word_list)
    guess = ""
    total_attempts = 0  # Total tries
    fails_since_prompt = 0  # Number of failures since last prompt

    # Start guessing
    while guess != secret_word:
        print(f"\nHint: {len(secret_word)}-letter word → ", "_ " * len(secret_word))
        guess = input("Enter your guess: ").strip().lower()
        total_attempts += 1

        if len(guess) != len(secret_word):
            print(f"Your guess must be {len(secret_word)} letters long.")
        else:
            result = ""
            for i in range(len(secret_word)):
                if guess[i] == secret_word[i]:
                    result += guess[i].upper()
                elif guess[i] in secret_word:
                    result += guess[i].lower()
                else:
                    result += "_"
            print(f"Hint: {result}")

            if guess == secret_word:
                print(f"\n🎉 Correct! You guessed the word '{secret_word}' in {total_attempts} attempts.")
                break
            else:
                print(f"⏳ Try again! Attempts so far: {total_attempts}")
                fails_since_prompt += 1  # Count failed guess

        # Ask after every 5 failed attempts
        if fails_since_prompt == 5:
            quit_input = input("❓ Do you want to continue guessing this word? (yes/no): ").strip().lower()
            if quit_input == "no":
                print(f"❌ Game Over. The word was '{secret_word}'.")
                break
            elif quit_input == "yes":
                print("👍 Continue playing!")
                fails_since_prompt = 0  # Reset the failure counter
            else:
                print("⚠️ Invalid input. Continuing the game.")
                fails_since_prompt = 0  # Still reset

    # Ask to play again
    play_again = input("\n🔁 Do you want to play again? (yes/no): ").strip().lower()
