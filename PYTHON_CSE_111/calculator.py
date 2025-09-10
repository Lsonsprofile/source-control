print("Welcome to Ison Calculator!")

def get_number(prompt):
    """Keep asking until user enters a valid float number"""
    running = True
    while running:
        user_input = input(prompt)
        # Allow floats and negatives
        if user_input.replace(".", "", 1).lstrip("-").isdigit():
            return float(user_input)
        else:
            print("Invalid input. Please enter a number.")

def calculator():
    calc = True
    # Get the first number
    result = get_number("Enter the first number: ")
    
    while calc:
        # Show menu
        print("\nChoose operation:")
        print("1. Add")
        print("2. Subtract")
        print("3. Multiply")
        print("4. Divide")
        print("5. Exit")
        
        choice = input("Enter choice (1-5): ")
        
        if choice == "5":
            print(f"\nFinal Result: {result}")
            print("Goodbye!")
            calc = False   # instead of break
            continue
        
        # Get the next number
        num = get_number("Enter another number: ")
        
        # Perform operation
        if choice == "1":
            result += num
        elif choice == "2":
            result -= num
        elif choice == "3":
            result *= num
        elif choice == "4":
            if result <= 0:
                result /= num
                print("zero!, you cannot divide zero")
                continue
        else:
            print("Invalid choice. Try again.")
            continue
        
        print(f"Current Result: {result}")

# Run program
calculator()
