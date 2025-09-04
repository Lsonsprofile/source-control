from datetime import datetime

# Constants
DISCOUNT_RATE = 0.10
TAX_RATE = 0.06

# Get today's day of the week (0 = Monday, 1 = Tuesday, etc.)
today = datetime.now()
day_of_the_week = today.weekday()


subtotal = 0
quantity = 1   # Start with non-zero to enter the loop

while quantity != 0:
    quantity = int(input("Enter the quantity of item (0 to quit): "))
    if quantity != 0:
        price = float(input("Enter the price of the item: "))
        subtotal = subtotal + (price * quantity)

print(f"subtotal =: {subtotal:.2f}")


discount = 0

# Tuesday = 1, Wednesday = 2
if day_of_the_week == 2 or day_of_the_week == 3:
    if subtotal >= 50:
        discount = subtotal * DISCOUNT_RATE
        print(f"Discount amount: {discount:.2f}")
    else:
        difference = 50 - subtotal
        print(f"You can get discount by ordering {difference:.2f} more to get 10% off.")

# Apply discount if any
subtotal = subtotal - discount


sales_tax = subtotal * TAX_RATE
total = subtotal + sales_tax


print(f"Sales tax amount: {sales_tax:.2f}")
print(f"Total: {total:.2f}")
