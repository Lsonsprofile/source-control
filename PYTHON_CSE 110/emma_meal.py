# I added an input drink and number of drinks and the total cost of drinks
# I added a receipt and a welcoming message and a thank you message

# Introduction to the family restaurant meal calculator
print("🍝 Welcome to Emma's Family Restaurant Meal Calculator! 🍝")
# Input the total cost of a childs meal and an adults meal and sales tax rate
child_meal = float(input("what is the price of a childs meal? : "))
adult_meal = float(input("what is the price of an adults meal? : "))
drink = float(input("what is the price of the soft drink? : "))
sales_tax_amount = float(input("what is the 'Sales tax rate' : ")) 
print("-----------------------------------------")
# Input the number of children and adults
number_of_children = int(input("Input the number of children? : "))
number_of_adults = int(input("Input the number of adult? : "))
total_drinks = int(input("Input the number of soft drinks? : "))

# Calculate the total cost of the meals the total cost of drinks for both children and adults
total_cost_of_meals = (child_meal * number_of_children) + (adult_meal * number_of_adults)
total_cost_of_drinks = drink * total_drinks
subtotal= total_cost_of_meals + total_cost_of_drinks

# Calculate the sales tax rate
sales_tax = sales_tax_amount / 100
# Calculate the total sales tax
total_sales_tax = subtotal * sales_tax
# Calculate the total amount to be paid
total= subtotal + total_sales_tax
print("-----------------------------------------")
# Calculate the amount paid and the change to be returned
amount_paid = float(input("How much money paid: "))
# Total change to be returned
change = amount_paid - total



# Receipt to calculate the total cost of the meals and drinks.
# Tax rate, total amount paid and change returned.
print("\n**************Receipt********************")
print(f"Child meal price: ${child_meal:.2f}")
print(f"Adult meal price: ${adult_meal:.2f}")
print(f"Drink price: ${drink:.2f}")
print(f"Number of children: {number_of_children}")
print(f"Number of adults: {number_of_adults}")
print(f"Sales tax rate: {total_sales_tax}%")
print(f"The total cost of meal is ${total_cost_of_meals}")
print(f"The total cost of soft drinks is ${total_cost_of_drinks}")
print("____________________________________________")
print(f"Total amount of sales = ${total}")
print(f"amount paid: ${amount_paid:.2f}")
print(f"Change returned: ${change:.2f}")
print("***Thank you for dining with us!*** 😊")