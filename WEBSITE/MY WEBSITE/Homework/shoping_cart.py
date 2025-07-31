print("***WELCOME TO EMMA'S SHOPPING CART***")

shoping_cart = []

choice = ""

while choice != "5":
    print("\nPlease select one of the following:")
    print("\n1. Add item")
    print("2. View cart")
    print("3. Remove item")
    print("4. Compute total")
    print("5. Quit")
    choice = input("-> Please enter an action: ")
    
    if choice == "1":
        item = input("\nWhat item would you like to add?: ").strip().lower()
        if item.isalpha():
            shoping_cart.append(item)
            print(f"{item} is added to cart")
        else:
            print("\nText only (no numbers or special characters!).")

    elif choice == "2":
        print("\nThe contents of the shopping cart are:")
        for index in range(len(shoping_cart)):
            print(f"{index + 1}. {shoping_cart[index]}")

    elif choice == "3":
        item = input("\nPlease enter the item you want to remove: ").strip().lower()
        if item in shoping_cart:
            shoping_cart.remove(item)
            print(f"{item} is removed from the cart")
        else:
            print(f"{item} is not in your cart.")

    elif choice == "4":
        total = 0
        for item in shoping_cart: 
            total += 1
        print("\nThe total cost of your items is: ", total)

    elif choice == "5":
        print("\nThank you for shopping with us!")

    else:
        print("\n__Invalid input, please try again")
