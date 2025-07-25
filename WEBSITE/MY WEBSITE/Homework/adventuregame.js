// Text-Based Adventure Game: Juliet's House
console.log("\nWelcome to Lson's Text-Based Adventure Game!");
console.log("In this game, you must make choices that will affect your adventure.");

// Using readline for user input in Node.js
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function startGame() {
  // Level 1
  console.log("\nYou arrive at Juliet's house. What do you do?");
  rl.question('Choose HUG, KISS, or WAVE: ', (choice1) => {
    choice1 = choice1.trim().toLowerCase();

    if (choice1 === "hug") {
      // Level 2
      console.log("\nShe smiles and invites you in. What do you do next?");
      rl.question('Choose SIT, TALK, or LEAVE: ', (choice2) => {
        choice2 = choice2.trim().toLowerCase();

        if (choice2 === "sit") {
          // Level 3
          console.log("\nShe brings snacks. What do you say?");
          rl.question('Choose THANK, REFUSE, or ASK FOR MORE: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();
            
            if (choice3 === "thank") {
              console.log("\nShe is pleased. You both enjoy a lovely time together.");
            } else if (choice3 === "refuse") {
              console.log("\nShe feels a bit sad. The visit ends awkwardly.");
            } else if (choice3 === "ask for more") {
              console.log("\nShe laughs and brings more snacks. You become best friends.");
            } else {
              console.log("\nInvalid choice. Juliet is confused. The visit ends early.");
            }
            rl.close();
          });
        } else if (choice2 === "talk") {
          // Level 3
          console.log("\nShe tells you a secret. How do you respond?");
          rl.question('Choose LAUGH, PROMISE, or IGNORE: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "laugh") {
              console.log("\nShe is offended. The mood is ruined.");
            } else if (choice3 === "promise") {
              console.log("\nShe trusts you even more. You become close friends.");
            } else if (choice3 === "ignore") {
              console.log("\nShe feels ignored. The conversation ends.");
            } else {
              console.log("\nInvalid choice. Juliet leaves the room silently.");
            }
            rl.close();
          });
        } else if (choice2 === "leave") {
          // Level 3
          console.log("\nShe seems disappointed. Do you:");
          rl.question('Choose TEXT LATER, CALL, or GHOST: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "text later") {
              console.log("\nShe appreciates your message. You're on good terms.");
            } else if (choice3 === "call") {
              console.log("\nShe's happy to hear your voice. Friendship saved.");
            } else if (choice3 === "ghost") {
              console.log("\nShe never hears from you again. Sad ending.");
            } else {
              console.log("\nInvalid choice. The relationship fades away.");
            }
            rl.close();
          });
        } else {
          console.log("\nInvalid choice. Juliet doesn't understand you and closes the door.");
          rl.close();
        }
      });
    } else if (choice1 === "kiss") {
      // Level 2
      console.log("\nJuliet is surprised! What does she do?");
      rl.question('Choose SMILE, SLAP, or CRY: ', (choice2) => {
        choice2 = choice2.trim().toLowerCase();

        if (choice2 === "smile") {
          // Level 3
          console.log("\nYou both laugh. What next?");
          rl.question('Choose DANCE, SING, or STARE: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "dance") {
              console.log("\nYou dance happily! Fun day!");
            } else if (choice3 === "sing") {
              console.log("\nYour singing is awful. She laughs anyway.");
            } else if (choice3 === "stare") {
              console.log("\nShe finds it awkward. Moment ruined.");
            } else {
              console.log("\nInvalid choice. The moment becomes awkward.");
            }
            rl.close();
          });
        } else if (choice2 === "slap") {
          // Level 3
          console.log("\nYou hold your cheek in shock. What now?");
          rl.question('Choose APOLOGIZE, RUN, or ARGUE: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "apologize") {
              console.log("\nShe forgives you. Lesson learned.");
            } else if (choice3 === "run") {
              console.log("\nYou run away forever. Game Over.");
            } else if (choice3 === "argue") {
              console.log("\nThe argument turns ugly. Bad ending.");
            } else {
              console.log("\nInvalid response. Things end badly.");
            }
            rl.close();
          });
        } else if (choice2 === "cry") {
          // Level 3
          console.log("\nShe gets emotional too. What do you do?");
          rl.question('Choose COMFORT, LEAVE, or HUG AGAIN: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "comfort") {
              console.log("\nYou both talk it through and grow closer.");
            } else if (choice3 === "leave") {
              console.log("\nYou leave quietly. A missed connection.");
            } else if (choice3 === "hug again") {
              console.log("\nShe hugs back. Things calm down.");
            } else {
              console.log("\nConfused response. Juliet walks away.");
            }
            rl.close();
          });
        } else {
          console.log("\nInvalid choice. Juliet is speechless and walks away.");
          rl.close();
        }
      });
    } else if (choice1 === "wave") {
      // Level 2
      console.log("\nShe waves back from the balcony. What next?");
      rl.question('Choose ENTER, TEXT, or LEAVE: ', (choice2) => {
        choice2 = choice2.trim().toLowerCase();

        if (choice2 === "enter") {
          // Level 3
          console.log("\nYou walk in confidently. She greets you. How do you act?");
          rl.question('Choose COMPLIMENT, JOKE, or STAY SILENT: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "compliment") {
              console.log("\nShe blushes. You make her day.");
            } else if (choice3 === "joke") {
              console.log("\nShe laughs out loud. Good chemistry.");
            } else if (choice3 === "stay silent") {
              console.log("\nAwkward silence. Try again another time.");
            } else {
              console.log("\nYou freeze. She slowly closes the door.");
            }
            rl.close();
          });
        } else if (choice2 === "text") {
          // Level 3
          console.log("\nShe checks her phone. What do you send?");
          rl.question('Choose HI, LOVE EMOJI, or A POEM: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "hi") {
              console.log("\nShe replies with a smiley. Simple start.");
            } else if (choice3 === "love emoji") {
              console.log("\nToo soon! She blocks you. Ouch.");
            } else if (choice3 === "a poem") {
              console.log("\nShe loves poetry. You're in!");
            } else {
              console.log("\nShe doesn't understand the message. No reply.");
            }
            rl.close();
          });
        } else if (choice2 === "leave") {
          // Level 3
          console.log("\nYou walk away. Do you:");
          rl.question('Choose REGRET, MOVE ON, or COME BACK: ', (choice3) => {
            choice3 = choice3.trim().toLowerCase();

            if (choice3 === "regret") {
              console.log("\nYou wonder what could have been. Sad ending.");
            } else if (choice3 === "move on") {
              console.log("\nYou meet someone new. Life continues.");
            } else if (choice3 === "come back") {
              console.log("\nShe's still on the balcony. She smiles.");
            } else {
              console.log("\nYou wander aimlessly. Game Over.");
            }
            rl.close();
          });
        } else {
          console.log("\nInvalid choice. Juliet gets confused and walks inside.");
          rl.close();
        }
      });
    } else {
      console.log("\nInvalid first move. The adventure ends before it begins.");
      rl.close();
    }
  });
}

// Start the game
startGame();