This project is a full-stack web application where users can play Blackjack and compete on a leaderboard for the top spot.

-Features-
The site features user authentication with JWT tokens,
An fully functional interactive Blackjack game with ASCII playing cards,
Virtual gambling system with server-side token tracking,
Game result logging such as wins and losses, and total amount of tokens won,
A leaderboard tracking the top ten players by total winnings,
Built with Angular, Node.js, Express, and MongoDB.

-Tech Stack-
The frontend is controlled with Angular, TypeScript, RxJS and HTML/CSS files.
The backend is controlled with Node, Express and Mongoose.
Databases of users and their passwords, as well as leaderboard data is tracked via MongoDB.

-Gameplay Overview-
Players start with a virtual coin balance,
Each round, the player places a bet,
Cards are dealt to both the player and the dealer,
Player can "Hit" or "Stand" to try to beat the dealer without busting,
Coins are updated based on round outcome,
All rounds are logged server-side.

-Leaderboard-
Tracks each user's number of wins and total coins won,
Aggregated from all logged game results,
Displays top players sorted by total winnings.

-Authentication-
Users must log in to play,
Token-based auth secures API routes,
Coin balance is tied to user account.

To run the project from the editor, you must cd into /Backend and enter the command "node server.js", then cd into /Frontend/angular-frontend and enter the command "ng serve".

-Team roles-
DJ and Chris; Login and Signup screen visuals, passing user information
Chris set up the database on the MongoDB website
Brian set up JWT authentication between pages
DJ, Chris, Brian; Playable games of Blackjack, game interface and interactive elements, currency, and ASCII card art
DJ and Chris; Stat tracking and leaderboard page
DJ and Chris; Set up the deployment
DJ, Chris, Brian; Documentation and presentation writing

-App Deployment link-


-Presentation link-


-Instructions to run file-
Create a file named ".env" in Backend and add the following lines;
JWT_SECRET='yourSuperEpicSecretKey'
MONGODB_URI='mongodb+srv://christopher:passw0rd@cluster0.pwjrtzs.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0'