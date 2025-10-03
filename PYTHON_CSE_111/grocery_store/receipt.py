import csv

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
    # Read products.csv into a dictionary
    try:
        products_dict = read_dictionary("PYTHON_CSE_111/grocery_store/products.csv", 0)
        print("All Products")
        print(products_dict)
    except Exception as e:
        print(f"Error reading products.csv: {e}")
        return  # Exit if we can't read products

    # Process request.csv
    try:
        with open("PYTHON_CSE_111/grocery_store/request.csv", "r") as csv_file:
            reader = csv.reader(csv_file)
            next(reader)  # Skip header
            print("\nOrdered Items:")
            for row in reader:
                product_number = row[0].strip()  # Product number
                quantity = int(row[1])  # Quantity
                try:
                    product_info = products_dict[product_number]# Product info fetches from dictionary
                    product_name = product_info[1]  # Name of product
                    price = float(product_info[2])  # Price of product
                    print(f"{product_name}: {quantity} @ {price:.2f}")
                except KeyError:
                    print(f"Error: Product {product_number} not found in products catalog.")
    except FileNotFoundError:
        print("Error: request.csv was not found.")
    except PermissionError:
        print("Error: Permission denied when accessing request.csv.")
    except ValueError:
        print("Error: Invalid data format in request.csv (e.g., non-numeric quantity).")

if __name__ == "__main__":
    main()