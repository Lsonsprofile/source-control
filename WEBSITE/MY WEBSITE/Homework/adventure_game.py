# This is a text-based adventure game where the player makes choices that affect the outcome of the story.
# i added the .strip() method to remove any leading or trailing whitespace from the users input to avoid invalid input.
print("\nWelcome to Lson's Text-Based Adventure Game!")
print("In this game, you must make choices that will affect your adventure.")

# Starting point of the game
print("\nYou arrive at Juliet's house. What do when you see her?")
action = input('Choose HUG, KISS, or WAVE: ').strip().lower()
# Decision-making based on the player's action
if action == "hug":
    # Level 2
    print("\nShe smiles and invites you in. What do you do next?")
    state = input('Choose SIT, TALK, or LEAVE: ').strip().lower()
# Decision-making based on the player's state
    if state == "sit":
        # the next level of the game determining the player's behaviour
        print("\nShe brings snacks. What do you say?")
        behaviour = input('Choose THANK, REFUSE, or ASK FOR MORE: ').strip().lower()
        
        if behaviour == "thank":
            print("\nShe is pleased. You both enjoy a lovely time together.")
        elif behaviour == "refuse":
            print("\nShe feels a bit sad. The visit ends awkwardly.")
        elif behaviour == "ask for more":
            print("\nShe laughs and brings more snacks. You become best friends.")
        else:
            print("\nInvalid choice. Juliet is confused. The visit ends early.")

    elif state == "talk":
          # decision-making based on the player's behaviour
        print("\nShe tells you a secret. How do you respond?")
        behaviour = input('Choose LAUGH, PROMISE, or IGNORE: ').strip().lower()

        if behaviour == "laugh":
            print("\nShe is offended. The mood is ruined.")
        elif behaviour == "promise":
            print("\nShe trusts you even more. You become close friends.")
        elif behaviour == "ignore":
            print("\nShe feels ignored. The conversation ends.")
        else:
            print("\nInvalid choice. Juliet leaves the room silently.")
    # final decision-making based on the player's state
    elif state == "leave":
        # final level of the game determining the player's behaviour
        print("\nShe seems disappointed. Do you:")
        behaviour = input('Choose TEXT LATER, CALL, or GHOST: ').strip().lower()

        if behaviour == "text later":
            print("\nShe appreciates your message. You're on good terms.")
        elif behaviour == "call":
            print("\nShe’s happy to hear your voice. Friendship saved.")
        elif behaviour == "ghost":
            print("\nShe never hears from you again. Sad ending.")
        else:
            print("\nInvalid choice. The relationship fades away.")
    else:
        print("\nInvalid choice. Juliet doesn't understand you and closes the door.")

elif action == "kiss":
    # ddecision-making based on the player's action
    print("\nJuliet is surprised! and slap you. what do you do?")
    state = input('Choose SMILE, SHOCKED, or CRY: ').strip().lower()
    # Decision-making based on the player's state
    if state == "smile":
        # decision-making based on the player's behaviour
        print("\nYou both laugh. What next?")
        behaviour = input('Choose DANCE, SING, or STARE: ').strip().lower()

        if behaviour == "dance":
            print("\nYou dance happily! Fun day!")
        elif behaviour == "sing":
            print("\nYour singing is awful. She laughs anyway.")
        elif behaviour == "stare":
            print("\nShe finds it awkward. Moment ruined.")
        else:
            print("\nInvalid choice. The moment becomes awkward.")

    elif state == "shocked":
        # Level 3
        print("\nYou hold your cheek in shock. What now?")
        behaviour = input('Choose APOLOGIZE, RUN, or ARGUE: ').strip().lower()

        if behaviour == "apologize":
            print("\nShe forgives you. Lesson learned.")
        elif behaviour == "run":
            print("\nYou run away forever. Game Over.")
        elif behaviour == "argue":
            print("\nThe argument turns ugly. Bad ending.")
        else:
            print("\nInvalid response. Things end badly.")

    elif state == "cry":
        # Level 3
        print("\nShe gets emotional too. What do you do?")
        behaviour = input('Choose COMFORT, LEAVE, or HUG AGAIN: ').strip().lower()

        if behaviour == "comfort":
            print("\nYou both talk it through and grow closer.")
        elif behaviour == "leave":
            print("\nYou leave quietly. A missed connection.")
        elif behaviour == "hug again":
            print("\nShe hugs back. Things calm down.")
        else:
            print("\nConfused response. Juliet walks away.")
    else:
        print("\nInvalid choice. Juliet is speechless and walks away.")

elif action == "wave":
    # Level 2
    print("\nShe waves back from the balcony. What next?")
    state = input('Choose ENTER, TEXT, or LEAVE: ').strip().lower()

    if state == "enter":
        # Level 3
        print("\nYou walk in confidently. She greets you. How do you act?")
        behaviour = input('Choose COMPLIMENT, JOKE, or STAY SILENT: ').strip().lower()

        if behaviour == "compliment":
            print("\nShe blushes. You make her day.")
        elif behaviour == "joke":
            print("\nShe laughs out loud. Good chemistry.")
        elif behaviour == "stay silent":
            print("\nAwkward silence. Try again another time.")
        else:
            print("\nYou freeze. She slowly closes the door.")

    elif state == "text":
        # Level
        print("\nShe checks her phone. What do you send?")
        behaviour = input('Choose HI, LOVE EMOJI, or A POEM: ').strip().lower()

        if behaviour == "hi":
            print("\nShe replies with a smiley. Simple start.")
        elif behaviour == "love emoji":
            print("\nToo soon! She blocks you. Ouch.")
        elif behaviour == "a poem":
            print("\nShe loves poetry. You're in!")
        else:
            print("\nShe doesn’t understand the message. No reply.")

    elif state == "leave":
        # Level 3
        print("\nYou walk away. Do you:")
        behaviour = input('Choose REGRET, MOVE ON, or COME BACK: ').strip().lower()

        if behaviour == "regret":
            print("\nYou wonder what could have been. Sad ending.")
        elif behaviour == "move on":
            print("\nYou meet someone new. Life continues.")
        elif behaviour == "come back":
            print("\nShe’s still on the balcony. She smiles.")
        else:
            print("\nYou wander aimlessly. Game Over.")
    else:
        print("\nInvalid choice. Juliet gets confused and walks inside.")
else:
    print("\nInvalid first move. The adventure ends before it begins.")


