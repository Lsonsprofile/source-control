
# introduction to the family restaurant meal calculator
print("🍝 Welcome to Emma's Family Restaurant Meal Calculator! 🍝")
print()
# input the total cost of a childs meal and an adults meal
child_meal = float(input("what is the price of a childs meal? : "))
adult_meal = float(input("what is the price of an adults meal? : "))
drink = float(input("what is the price of the soft drink? : "))

# input the number of children and adults
number_of_children = int(input("Input the number of children? : "))
number_of_adults = int(input("Input the number of adult? : "))
total_drinks = int(input("Input the number of soft drinks? : "))

# calculate the total cost of the meals the total cost of meals for both children and adults
total_cost_of_meals = (child_meal * number_of_children) + (adult_meal * number_of_adults)
total_cost_of_drinks = drink * total_drinks
print()
# Receipt to calculate the total cost of the meals and drinks
print("****Receipt****")
print(f"The total cost of meal is ${total_cost_of_meals}")
print(f"The total cost of soft drinks is ${total_cost_of_drinks}")
print(f"Subtotal= ${total_cost_of_meals + total_cost_of_drinks}")
print("***Thank you for dining with us!*** 😊")