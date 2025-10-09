import tkinter as tk
from tkinter import Frame, Label, Button
from number_entry import IntEntry   # custom class, must exist in same folder
import random


def main():
    # Create the root window
    root = tk.Tk()
    
    #add font and text size 
    root.option_add('*Font', 'Arial 14')

    # Create a frame inside the window
    frm_main = Frame(root)
    frm_main.master.title("Dice")

    # Add padding and make the frame expand to fill space
    frm_main.pack(padx=3, pady=3, fill=tk.BOTH, expand=True)

    # Call the setup function to build the rest of the GUI
    setup_main(frm_main)

    # Keep the main window always on top
    root.attributes("-topmost", True)
    # Run the Tkinter event loop
    root.mainloop()


def setup_main(frm):
    # Create a label for number of sides
    lbl_sides = Label(frm, text="Number of sides on dice (2-20):")
    lbl_sides.grid(row=0, column=0)

    # Create a number entry widget for number of sides
    ent_sides = IntEntry(frm, lower_bound=2, upper_bound=20)
    ent_sides.grid(row=0, column=1)

    # Label and entry for number of dice
    lbl_count = Label(frm, text="Enter the number of dice to roll (1-10):")
    lbl_count.grid(row=1, column=0)
    ent_count = IntEntry(frm, lower_bound=1, upper_bound=10)
    ent_count.grid(row=1, column=1)

    # Create button for the dice roll
    btn_roll = Button(frm, text="Roll dice")
    btn_roll.grid(row=2, column=0)

    # Create a label for the result
    lbl_result = Label(frm, text="Result:")
    lbl_result.grid(row=3, column=0, columnspan=2)

    # --- define roll function inside setup_main ---
    def roll_action():
        # first try block for sides
        try:
            sides = ent_sides.get()
        except ValueError:
            lbl_result.config(text="Enter a valid number of sides (2–20).")
            return  # stop if invalid

        # second try block for dice count
        try:
            count = ent_count.get()
        except ValueError:
            lbl_result.config(text="Enter a valid number of dice (1–10).")
            return  # stop if invalid

        # fixed: removed undefined lbltext/lbl_roll, use lbl_result directly
        roll_text = ""
        total = 0
        for _ in range(count):
            roll = random.randint(1, sides)
            total += roll
            roll_text += f"{roll} "

        # fixed: update existing label with result
        lbl_result.config(text=f"Rolls: {roll_text.strip()} | Total: {total}")

    # fixed: assign correct command to button
    btn_roll.bind("<Button-1>", lambda event: roll_action())# can be replaed with "btn_roll.config(command=roll_action)"


if __name__ == "__main__":
    main()
