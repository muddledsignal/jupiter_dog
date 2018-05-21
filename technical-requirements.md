need in App.JS
An object for everything that's gonna appear on canvas, with properties xPosition yPosition xVelocity yVelocity and Image (possibly other info too)
An array of all of said objects.  Or possibly multiple arrays (one for bullets, one for bad guys, one for everything else)
A function to draw each of those objects on the canvas
A function to move each object one 'tick'  (xPosition = Xposition + X velocity, etc).
A check to make sure that the movement didn't push the object off the page.
A function to check Collisions between each bad guy object and the player's bullets.
A function to check for Collisions between the player and bad guys, and bad-guy bullets.
An array of high-scores.
A high-score sorting function, to put your name in the game.
Event listeners. Move left, move right, shoot.
Functions to handle.
A function to initialize the game.
An event listener to initialize the game.
Function to handle.  Should also disable the E.L.
An endGame function
a Constructor function for all the various objects.