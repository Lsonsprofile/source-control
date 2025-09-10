# fetch file name from dictionary
with open(r"C:\Users\Okey\AppData\Roaming\Code\User\source-control\WEBSITE\MY WEBSITE\Homework\hr_system.txt") as hr_system_file:
    # skip the first line
    next(hr_system_file)
    
    # loop and read through each file line by line and print each line
    for line in hr_system_file:
        payroll_line = line.strip().split(" ")
        name = payroll_line[0]
        id = int(payroll_line[1])
        job_title = payroll_line[2]
        salary = float(payroll_line[3])
        
        # caluculate the paycheck amount
        pay_amount = salary / 24
        
        # adds 1000 to the pay amount if the job title is engineer
        if "engineer" in job_title.lower():
            pay_amount += 1000
            
        # Alexia (ID: 1913), Engineer - $84000.00
        # print the employee details
        print(f"{name} (ID: {id}), {job_title} - ${pay_amount:.2f}")
