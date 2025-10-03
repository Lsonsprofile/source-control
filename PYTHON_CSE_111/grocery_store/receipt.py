""" I added a percentage off feature to the receipt program. I also added a random discount to the total bill. """
import csv
import random
from datetime import datetime

def read_dictionary(filename, key_column_index):
    """Read a CSV file into a compound dictionary and return it."""
    dictionary = {}
    try:
        with open(filename, "r") as csv_file:
            reader = csv.reader(csv_file)
            next(reader)  # skip header line
            for row in reader:
                key = row[key_column_index].strip()
                dictionary[key] = row
        return dictionary
    except FileNotFoundError:
        print(f"Error: The file {filename} was not found.")
        return {}
    except PermissionError:
        print(f"Error: Permission denied when accessing {filename}.")
        return {}

def main():
    """Main function to process grocery order and print receipt details."""
    print("\n*** Lson Emmanuel's Grocery Store ***")
    total_items=0
    subtotal = 0.0
    SALES_TAX_RATE = 0.06
    ordered_products=[]
    # read request.csv file and use it to get items checking if item is in products.csv
    try:
        products_dict = read_dictionary("PYTHON_CSE_111/grocery_store/products.csv", 0)

        with open("PYTHON_CSE_111/grocery_store/request.csv", "r") as csv_file:
            reader = csv.reader(csv_file)
            next(reader)  # Skip header line
            for row in reader:
                product_number = row[0].strip()  # Product number
                quantity = int(row[1])
                total_items += quantity
                try:
                    product_info = products_dict[product_number]# Product info fetches from dictionary
                    product_name = product_info[1]  # Name of product
                    price = float(product_info[2])  # Price of product
                    subtotal += price * quantity
                    print(f"{product_name}: {quantity} @ {price:.2f}")
                except KeyError:
                    print(f"Error: Product {product_number} not found in products catalog.")
    except FileNotFoundError:
        print("Error: request.csv was not found.")
    except PermissionError:
        print("Error: Permission denied when trying to read request.csv.")
    except ValueError:
        print("Error: Invalid data format in request.csv (e.g., non-numeric quantity).")
    print(f"Subtotal: {subtotal:.2f}")
    print(f"Number Of Items: {total_items}")
    sales_tax = subtotal * SALES_TAX_RATE
    print(f"Sales Tax: {sales_tax:.2f}")
    total = subtotal + sales_tax
    print(f"Total: {total:.2f}")
    print("Thank you for shopping at Lson Emmanuel's Grocery Store")
    print(datetime.now().strftime("Date: %a %b %d %H:%M:%S %Y"))
    ordered_products.append(product_name) #append product name to list
    percentage_product= random.choice(ordered_products) #select random product from list
    print(f"Get 10% off on {percentage_product} on your next purchase!")

if __name__ == "__main__":
    main()