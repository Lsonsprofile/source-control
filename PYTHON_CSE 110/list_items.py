numbers = []

input_numbers = -1

while input_numbers != 0: 
    input_numbers = int(input("Enter any none decimal number and press enter then 0 to end: "))
    if input_numbers != 0:
        numbers.append(input_numbers)
        
print(f"\n List of numbers is: {numbers}")

total = 0
for num in numbers:
    total += num

count = len(numbers)
if count > 0:
    average = total / count
else:
    average = 0

largest_number = numbers[0]
for num in numbers:
    if num > largest_number:
        largest_number = num

smallest_number = numbers[0]
for num in numbers:
    if num < smallest_number:
        smallest_number = num

smallest_positive_number = 99999999999999999999
found_positive = False
for num in numbers:
    if num > 0 and num < smallest_positive_number:
        smallest_positive_number = num
        found_positive = True

if not found_positive:
    print("\nThere are no positive numbers in the list")
else:
    print(f"\nThe smallest positive number is {smallest_positive_number}")  

print(f"\nThe sum of the numbers is {total}")
print(f"\nThe average of the numbers is {average}")
print(f"\nThe largest number is {largest_number}")
print(f"\nThe smallest number is {smallest_number}")
