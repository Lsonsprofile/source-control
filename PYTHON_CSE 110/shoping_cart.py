# welcome message 
print("***WELCOME TO EMMA'S SHOPPING CART***")
# list of items
shopping_cart = []
item_prices = []
# choice variable
choice = ""
# while loop for main program that will run until the user enters 5 to quit
while choice != "5":
    print("\nPlease select one of the following:")
    print("\n1. Add item")
    print("2. View cart")
    print("3. Remove item")
    print("4. Compute total")
    print("5. Quit")
    choice = input("-> Please enter an action: ")
# if the user enters 1, they will be asked to enter an item and its price
    if choice == "1":
        item = input("\nWhat item would you like to add?: ")
        item = item.strip().lower()
        # validation for item name and price
        if item.isalpha():
            price = float(input("What is the price of the item?: "))
            if price >= 0:
                # add item and price to the list
                shopping_cart.append(item)
                item_prices.append(price)
                print(f"--> You added {item} (${price:.2f}) to your cart")
            else:
                print("\n --> Price must be a positive number.")
        else:
            print("\n --> Invalid item name. Only letters are allowed.")
# if the user enters 2, they will be shown the items in their shopping cart
    elif choice == "2":
        if len(shopping_cart) == 0:
            print("\n--> Your shopping cart is empty.")
        else:
            if len(shopping_cart) == 1:
                print("\n--> The item in your shopping cart is:")
            else:
                print("\n--> The items in your shopping cart are:")
            for index in range(len(shopping_cart)):
                # pints the item and its price in index 1. item - $price
                print(f"{index + 1}. {shopping_cart[index]} - ${item_prices[index]:.2f}")
# if the user enters 3, they will be asked to enter the item number they want to remove
    elif choice == "3":
        # check if the shopping cart is empty, print a message
        if len(shopping_cart) == 0:
            print("\n--> Your shopping cart is empty.")
        else:
            item_number = input("\nPlease enter the item number you want to remove: ")
            if item_number.isdigit():
                index = int(item_number) - 1
                # check if the index is valid and the item is in the shopping cart
                if 0 <= index < len(shopping_cart):
                    removed_item = shopping_cart[index]
                    removed_price = item_prices[index]
                    shopping_cart.pop(index)
                    item_prices.pop(index)
                    # print a message to confirm the item has been removed
                    print(f"{removed_item} (${removed_price:.2f}) has been removed from cart.")
                else:
                    # print a message if the item number is invalid
                    print(f"\n--> Invalid item number. Please enter a number between 1 and {len(shopping_cart)}.")
            else:
                # print a message if the input is not a digit 
                print("\n--> Invalid input. Please enter a valid number.")
# print the shopping cart total price for all items
    elif choice == "4":
        if len(item_prices) == 0:
            # print a message if the shopping cart is empty
            print("\nCart is empty. Total is $0.00")
        else:
            total = 0
            for price in item_prices:
                total += price
            print(f"\nThe total price of the items in the shopping cart is ${total:.2f}")

    elif choice == "5":
        # print a thank you message and exit the program
        print("\n***Thank you for shopping with us! ***")

    else:
        # print a message if the input is not a valid option (1-5)
        print("\n__Invalid input, please try again")
