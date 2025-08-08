# i showed extra creativity by  adding a menu for the user to choose between 3 modes of operation
# i also added a feature that allows the user to choose between search modes ( country or year search method)
# i made the program not to stop running until the user chooses to exit

# Open the life expectancy CSV file
file_path = r'C:\Users\Okey\AppData\Roaming\Code\User\source-control\WEBSITE\MY WEBSITE\Homework\life-expectancy.csv'

menu_choice = ""

# Main menu loop
while menu_choice != "3":
    # Mode selection
    print("\n**Welcome to the Life Expectancy Data Explorer**")
    print("Choose search mode:")
    print("1 - Search by year")
    print("2 - Search by country")
    print("3 - Exit")

    menu_choice = input("Enter choice (1, 2 or 3): ").strip()

    # Validate menu choice
    while menu_choice not in ["1", "2", "3"]:
        print("--->Invalid choice! Please enter 1, 2 or 3.")
        print("\n**Welcome to the Life Expectancy Data Explorer**")
        print("Choose search mode:")
        print("1 - Search by year")
        print("2 - Search by country")
        print("3 - Exit")
        menu_choice = input("Enter choice (1, 2 or 3): ").strip()

    # Exit if chosen
    if menu_choice == "3":
        print("\n--->Exiting program. Goodbye!")
        break
    else:
        search_again = "Yes"

        # Loop until user says "No"
        while search_again == "Yes":
            with open(file_path) as life_expectancy_file:
                next(life_expectancy_file)  # Skip header

                # Track global min/max
                lowest_value = float('inf')
                lowest_country = ""
                lowest_year = ""
                highest_value = float('-inf')
                highest_country = ""
                highest_year = ""

                # code for menu choice 1 - search by year
                if menu_choice == "1":
                    user_year = input("Enter the year of interest: ").strip()
                    year_total = 0
                    year_count = 0
                    year_min_value = float('inf')
                    year_min_country = ""
                    year_max_value = float('-inf')
                    year_max_country = ""

                    for line in life_expectancy_file:
                        columns = line.strip().split(',')
                        country = columns[0]
                        year = columns[2]
                        life_exp = float(columns[3])

                        # Global min/max
                        if life_exp < lowest_value:
                            lowest_value = life_exp
                            lowest_country = country
                            lowest_year = year
                        if life_exp > highest_value:
                            highest_value = life_exp
                            highest_country = country
                            highest_year = year

                        # Year stats
                        if year == user_year:
                            year_total += life_exp
                            year_count += 1
                            if life_exp < year_min_value:
                                year_min_value = life_exp
                                year_min_country = country
                            if life_exp > year_max_value:
                                year_max_value = life_exp
                                year_max_country = country

                    # Output results for user year
                    print(f"\nThe overall max life expectancy was {highest_value} from {highest_country} in {highest_year}.")
                    print(f"The overall min life expectancy was {lowest_value} from {lowest_country} in {lowest_year}.")

                    if year_count > 0:
                        average_life = year_total / year_count
                        print(f"\nFor the year {user_year}:")
                        print(f"The average life expectancy across all countries was {average_life:.2f}")
                        print(f"The max life expectancy was in {year_max_country} with {year_max_value}")
                        print(f"The min life expectancy was in {year_min_country} with {year_min_value}")
                    else:
                        print(f"\n--->No data available for the year {user_year}.")

                # code for menu choice 2 - search by country
                elif menu_choice == "2":
                    user_country = input("Enter a country: ").strip().lower()
                    country_total = 0
                    country_count = 0
                    country_min_value = float('inf')
                    country_min_year = ""
                    country_max_value = float('-inf')
                    country_max_year = ""

                    for line in life_expectancy_file:
                        columns = line.strip().split(',')
                        country = columns[0].lower()
                        year = columns[2]
                        life_exp = float(columns[3])

                        # Global min/max
                        if life_exp < lowest_value:
                            lowest_value = life_exp
                            lowest_country = columns[0]
                            lowest_year = year
                        if life_exp > highest_value:
                            highest_value = life_exp
                            highest_country = columns[0]
                            highest_year = year

                        # Country stats
                        if country == user_country:
                            country_total += life_exp
                            country_count += 1
                            if life_exp < country_min_value:
                                country_min_value = life_exp
                                country_min_year = year
                            if life_exp > country_max_value:
                                country_max_value = life_exp
                                country_max_year = year

                    # Output results for country
                    print(f"\nThe overall max life expectancy was {highest_value} from {highest_country} in {highest_year}.")
                    print(f"The overall min life expectancy was {lowest_value} from {lowest_country} in {lowest_year}.")

                    if country_count > 0:
                        print(f"\nFor the country {user_country.capitalize()}:")
                        print(f"The average life expectancy was {country_total / country_count:.2f}")
                        print(f"The max life expectancy was {country_max_value} in {country_max_year}")
                        print(f"The min life expectancy was {country_min_value} in {country_min_year}")
                    else:
                        print(f"\n--->There is no data for the country {user_country}.")

           # Ask if the user wants to search again in same mode
            search_again = input("\nDo you want to search again in the same mode? (Yes/No): ").strip().lower()
            while search_again not in ["yes", "no"]:
                search_again = input("--->Invalid choice! Please type Yes or No: ").strip().lower()

            if search_again == "no":
                print("\n--->Back to main menu!")

                